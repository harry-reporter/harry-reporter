import path from 'path';
import _ from 'lodash';
import Promise from 'bluebird';
import fsExtra from 'fs-extra';

import DataTree from './data-tree';
import { IData, IDataCollection } from './types';
import { logger, prepareCommonJSData } from '../server-utils';

const fs = Promise.promisifyAll(fsExtra);

const moveContentToReportDir = async ({ from, to }: { from: string, to: string }) => {
  const files: string[] = await fs.readdir(path.resolve(from));

  await Promise.map(files, async (fileName: string) => {
    if (fileName === 'data.js') {
      return;
    }

    const srcFilePath: string = path.resolve(from, fileName);
    const destFilePath: string = path.resolve(to, fileName);

    await fs.copy(srcFilePath, destFilePath, { overwrite: true });
  });
};

export default class ReportBuilder {
  public static create(srcPaths: string, destPath: string) {
    return new this(srcPaths, destPath);
  }

  public srcPaths: string;
  public destPath: string;

  constructor(srcPaths: string, destPath: string) {
    this.srcPaths = srcPaths;
    this.destPath = destPath;
  }

  public async build() {
    await moveContentToReportDir({ from: this.srcPaths[0], to: this.destPath });

    const srcReportsData: IData[] = this.loadReportsData();
    const dataTree: DataTree = DataTree.create(srcReportsData[0], this.destPath);
    const srcDataCollection: IDataCollection = _.zipObject(
      this.srcPaths.slice(1),
      srcReportsData.slice(1),
    );

    const mergedData: IData = await dataTree.mergeWith(srcDataCollection);

    await this.saveDataFile(mergedData);
  }

  private loadReportsData() {
    return _(this.srcPaths)
      .map((reportPath: string) => {
        const srcDataPath: string = path.resolve(reportPath, 'data');

        try {
          return require(`../${srcDataPath}`);
        } catch (err) {
          logger.warn(`Not found data file in passed source report path: ${reportPath}`);
          return { skips: [], suites: [] };
        }
      })
      .value();
  }

  private async saveDataFile(data: IData) {
    const formattedData: string = prepareCommonJSData(data);
    const destDataPath: string = path.resolve(this.destPath, 'data.js');

    await fs.writeFile(destDataPath, formattedData);
  }
}
