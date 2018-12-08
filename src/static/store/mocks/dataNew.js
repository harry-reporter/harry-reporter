export default {
  tests: [
    {
      title:
        'Колдунщик картинок / Многорядный в правой колонке с большой кнопкой перехода на Картинки / Кнопка "Еще картинки" с фоном вместо большой кнопки и тумбами со скруглениями и отступами Четырехрядный Нажатие на картинку открывает сервис',
      checks: [
        {
          status: 'fail',
          title: 'chrome-desktop',
          attempt: 0,
          tab: 2,
          error: {
            message: 'AssertionError: не сработал счетчик',
            stack: [
              'at assertCounters.allTriggeredCounters (/hermione/commands/commands-templar/common/checkCounter2.js:57:28)',
              'at runAssertCounters (/node_modules/hermione-get-counters/lib/commands/assert-counters.js:67:25)',
              'at <anonymous>',
              'at process._tickDomainCallback (internal/process/next_tick.js:228:7)',
              'at assertCountersd - checkCounter2.js:47:20',
            ],
            image: 'assets/images/3/chrome-desktop_current_7.png',
          },
        },
      ],
    },
    {
      title: 'Колдунщик чатов в правой колонке / написать всем / написать всем Написать всем',
      checks: [
        {
          status: 'fail',
          title: 'chrome-desktop',
          attempt: 0,
          tab: 2,
          asserts: [
            {
              status: 'fail',
              title: 'chat-list',
              images: {
                expected: 'assets/images/2/chrome-desktop_ref_7.png',
                actual: 'assets/images/2/chrome-desktop_current_7.png',
                diff: 'assets/images/2/chrome-desktop_diff_7.png',
              },
            },
          ],
        },
      ],
    },
    {
      title: 'Расширенный поиск Проверка фильтров Проверка выпадающего списка кнопки "Еще"',
      checks: [
        {
          status: 'fail',
          title: 'edge-desktop',
          attempt: 0,
          tab: 2,
          asserts: [
            {
              status: 'fail',
              title: 'lang-popup',
              images: {
                expected: 'assets/images/1/edge-desktop_ref_7.png',
                actual: 'assets/images/1/edge-desktop_current_7.png',
                diff: 'assets/images/1/edge-desktop_diff_7.png',
              },
            },
            {
              status: 'success',
              title: 'lang-popup2',
            },
          ],
        },
      ],
    },
    {
      title: 'Расширенный поиск Проверка фильтров Проверка выпадающего списка кнопки "Еще"',
      checks: [
        {
          status: 'fail',
          title: 'edge-desktop',
          attempt: 0,
          tab: 0,
          asserts: [
            {
              status: 'fail',
              title: 'lang-popup',
              images: {
                expected: 'assets/images/1/edge-desktop_ref_7.png',
                actual: 'assets/images/1/edge-desktop_current_7.png',
                diff: 'assets/images/1/edge-desktop_diff_7.png',
              },
            },
            {
              status: 'success',
              title: 'lang-popup2',
            },
          ],
          meta: {
            platform: 'desktop',
            url: '/search/?text=metallica',
            file: 'features/desktop/advanced-search/advanced-search.hermione.js',
            sessionId: 'sddsfs231',
          },
          code: `it('Расширенный поиск Проверка фильтров Проверка выпадающего списка кнопки "Еще"', function() {
    const PO = this.PO;
    return this.browser
        .shouldBeVisible(PO.advancedSearchLangPopup())
        .assertView('lang-popup', PO.advancedSearchLangPopup.menu())
        .keyPress('ARROW_UP')
        .shouldBeVisible(PO.advancedSearchLangPopup.lastItemHovered())
        .waitUntilPageReloaded(function() {
            return this.keyPress('ENTER');
        })
        .shouldBeVisible(PO.advancedSearchLangPopup.lastItemHovered())
        .shouldBeVisible(PO.advancedSearchLangPopup.lastItemChecked())
        .assertView('lang-popup2', PO.advancedSearchLangPopup.menu())
        .moveToObject(PO.advancedSearchLangPopup.firstItem())
        .waitUntilPageReloaded(function() {
            return this.click(PO.advancedSearchLangPopup.firstItemHovered());
        })
        .shouldBeVisible(PO.advancedSearchLangPopup())
        .shouldBeVisible(PO.advancedSearchLangPopup.firstItemHovered())
        .shouldBeVisible(PO.advancedSearchLangPopup.firstItemChecked())
        .shouldBeVisible(PO.advancedSearchLangPopup.lastItemChecked())
        .refresh()
        .waitUntilPageLoaded()
        .shouldBeVisible(PO.advancedSearchLangPopup())
        .shouldBeVisible(PO.advancedSearchLangPopup.firstItemHovered())
        .shouldBeVisible(PO.advancedSearchLangPopup.firstItemChecked())
        .shouldBeVisible(PO.advancedSearchLangPopup.lastItemChecked());
});`,
        },
      ],
    },
    {
      title: 'Расширенный поиск Проверка фильтров Проверка выпадающего списка кнопки "Еще"',
      checks: [
        {
          status: 'fail',
          title: 'edge-desktop',
          tab: 1,
          attempt: 0,
          asserts: [
            {
              status: 'fail',
              title: 'lang-popup',
              images: {
                expected: 'assets/images/1/edge-desktop_ref_7.png',
                actual: 'assets/images/1/edge-desktop_current_7.png',
                diff: 'assets/images/1/edge-desktop_diff_7.png',
              },
            },
            {
              status: 'success',
              title: 'lang-popup2',
            },
          ],
          meta: {
            platform: 'desktop',
            url: '/search/?text=metallica',
            file: 'features/desktop/advanced-search/advanced-search.hermione.js',
            sessionId: 'sddsfs231',
          },
          description: {
            steps: [
              'do: получить выдачу по запросу "metallica"',
              'assert: получена выдача по указанному запросу',
              'do: нажать на иконку "Расширенного поиска"',
              'assert: открылась форма расширенного поиска',
              'assert: по умолчанию ни один фильтр не выбран',
              'do: кликнуть по кнопке "Еще"',
              'assert: появился выпадающий список с языками',
              'assert: внешний вид соответствует скриншоту',
              'do: нажать кнопку "Вверх" на клавиатуре',
              'assert: последний элемент выпадающего списка выделен',
              'do: нажать кнопку "Enter" на клавиатуре',
              'assert: выдача перезагрузилась аяксом',
              'assert: последний элемент выпадающего списка выделен и выбран',
              'assert: внешний вид соответствует скриншоту',
              'do: навести курсор мыши на первый элемент выпадающего списка',
              'assert: первый элемент выпадающего списка выделен',
              'do: кликнуть в первый элемент выпадающего списка',
              'assert: выдача перезагрузилась аяксом',
              'assert: выпадающий список открыт',
              'assert: первый элемент выпадающего списка выделен',
              'assert: первый и последний элементы выпадающего списка выбраны',
              'do: обновить страницу',
              'assert: страница обновилась',
              'do: кликнуть по кнопке "Еще"',
              'assert: выпадающий список открыт',
              'assert: первый элемент выпадающего списка выделен',
              'assert: первый и последний элементы выпадающего списка выбраны',
            ],
          },
        },
      ],
    },
    {
      title: 'Расширенный поиск Проверка фильтров Проверка выпадающего списка кнопки "Еще"',
      checks: [
        {
          status: 'success',
          title: 'chrome-desktop',
            attempt: 0,
        },
        {
          status: 'success',
          title: 'firefox',
            attempt: 0,
        },
        {
          status: 'success',
          title: 'ie11',
            attempt: 0,
        },
      ],
    },
  ],
  total: 32,
  passed: 25,
  failed: 7,
  skipped: 0,
  retries: 0,
};
