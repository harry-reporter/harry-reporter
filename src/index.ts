import ScreenSaver from './ScreenSaver';

const harry = (hermione: any, opts: { path: string }): void => {

  const { path } = opts;
  const screenSaver = new ScreenSaver(path);

  hermione.on(hermione.events.INIT, () => {
    process.stdout.write('Harry init');
  });

  hermione.on(hermione.events.TEST_PASS, (testResult: {}) => {
    screenSaver.savePassedScreens(testResult);
  });

  hermione.on(hermione.events.TEST_FAIL, (testResult: {}) => {
    screenSaver.saveFailedScreens(testResult);
  });

};

module.exports = harry;
