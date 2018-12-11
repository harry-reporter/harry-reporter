export function switchTestViewMod(testsViewMode: string): boolean {
  let isOpen = false;
  switch (testsViewMode) {
    case 'collapseAll':
      isOpen = false;
      break;
    case 'expandAll':
      isOpen = true;
      break;
    case 'expandErrors':
      // условие по ошибкам
      break;
    case 'expandRetries':
      isOpen = true;
      break;
  }
  return isOpen;
}
