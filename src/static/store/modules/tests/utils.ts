import { CompiledData, Suite, TestsStore } from 'src/store/modules/tests/types';

const formatSuitesData = (suites: Suite[]): Suite[] => {
  const newListTest: any[] = [];

  function findChildren(object: Suite) {
    let obj;

    if (object.children) {
      object.children.map((elem, i) => {
        obj = findChildren(elem);

        // Заполним вспомогательное поле uuid для TestBox - пригодится для обновления сосотояния внутри redux
        // самый простой способ использовать текущий счётчик длины плоского массива newListTest
        // todo: подумать над генерацией nanoid или т.п.
        obj.uuid = newListTest.length;
        obj.browsers.map((browser, i) => {
          browser.browsersId = `${obj.uuid}${browser.name}`;
          browser.result.imagesInfo.map((view, i) => {
            view.viewId = `${obj.uuid}${browser.name}result${i}`;
          });
          browser.retries.map((retry, i) => {
            retry.imagesInfo.map((view, i) => {
              view.viewId = `${obj.uuid}${browser.name}retries${i}`;
            });
          });
        });
        console.log(obj);
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
  const {
    skips,
    suites,
    total,
    passed,
    failed,
    skipped,
    retries,
  } = compiledData;
  const tests = formatSuitesData(suites);

  return {
    skips,
    tests,
    stats: {
      total,
      passed,
      failed,
      skipped,
      retries,
    },
  };
};
