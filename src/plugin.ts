'use strict';

import Promise from 'bluebird';
import fs from 'fs-extra';
import _ from 'lodash';

import cliCommands from './cli-commands';
import parseConfig from './config';
import ReportBuilder from './report-builder/report-builder';
import utils from './server-utils';
import { IHermione, IPluginOpts, prepareDataType, prepareImagesType } from './types';

Promise.promisifyAll(fs);

export default class Plugin {
  private hermione: IHermione;
  private config: IPluginOpts;

  constructor(hermione: IHermione, opts: IPluginOpts) {
    this.hermione = hermione;
    this.config = parseConfig(opts);
  }

  public isEnabled() {
    return this.config.enabled;
  }

  public addCliCommands() {
    _.values(cliCommands).forEach((command: string) => {
      this.hermione.on(this.hermione.events.CLI, (commander: any) => {
        require(`./cli-commands/${command}`)(commander, this.config, this.hermione);
        commander.prependListener(`command:${command}`, () => this.run = _.noop);
      });
    });

    return this;
  }

  public init(prepareData: prepareDataType, prepareImages: prepareImagesType) {
    this.hermione.on(this.hermione.events.INIT, () => this.run(prepareData, prepareImages));

    return this;
  }

  private run(prepareData: prepareDataType, prepareImages: prepareImagesType) {
    const reportBuilder = new ReportBuilder(this.hermione, this.config);
    const generateReport = Promise
      .all([
        prepareData(this.hermione, reportBuilder),
        prepareImages(this.hermione, this.config, reportBuilder),
      ])
      .then(() => reportBuilder.save())
      .then(utils.logPathToHtmlReport)
      .catch(utils.logError);

    this.hermione.on(this.hermione.events.RUNNER_END, () => generateReport);
  }
}
