import clientEvents from '../constants/client-events';
import { findTestResult } from './utils';

// const { RUNNING } = require('../../../constants/test-statuses');
// const { getSuitePath } = require('../../../plugin-utils').getHermioneUtils();
// const { saveTestImages, saveBase64Screenshot } = require('../../../reporter-helpers');
//
const RUNNING = 'a';
const getSuitePath = (a: any) => console.log(1);
const saveTestImages = (a: any, b: any) => Promise.resolve();
const saveBase64Screenshot = (a: any, b: any) => Promise.resolve();
//

export default (hermione: any, reportBuilder: any, client: any, reportPath: string) => {
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

    const testResult = findTestResult(reportBuilder.getSuites(), formattedResult.prepareTestResult());
    failHandler(data)
      .then(() => client.emit(clientEvents.TEST_RESULT, testResult));
  });

  hermione.on(hermione.events.RETRY, (data: any) => {
    reportBuilder.addRetry(data);

    failHandler(data);
  });

  hermione.on(hermione.events.RUNNER_END, () => {
    return reportBuilder.save()
      .then(() => client.emit(clientEvents.END));
  });
};
