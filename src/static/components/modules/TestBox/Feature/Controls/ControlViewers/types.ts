export interface ControlViewersProps {
  selectedId: number;
  onChange: (e: any) => void;
  viewType: string;

  measure?: () => any;
}
export interface ControlViewersState {
  selectedId: number;
}
