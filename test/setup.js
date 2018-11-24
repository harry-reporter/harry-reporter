import path from 'path';
import chai from 'chai';
import sinon from 'sinon';

global.sinon = sinon;
global.assert = chai.assert;

require('app-module-path').addPath(path.resolve(__dirname, '..'));
