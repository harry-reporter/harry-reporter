const path = require('path');
const chai = require('chai');
const sinon = require('sinon');

global.sinon = sinon;
global.assert = chai.assert;

require('app-module-path').addPath(path.resolve(__dirname, '..'));
