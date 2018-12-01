import _ from 'lodash';

export const logger = _.pick(console, ['log', 'warn', 'error']);
export const prepareCommonJSData = (data: any) => {};

module.exports = {
  require,
};
