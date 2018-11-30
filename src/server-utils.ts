import _ from 'lodash';

export const logger = _.pick(console, ['log', 'warn', 'error']);
export const serverRequire = (path: any): any => {};
export const prepareCommonJSData = (data: any) => {};
