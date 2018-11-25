"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ScreenSaver_1 = __importDefault(require("./ScreenSaver"));
var harry = function (hermione, opts) {
    var path = opts.path;
    var screenSaver = new ScreenSaver_1.default(path);
    hermione.on(hermione.events.INIT, function () {
        process.stdout.write('Harry init');
    });
    hermione.on(hermione.events.TEST_PASS, function (testResult) {
        screenSaver.savePassedScreens(testResult);
    });
    hermione.on(hermione.events.TEST_FAIL, function (testResult) {
        screenSaver.saveFailedScreens(testResult);
    });
};
module.exports = harry;
