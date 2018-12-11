export function switchTestViewMod(
  testsViewMode: string,
  status?: string,
): boolean {
  let isOpen = false;
  switch (testsViewMode) {
    case 'collapseAll':
      isOpen = false;
      break;
    case 'expandAll':
      isOpen = true;
      break;

    case 'expandRetries':
      isOpen = true;
      break;
    case 'expandErrors':
    default:
      isOpen = status !== 'success';
  }
  return isOpen;
}
