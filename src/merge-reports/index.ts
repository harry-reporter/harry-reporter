import ReportBuilder from './report-builder';

const validateOpts = (srcPaths: string, destPath: string) => {
  if (!srcPaths.length) {
    throw new Error('Nothing to merge, no source reports are passed');
  }

  if (srcPaths.includes(destPath)) {
    throw new Error(`Destination report path: ${destPath}, exists in source report paths`);
  }
};

export default async (srcPaths: string, { destination: destPath }: {destination: string}) => {
  validateOpts(srcPaths, destPath);

  const reportBuilder: ReportBuilder = ReportBuilder.create(srcPaths, destPath);

  await reportBuilder.build();
};
