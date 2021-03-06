import clientEvents from '../constants/client-events';
import { findTestResult } from './utils';

import { IHermione } from '../../types';
import { getSuitePath } from '../../plugin-utils';
import { RUNNING } from '../../constants/test-statuses';
import ReportBuilder from '../../report-builder/report-builder';
import { saveTestImages, saveBase64Screenshot } from '../../reporter-helpers';

export default (
  hermione: IHermione,
  reportBuilder: ReportBuilder,
  client: any,
  reportPath: string,
) => {
  function failHandler(testResult: any) {
    const formattedResult = reportBuilder.format(testResult);
    const actions = [saveTestImages(formattedResult, reportPath)];

    if (formattedResult.screenshot) {
      actions.push(saveBase64Screenshot(formattedResult, reportPath));
    }

    return Promise.all(actions);
  }

  hermione.on(hermione.events.SUITE_BEGIN, (suite: any) => {
    if (suite.pending) {
      return;
    }

    client.emit(clientEvents.BEGIN_SUITE, {
      name: suite.title,
      status: RUNNING,
      suitePath: getSuitePath(suite),
    });
  });

  hermione.on(hermione.events.TEST_BEGIN, (data: any) => {
    const { browserId } = data;

    client.emit(clientEvents.BEGIN_STATE, {
      browserId,
      status: RUNNING,
      suitePath: getSuitePath(data),
    });
  });

  hermione.on(hermione.events.TEST_PASS, (data: any) => {
    const formattedTest = reportBuilder.addSuccess(data);
    const testResult = findTestResult(reportBuilder.getSuites(), formattedTest.prepareTestResult());

    saveTestImages(formattedTest, reportPath)
      .then(() => client.emit(clientEvents.TEST_RESULT, testResult));
  });

  hermione.on(hermione.events.TEST_FAIL, (data: any) => {
    const formattedResult = reportBuilder.format(data);

    formattedResult.hasDiff()
      ? reportBuilder.addFail(data)
      : reportBuilder.addError(data);

    const testResult = findTestResult(
      reportBuilder.getSuites(),
      formattedResult.prepareTestResult(),
    );
    failHandler(data)
      .then(() => client.emit(clientEvents.TEST_RESULT, testResult));
  });

  hermione.on(hermione.events.RETRY, (data: any) => {
    reportBuilder.addRetry(data);

    failHandler(data);
  });

  hermione.on(hermione.events.RUNNER_END, (stats) => {
    return reportBuilder
      .setStats(stats)
      .save()
      .then(() => client.emit(clientEvents.END, { stats }));
  });
};
