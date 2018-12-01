import _ from 'lodash';

import {SUCCESS, FAIL, ERROR, SKIPPED} from '../constants/test-statuses';

const walk = (node: any, cb: any, fn: any) => {
  return node.browsers && fn(node.browsers, cb) || node.children && fn(node.children, cb) || [];
};

export const getDataFrom = (node: any, {fieldName, fromFields}: {fieldName: any, fromFields: any}) => {
  if (!fromFields) {
    return [].concat(_.get(node, fieldName, []));
  }

  const {result = {}, retries = {}} = _.pick(node, fromFields);

  return _.isEmpty(result) && _.isEmpty(retries)
    ? walk(node, (n: any) => getDataFrom(n, {fieldName, fromFields}), _.flatMap)
    : [].concat(_.get(result, fieldName, []), _.flatMap(retries, fieldName));
};

export const getImagePaths = (node: any, fromFields: any) => {
  return _(getDataFrom(node, {fieldName: 'imagesInfo', fromFields}))
    .map((imageInfo: any) => _.pick(imageInfo, ['expectedPath', 'actualPath', 'diffPath']))
    .reject(_.isEmpty)
    .flatMap(_.values)
    .value();
};

export const getStatNameForStatus = (status: string) => {
  interface IStatusToStat {
    [SUCCESS]: 'passed';
    [FAIL]: 'failed';
    [ERROR]: 'failed';
    [SKIPPED]: 'skipped';
    [key: string]: string;
  }
  const statusToStat: IStatusToStat = {
    [SUCCESS]: 'passed',
    [FAIL]: 'failed',
    [ERROR]: 'failed',
    [SKIPPED]: 'skipped',
  };

  return statusToStat[status];
};
