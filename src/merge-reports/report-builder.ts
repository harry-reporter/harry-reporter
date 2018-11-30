import path from 'path';
import _ from 'lodash';
import BPromise from 'bluebird';
import fsExtra from 'fs-extra';

import DataTree from './data-tree';
import {serverRequire, logger, prepareCommonJSData } from '../server-utils';

const fs = BPromise.promisifyAll(fsExtra);

async function moveContentToReportDir({from, to}: {from: any, to: any}) {
  const files = await fs.readdirAsync(path.resolve(from));

  await BPromise.map(files, async (fileName: any) => {
    if (fileName === 'data.js') {
      return;
    }

    const srcFilePath = path.resolve(from, fileName);
    const destFilePath = path.resolve(to, fileName);

    await fs.moveAsync(srcFilePath, destFilePath, {overwrite: true});
  });
}

export default class ReportBuilder {
  public static create(srcPaths: any, destPath: any) {
    return new this(srcPaths, destPath);
  }

  public srcPaths: any;
  public destPath: any;

  constructor(srcPaths: any, destPath: any) {
    this.srcPaths = srcPaths;
    this.destPath = destPath;
  }

  public async build() {
    await moveContentToReportDir({from: this.srcPaths[0], to: this.destPath});

    const srcReportsData = this._loadReportsData();
    const dataTree = DataTree.create(srcReportsData[0], this.destPath);
    const srcDataCollection = _.zipObject(this.srcPaths.slice(1), srcReportsData.slice(1));

    const mergedData = await dataTree.mergeWith(srcDataCollection);

    await this._saveDataFile(mergedData);
  }

  private _loadReportsData() {
    return _(this.srcPaths)
      .map((reportPath: any) => {
        const srcDataPath = path.resolve(reportPath, 'data');

        try {
          return serverRequire(srcDataPath);
        } catch (err) {
          logger.warn(`Not found data file in passed source report path: ${reportPath}`);
          return {skips: [], suites: []};
        }
      })
      .value();
  }

  private async _copyToReportDir(files: any, {from, to}: {from: any, to: any}) {
    await BPromise.map(files, async (dataName: any) => {
      const srcDataPath = path.resolve(from, dataName);
      const destDataPath = path.resolve(to, dataName);

      await fs.moveAsync(srcDataPath, destDataPath);
    });
  }

  private async _saveDataFile(data: any) {
    const formattedData = prepareCommonJSData(data);
    const destDataPath = path.resolve(this.destPath, 'data.js');

    await fs.writeFile(destDataPath, formattedData);
  }
}
