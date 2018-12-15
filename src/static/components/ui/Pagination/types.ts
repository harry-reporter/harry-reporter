export interface IPaginationProps {
  maxPage?: number;
  hasPreventDefault?: boolean;
  defaultCurrentPage?: number;
  handleDataChange: (e) => void;
  pageCurrent: number;
  pageCount: number;
}
