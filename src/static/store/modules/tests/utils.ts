import { CompiledData, Suite, TestsStore } from 'src/store/modules/tests/types';

const formatSuitesData = (suites: Suite[]): Suite[] => {
  const newListTest: any[] = [];

  function findChildren(object: Suite) {
    let obj;

    if (object.children) {
      object.children.map((elem) => {
        obj = findChildren(elem);
        newListTest.push(obj);
      });
      return obj;
    }

    return object;
  }

  suites.map((elem) => {
    findChildren(elem);
  });

  return newListTest;
};

export const getInitialState = (compiledData: CompiledData): TestsStore => {
  const { skips, suites, total, passed, failed, skipped, retries, gui = false } = compiledData;
  const tests = formatSuitesData(suites);

  return {
    gui,
    skips,
    tests,
    stats: {
      total, passed, failed, skipped, retries,
    },
  };
};
