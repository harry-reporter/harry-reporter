export interface CodeViewerProps {
  metaInfo: {
    file: string;
    sessionId: string;
    url: string;
    platform?: string;
    textFile?: string;
  };
}
