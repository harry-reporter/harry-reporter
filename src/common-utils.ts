import { SUCCESS, FAIL, ERROR, SKIPPED, UPDATED, IDLE } from './constants/test-statuses';
import { isArray, find, get, values } from 'lodash';
import { getCommonErrors } from './constants/errors';
import { IReason, IImagesInfo } from './test-result/types';

const { NO_REF_IMAGE_ERROR } = getCommonErrors();

const walk = (node: any, cb: any, fn: any = Array.prototype.some) => {
  return node.browsers && fn.call(node.browsers, cb) || node.children && fn.call(node.children, cb);
};

const hasFailedImages = (result: any) => {
  const { imagesInfo = [], status: resultStatus } = result;

  return imagesInfo.some(({ status }: { status: string }) => isErroredStatus(status) || isFailStatus(status))
    || isErroredStatus(resultStatus) || isFailStatus(resultStatus);
};

export const hasNoRefImageErrors = ({ imagesInfo = [] }: any) => (
  Boolean(imagesInfo.filter((v: IImagesInfo) => get(v, 'reason.stack', '').startsWith(NO_REF_IMAGE_ERROR)).length)
);

export const hasFails = (node: any) => {
  const { result } = node;
  const isFailed = result && hasFailedImages(result);

  return isFailed || walk(node, hasFails);
};

export const isAcceptable = ({ status, reason }: { status: string, reason: IReason }) => {
  const stack = reason && reason.stack;

  return isErroredStatus(status) && stack.startsWith(NO_REF_IMAGE_ERROR) || isFailStatus(status);
};

export const findNode = (node: any, suitePath: string[]): any => {
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
  const child = find(node.children, { name: pathPart });

  if (!child) {
    return;
  }

  if (child.name === pathPart && !suitePath.length) {
    return child;
  }

  return findNode(child, suitePath);
};

export const setStatusForBranch = (nodes: any, suitePath: string[], status: string) => {
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

export const isSuccessStatus = (status: string): boolean => status === SUCCESS;
export const isFailStatus = (status: string): boolean => status === FAIL;
export const isIdleStatus = (status: string): boolean => status === IDLE;
export const isErroredStatus = (status: string): boolean => status === ERROR;
export const isSkippedStatus = (status: string): boolean => status === SKIPPED;
export const isUpdatedStatus = (status: string): boolean => status === UPDATED;
