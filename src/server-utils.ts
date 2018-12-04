import chalk from 'chalk';
import fs from 'fs-extra';
import _ from 'lodash';
import path from 'path';

import { ERROR, FAIL, SUCCESS, UPDATED } from './constants/test-statuses';
import Test from './test/test';

export const getReferencePath = (testResult: any, stateName: string) => createPath('ref', testResult, stateName);
export const getCurrentPath = (testResult: any, stateName: string) => createPath('current', testResult, stateName);
export const getDiffPath = (testResult: any, stateName: string) => createPath('diff', testResult, stateName);

export const getReferenceAbsolutePath = (testResult: any, reportDir: string, stateName?: string) => {
  const referenceImagePath = getReferencePath(testResult, stateName);
  return path.resolve(reportDir, referenceImagePath);
};

export const getCurrentAbsolutePath = (testResult: any, reportDir: string, stateName?: string) => {
  const currentImagePath = getCurrentPath(testResult, stateName);

  return path.resolve(reportDir, currentImagePath);
};

export const getDiffAbsolutePath = (testResult: any, reportDir: string, stateName?: string) => {
  const diffImagePath = getDiffPath(testResult, stateName);

  return path.resolve(reportDir, diffImagePath);
};

/**
 * @param kind - одно из значений 'ref', 'current', 'diff'
 * @param {StateResult} result
 * @param stateName - имя стэйта для теста
 */

const createPath = (kind: string, result: any, stateName: string) => {
  const attempt = result.attempt || 0;
  const imageDir = _.compact(['images', result.imageDir, stateName]);
  const components = imageDir.concat(`${result.browserId}~${kind}_${attempt}.png`);

  return path.join.apply(null, components);
};

// создает директорию и копирует скрин
export const copyImageAsync = (srcPath: string, destPath: string) => {
  return makeDirFor(destPath)
    .then(() => fs.copy(srcPath, destPath));
};

/**
 * @param {TestStateResult} result
 * @param {String} destPath
 * @returns {Promise}
 */
export const saveDiff = (result: any, destPath: string) => {
  return makeDirFor(destPath)
    .then(() => result.saveDiffTo(destPath));
};

/**
 * @param {String} destPath
 */
export const makeDirFor = (destPath: string) => {
  return fs.mkdirs(path.dirname(destPath));
};

export const logger = _.pick(console, ['log', 'warn', 'error']);

export const logPathToHtmlReport = (reportBuilder: any) => {
  const reportPath = `file://${reportBuilder.reportPath}`;

  logger.log(`Your HTML report is here: ${chalk.yellow(reportPath)}`);
};

export const logError = (e: Error) => {
  logger.error(e.stack);
};

export const getPathsFor = (status: string, formattedResult: any, stateName: string) => {
  if (status === SUCCESS || status === UPDATED) {
    return { expectedPath: getReferencePath(formattedResult, stateName) };
  }
  if (status === FAIL) {
    return {
      actualPath: getCurrentPath(formattedResult, stateName),
      diffPath: getDiffPath(formattedResult, stateName),
      expectedPath: getReferencePath(formattedResult, stateName),
    };
  }
  if (status === ERROR) {
    return {
      actualPath: formattedResult.state ? getCurrentPath(formattedResult, stateName) : '',
    };
  }

  return {};
};

export const getImagesFor = (status: string, formattedResult: Test, stateName?: string) => {
  const refImg = formattedResult.getRefImg(stateName);
  const currImg = formattedResult.getCurrImg(stateName);
  const errImg = formattedResult.getErrImg();

  if (status === SUCCESS || status === UPDATED) {
    return { expectedImg: { path: getReferencePath(formattedResult, stateName), size: refImg.size } };
  }

  if (status === FAIL) {
    return {
      actualImg: {
        path: getCurrentPath(formattedResult, stateName),
        size: currImg.size,
      },
      diffImg: {
        path: getDiffPath(formattedResult, stateName),
        size: {
          height: _.max([refImg.size.height, currImg.size.height]),
          width: _.max([refImg.size.width, currImg.size.width]),
        },
      },
      expectedImg: {
        path: getReferencePath(formattedResult, stateName),
        size: refImg.size,
      },
    };
  }

  if (status === ERROR) {
    return {
      actualImg: {
        path: formattedResult.state ? getCurrentPath(formattedResult, stateName) : '',
        size: currImg.size || errImg.size,
      },
    };
  }

  return {};
};

export const hasImage = (formattedResult: any) => {
  return !!formattedResult.getImagesInfo(ERROR).length
    || !!formattedResult.currentPath
    || !!formattedResult.screenshot;
};

export const prepareCommonJSData = (data: any) => {
  return [
    `var data = ${JSON.stringify(data)};`,
    'try { module.exports = data; } catch(e) {}',
  ].join('\n');
};
