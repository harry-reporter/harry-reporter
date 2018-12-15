export interface NavItem {
  component: JSX.Element;
  name: NavItemId;
}
export interface NavigationProps {
  dataList: NavItem[];
  className: string;

  onChange: (e) => NavItemId;
}
export interface NavigationState {
  selectedId: NavItemId;
}

export type NavItemId = number | string;
