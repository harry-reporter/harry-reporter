import Promise from 'bluebird';
import fs from 'fs-extra';
import path from 'path';

import * as utils from './server-utils';
import Test from './test/test';

const saveAssertViewImages = (testResult: Test, reportPath: string) => {
  return Promise.map(testResult.assertViewResults, (assertResult: any) => {
    const { stateName } = assertResult;
    const actions = [];

    if (!(assertResult instanceof Error)) {
      actions.push(utils.copyImageAsync(
        testResult.getRefImg(stateName).path,
        utils.getReferenceAbsolutePath(testResult, reportPath, stateName),
      ));
    }

    if (testResult.isImageDiffError(assertResult)) {
      actions.push(
        exports.saveTestCurrentImage(testResult, reportPath, stateName),
        utils.saveDiff(
          assertResult,
          utils.getDiffAbsolutePath(testResult, reportPath, stateName),
        ),
        utils.copyImageAsync(
          testResult.getRefImg(stateName).path,
          utils.getReferenceAbsolutePath(testResult, reportPath, stateName),
        ),
      );
    }

    if (testResult.isNoRefImageError(assertResult)) {
      actions.push(exports.saveTestCurrentImage(testResult, reportPath, stateName));
    }

    return Promise.all(actions);
  });
};

export const saveTestImages = (testResult: Test, reportPath: string): any => {
  if (testResult.assertViewResults) {
    return saveAssertViewImages(testResult, reportPath);
  }

  const actions = [
    utils.copyImageAsync(
      testResult.getRefImg().path,
      utils.getReferenceAbsolutePath(testResult, reportPath),
    ),
  ];

  if (testResult.hasDiff()) {
    actions.push(
      exports.saveTestCurrentImage(testResult, reportPath),
      utils.saveDiff(
        testResult,
        utils.getDiffAbsolutePath(testResult, reportPath),
      ),
    );
  }

  return Promise.all(actions);
};

export const saveTestCurrentImage = (testResult: Test, reportPath: string, stateName: string) => {
  const src = testResult.getCurrImg(stateName).path || testResult.getErrImg().path;

  return src
    ? utils.copyImageAsync(src, utils.getCurrentAbsolutePath(testResult, reportPath, stateName))
    : Promise.resolve();
};

export const updateReferenceImage = (testResult: Test, reportPath: string, stateName: string) => {
  const currImg = testResult.getCurrImg(stateName);

  const src = currImg.path
    ? path.resolve(reportPath, currImg.path)
    : utils.getCurrentAbsolutePath(testResult, reportPath, stateName);

  return Promise.all([
    utils.copyImageAsync(src, testResult.getRefImg(stateName).path),
    utils.copyImageAsync(src, utils.getReferenceAbsolutePath(testResult, reportPath, stateName)),
  ]);
};

export const saveBase64Screenshot = (testResult: Test, reportPath: string) => {
  if (!testResult.screenshot) {
    utils.logger.warn('Cannot save screenshot on reject');

    return Promise.resolve();
  }

  const destPath = utils.getCurrentAbsolutePath(testResult, reportPath);

  return utils.makeDirFor(destPath)
    .then(() => fs.writeFile(destPath, new Buffer(testResult.screenshot.base64, 'base64'), 'base64'));
};
