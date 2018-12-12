import { CompiledData, Suite, TestsStore } from 'src/store/modules/tests/types';

interface FormatSuitesDataArgs {
  suites: Suite[];
  filterSuites?: (suite: Suite) => boolean;
  reduceBrowsers?: (acc: Suite[], suite: Suite) => Suite[];
}

export const formatSuitesData = ({ suites = [], filterSuites, reduceBrowsers }: FormatSuitesDataArgs) => {
  return suites.reduce<Suite[]>((acc, suite) => {
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
};

export const getInitialState = (compiledData: CompiledData): TestsStore => {
  const { skips, suites, total, passed, failed, skipped, retries, gui = false } = compiledData;

  return {
    gui,
    skips,
    tests: suites,
    stats: {
      total, passed, failed, skipped, retries,
    },
  };
};
