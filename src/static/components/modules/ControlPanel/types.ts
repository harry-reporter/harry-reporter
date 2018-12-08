export interface ControlPanelProps {
  url: string;

  setUrl: (value: string) => {type: string, payload: string};
  setScreenViewMode: (value: string) => {type: string, payload: string};
  setTestsViewMode: (value: string) => {type: string, payload: string};
  runAllTests: () => any;
  runFailedTests: any;
  acceptAll: any;
}
