import { CompiledData, Suite, TestsStore } from 'src/store/modules/tests/types';
import Browser from 'src/components/modules/TestBox/Browser/Browser';

interface FormatSuitesDataArgs {
  suites: Suite[];
  filterSuites?: (suite: Suite) => boolean;
  reduceBrowsers?: (acc: Suite[], suite: Suite) => Suite[];
}

export const formatSuitesData = ({
  suites = [],
  filterSuites,
  reduceBrowsers,
}: FormatSuitesDataArgs) => {
  let result = suites.reduce<Suite[]>((acc, suite) => {
    if (suite.children) {
      let children = filterSuites
        ? suite.children.filter(filterSuites)
        : suite.children;
      if (reduceBrowsers) {
        children = children.reduce(reduceBrowsers, []);
      }
      return [...acc, ...children];
    }
    return acc;
  }, []);
  result = enchanceUuid(result);
  return result;
};

const enchanceUuid = (result) => {
  result.map((test, i) => {
    test.uuid = i;
    test.browsers.map((browser) => {
      browser.browsersId = `${test.uuid}${browser.name}`;
      browser.result.imagesInfo.map((view, index) => {
        view.viewId = `${test.uuid}${browser.name}result${index}`;
      });
      browser.retries.map((retry) => {
        retry.imagesInfo.map((view, index) => {
          view.viewId = `${test.uuid}${browser.name}retries${index}`;
        });
      });
    });
  });
  return result;
};

export const getInitialState = (compiledData: CompiledData): TestsStore => {
  const {
    skips,
    suites,
    total,
    passed,
    failed,
    skipped,
    retries,
    gui = false,
  } = compiledData;

  return {
    gui,
    skips,
    tests: suites,
    stats: {
      total,
      passed,
      failed,
      skipped,
      retries,
    },
  };
};
