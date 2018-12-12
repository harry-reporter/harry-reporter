export interface IPaginationProps {
  maxPage?: number;
  hasPreventDefault?: boolean;
  defaultCurrentPage?: number;
  handleDataChange: (e) => void;
  pageCurrent: number;
  pageCount: number;

  onChange?: (currentPage: number) => any;
}
export interface PaginationState {
  currentPage: number;
}
