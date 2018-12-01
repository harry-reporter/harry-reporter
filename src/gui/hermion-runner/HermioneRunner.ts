import Promise from 'bluebird';
import chalk from 'chalk';
import _ from 'lodash';
import path from 'path';
import * as utils from '../../server-utils';
import EventSource from '../event-source';
import subscribeOnToolEvents from './report-subscriber';
import Runner from './runner';
import { findTestResult, formatId, formatTests, getShortMD5, mkFullTitle } from './utils';
import { findNode } from '../../static/modules/utils';

// const ReportBuilderFactory = require('../../report-builder-factory');
// const reporterHelper = require('../../reporter-helpers');
//
const ReportBuilderFactory: any = {};
const reporterHelper: any = {};
//

export default class HermioneRunner {
  public hermione: any;
  public globalOpts: any;
  public collection: any;
  public reportBuilder: any;
  public eventSource: any;
  public reportPath: string;
  private testFiles: string[];
  private treeObj: any;
  private guiOpts: any;
  private tests: any;

  constructor(paths: string, hermione: any, { program, pluginConfig, options }: any) {
    this.testFiles = [].concat(paths);
    this.hermione = hermione;
    this.treeObj = null;
    this.collection = null;

    this.globalOpts = program;
    this.guiOpts = options;
    this.reportPath = pluginConfig.path;

    this.eventSource = new EventSource();
    this.reportBuilder = ReportBuilderFactory.create(hermione, pluginConfig);

    this.tests = {};
  }

  get config() {
    return this.hermione.config;
  }

  get tree(): any {
    return this.tree;
  }

  public initialize() {
    return this.readTests()
      .then((collection: any) => {
        this.collection = collection;

        this.handleRunnableCollection();
        this.subscribeOnEvents();
      });
  }

  public run(tests: any[] = []) {
    const { grep, set: sets, browser: browsers } = this.globalOpts;
    const formattedTests = _.flatMap([].concat(tests), (test) => formatTests(test));

    return Runner(this.collection, formattedTests)
      .run((collection: any) => this.hermione.run(collection, { grep, sets, browsers }));
  }

  public fillTestsTree() {
    const { autoRun } = this.guiOpts;

    this.treeObj = Object.assign(this.reportBuilder.getResult(), { gui: true, autoRun });
    this.treeObj.suites = this.applyReuseData(this.treeObj.suites);
  }

  public updateReferenceImage(tests: any) {
    const reportBuilder = this.reportBuilder;

    return Promise.map(tests, (test) => {
      const updateResult = this.prepareUpdateResult(test);
      const formattedResult = reportBuilder.format(updateResult);

      return Promise.map(updateResult.imagesInfo, (imageInfo: any) => {
        const { stateName } = imageInfo;

        return reporterHelper.updateReferenceImage(formattedResult, this.reportPath, stateName)
          .then(() => {
            this.hermione.emit(
              this.hermione.events.UPDATE_RESULT,
              _.extend(updateResult, { imagePath: imageInfo.imagePath }),
            );
          });
      }).then(() => {
        reportBuilder.addUpdated(updateResult);

        return findTestResult(reportBuilder.getSuites(), formattedResult.prepareTestResult());
      });
    });
  }

  private handleRunnableCollection() {
    this.collection.eachTest((test: any, browserId: string) => {
      if (test.disabled || test.silentSkip) {
        return;
      }

      const testId = formatId(test.id(), browserId);
      this.tests[testId] = _.extend(test, { browserId });

      test.pending
        ? this.reportBuilder.addSkipped(test)
        : this.reportBuilder.addIdle(test);
    });

    this.fillTestsTree();
  }

  private subscribeOnEvents() {
    subscribeOnToolEvents(this.hermione, this.reportBuilder, this.eventSource, this.reportPath);
  }

  private prepareUpdateResult(test: any) {
    const { browserId, attempt } = test;
    const fullTitle = mkFullTitle(test);
    const testId = formatId(getShortMD5(fullTitle), browserId);
    const testResult = this.tests[testId];
    const { sessionId, url } = test.metaInfo;
    const imagesInfo = test.imagesInfo.map((imageInfo: any) => {
      const { stateName } = imageInfo;
      const imagePath = this.hermione.config.browsers[browserId].getScreenshotPath(testResult, stateName);

      return _.extend(imageInfo, { imagePath });
    });

    return _.merge({}, testResult, { imagesInfo, sessionId, attempt, meta: { url }, updated: true });
  }

  private finalize() {
    this.reportBuilder.saveDataFileSync();
  }

  private addClient(connection: any) {
    this.eventSource.addConnection(connection);
  }

  private sendClientEvent(event: any, data: any) {
    this.eventSource.emit(event, data);
  }

  private readTests() {
    const { grep, set: sets, browser: browsers } = this.globalOpts;

    return this.hermione.readTests(this.testFiles, { grep, sets, browsers });
  }

  private applyReuseData(testSuites: any) {
    if (!testSuites) {
      return;
    }

    const reuseData = this.loadReuseData();

    if (_.isEmpty(reuseData.suites)) {
      return testSuites;
    }

    return testSuites.map((suite: any) => applyReuse(reuseData)(suite));
  }

  private loadReuseData() {
    try {
      return require('../../' + path.resolve(this.reportPath, 'data'));
    } catch (e) {
      utils.logger.warn(chalk.yellow(`Nothing to reuse in ${this.reportPath}`));
      return {};
    }
  }
}

function applyReuse(reuseData: any) {
  let isBrowserResultReused = false;

  const reuseBrowserResult = (suite: any) => {
    if (suite.children) {
      suite.children = suite.children.map(reuseBrowserResult);

      return isBrowserResultReused
        ? _.set(suite, 'status', getReuseStatus(reuseData.suites, suite))
        : suite;
    }

    return _.set(suite, 'browsers', suite.browsers.map((bro: any) => {
      const browserResult = getReuseBrowserResult(reuseData.suites, suite.suitePath, bro.name);

      if (browserResult) {
        isBrowserResultReused = true;
        suite.status = getReuseStatus(reuseData.suites, suite);
      }

      return _.extend(bro, browserResult);
    }));
  };

  return reuseBrowserResult;
}

function getReuseStatus(reuseSuites: any, { suitePath, status: defaultStatus }: any) {
  const reuseNode = findNode(reuseSuites, suitePath);
  return _.get(reuseNode, 'status', defaultStatus);
}

function getReuseBrowserResult(reuseSuites: any, suitePath: any, browserId: any) {
  const reuseNode = findNode(reuseSuites, suitePath);
  return _.find(_.get(reuseNode, 'browsers'), { name: browserId });
}
