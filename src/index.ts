import Promise from 'bluebird';

import Plugin from './plugin';
import { saveBase64Screenshot, saveTestImages } from './reporter-helpers';

import ReportBuilder from './report-builder/report-builder';
import { IHermione, IPluginOpts } from './types';
import { IHermioneResult, IHermioneStats } from './report-builder/types';
import TestResult from './test-result/test-result';

module.exports = (hermione: IHermione, opts: IPluginOpts): void => {
  const plugin = new Plugin(hermione, opts);

  if (!plugin.isEnabled()) {
    return;
  }

  plugin
    .addCliCommands()
    .init(prepareData, prepareImages);
};

const prepareData = (
  hermione: IHermione,
  reportBuilder: ReportBuilder,
) => {
  const failHandler = (testResult: IHermioneResult): TestResult => {
    const formattedResult = reportBuilder.format(testResult);

    return formattedResult.hasDiff()
      ? reportBuilder.addFail(testResult)
      : reportBuilder.addError(testResult);
  };

  return new Promise((resolve) => {
    // Test is skipped
    hermione.on(hermione.events.TEST_PENDING, (testResult: IHermioneResult) =>
      reportBuilder.addSkipped(testResult));

    hermione.on(hermione.events.TEST_PASS, (testResult: IHermioneResult) =>
      reportBuilder.addSuccess(testResult));

    hermione.on(hermione.events.TEST_FAIL, failHandler);

    hermione.on(hermione.events.RETRY, failHandler);

    // Will be triggered after test execution.
    // The handler accepts a stats of tests execution.
    hermione.on(hermione.events.RUNNER_END, (stats: IHermioneStats) =>
      resolve(reportBuilder.setStats(stats)));
  });
};

const prepareImages = (
  hermione: IHermione,
  pluginConfig: IPluginOpts,
  reportBuilder: ReportBuilder,
) => {
  const { path: reportPath } = pluginConfig;

  const failHandler = (testResult: IHermioneResult) => {
    const formattedResult = reportBuilder.format(testResult);
    const actions = [saveTestImages(formattedResult, reportPath)];

    if (formattedResult.screenshot) {
      actions.push(saveBase64Screenshot(formattedResult, reportPath));
    }

    return Promise.all(actions);
  };

  return new Promise((resolve, reject) => {
    let queue: Promise<any> = Promise.resolve();

    hermione.on(hermione.events.TEST_PASS, (testResult) => {
      queue = queue.then(() => saveTestImages(reportBuilder.format(testResult), reportPath));
    });

    hermione.on(hermione.events.RETRY, (testResult) => {
      queue = queue.then(() => failHandler(testResult));
    });

    hermione.on(hermione.events.TEST_FAIL, (testResult) => {
      queue = queue.then(() => failHandler(testResult));
    });

    hermione.on(hermione.events.RUNNER_END, () => queue.then(resolve, reject));
  });
};
