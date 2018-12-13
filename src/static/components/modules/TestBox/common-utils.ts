import { ColorType } from 'src/components/ui/types';
import { ChevronUp, ChevronDown } from '@githubprimer/octicons-react';
import { TestsViewMode } from 'src/store/modules/app/types';

export function switchTestViewMod(
  testsViewMode: string,
  status?: string,
): boolean {
  switch (testsViewMode) {
    case TestsViewMode.collapseAll:
      return false;
    case TestsViewMode.expandAll:
      return true;
    case TestsViewMode.expandRetries:
      return true;
    case TestsViewMode.expandErrors:
    default:
      return status !== 'success';
  }
}

export function getColor(status: string): ColorType {
  let color: ColorType = 'gray';
  if (status === 'success') {
    color = 'green';
  }
  if (status === 'fail') {
    color = 'red';
  }
  return color;
}

export const getChevron = (isOpen: boolean) => (isOpen ? ChevronUp : ChevronDown);
