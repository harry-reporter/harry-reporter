import {isArray, find, get, values} from 'lodash';
import {isSuccessStatus, isFailStatus, isErroredStatus, isSkippedStatus, isUpdatedStatus} from '../../common-utils';
import {getCommonErrors} from '../../constants/errors';

const {NO_REF_IMAGE_ERROR} = getCommonErrors();

const walk = (node: any, cb: any, fn: any = Array.prototype.some) => {
  return node.browsers && fn.call(node.browsers, cb) || node.children && fn.call(node.children, cb);
};

const hasFailedImages = (result: any) => {
  const {imagesInfo = [], status: resultStatus } = result;

  return imagesInfo.some(({status}: {status: string}) => isErroredStatus(status) || isFailStatus(status))
    || isErroredStatus(resultStatus) || isFailStatus(resultStatus);
};

export const hasNoRefImageErrors = ({imagesInfo = []}: {imagesInfo: []}) => (
  Boolean(imagesInfo.filter((v) => get(v, 'reason.stack', '').startsWith(NO_REF_IMAGE_ERROR)).length)
);

export const hasFails = (node: any) => {
  const {result} = node;
  const isFailed = result && hasFailedImages(result);

  return isFailed || walk(node, hasFails);
};

export const isSuiteFailed = (suite: any) => (
  isFailStatus(suite.status) || isErroredStatus(suite.status)
);

export const isAcceptable = ({status, reason = ''}: {status: string, reason: any}) => {
  const stack = reason && reason.stack;

  return isErroredStatus(status) && stack.startsWith(NO_REF_IMAGE_ERROR) || isFailStatus(status);
};

export const hasRetries = (node: any) => {
  const isRetried = node.retries && node.retries.length;

  return isRetried || walk(node, hasRetries);
};

export const allSkipped = (node: any) => {
  const {result} = node;
  const isSkipped = result && isSkippedStatus(result.status);

  return Boolean(isSkipped || walk(node, allSkipped, Array.prototype.every));
};

export const setStatusToAll = (node: any, status: string) => {
  if (isArray(node)) {
    node.forEach((n: any) => setStatusToAll(n, status));
  }

  const currentStatus = get(node, 'result.status', node.status);
  if (isSkippedStatus(currentStatus)) {
    return;
  }
  node.result
    ? (node.result.status = status)
    : node.status = status;

  return walk(node, (n: any) => setStatusToAll(n, status), Array.prototype.forEach);
};

export const findNode = (node: any, suitePath: any): any => {
  suitePath = suitePath.slice();
  if (!node.children) {
    node = values(node);
    const tree = {
      children: node,
      name: 'root',
    };
    return findNode(tree, suitePath);
  }

  const pathPart = suitePath.shift();
  const child = find(node.children, {name: pathPart});

  if (!child) {
    return;
  }

  if (child.name === pathPart && !suitePath.length) {
    return child;
  }

  return findNode(child, suitePath);
};

export const setStatusForBranch = (nodes: any, suitePath: any, status: string) => {
  const node = findNode(nodes, suitePath);
  if (!node) {
    return;
  }

  if ((isSuccessStatus(status) || isUpdatedStatus(status)) && hasFails(node)) {
    return;
  }

  node.status = status;
  suitePath = suitePath.slice(0, -1);
  setStatusForBranch(nodes, suitePath, status);
};
