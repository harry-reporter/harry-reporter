import ReportBuilder from './report-builder';

function validateOpts(srcPaths: any, destPath: any) {
  if (!srcPaths.length) {
    throw new Error('Nothing to merge, no source reports are passed');
  }

  if (srcPaths.includes(destPath)) {
    throw new Error(`Destination report path: ${destPath}, exists in source report paths`);
  }
}

export default async (srcPaths: any, {destination: destPath}: {destination: any}) => {
  validateOpts(srcPaths, destPath);

  const reportBuilder = ReportBuilder.create(srcPaths, destPath);

  await reportBuilder.build();
};
