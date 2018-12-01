import _ from 'lodash';

export const logger = _.pick(console, ['log', 'warn', 'error']);
export const logError = (e: any) => {
  logger.error(e.stack);
};
export const prepareCommonJSData = (data: any) => {};
