"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = require("path");
var ScreenSaver = /** @class */ (function () {
    function ScreenSaver(path) {
        this.path = path + path_1.sep + 'images';
        fs_extra_1.default.ensureDir(this.path);
    }
    ScreenSaver.prototype.saveFailedScreens = function (testResult) {
        var _this = this;
        var queue = [];
        testResult.assertViewResults.forEach(function (assertResult) {
            var diffOpts = assertResult.diffOpts, name = assertResult.name, currentImagePath = assertResult.currentImagePath;
            if (name === 'ImageDiffError') {
                var reference = diffOpts.reference, current = diffOpts.current;
                queue.push(_this.copyScreen(reference, path_1.resolve(_this.getScreenPath(testResult, assertResult, 'ref'))), _this.copyScreen(current, path_1.resolve(_this.getScreenPath(testResult, assertResult, 'current'))), _this.saveDiffScreen(testResult, assertResult));
            }
            else if (name === 'NoRefImageError') {
                queue.push(_this.copyScreen(currentImagePath, path_1.resolve(_this.getScreenPath(testResult, assertResult, 'current'))));
            }
        });
        return Promise.all(queue);
    };
    ScreenSaver.prototype.savePassedScreens = function (testResult) {
        var _this = this;
        var queue = testResult.assertViewResults.map(function (assertResult) {
            var refImagePath = assertResult.refImagePath, stateName = assertResult.stateName;
            return _this.copyScreen(refImagePath, path_1.resolve(_this.getScreenPath(testResult, assertResult, 'ref')));
        });
        return Promise.all(queue);
    };
    ScreenSaver.prototype.saveDiffScreen = function (testResult, assertResult) {
        var path = this.getScreenPath(testResult, assertResult, 'diff');
        return fs_extra_1.default.ensureDir(path_1.dirname(path))
            .then(function () { return assertResult.saveDiffTo(path); });
    };
    ScreenSaver.prototype.copyScreen = function (src, dest) {
        return fs_extra_1.default.copy(src, dest);
    };
    ScreenSaver.prototype.getScreenPath = function (_a, _b, type) {
        var browserId = _a.browserId;
        var refImagePath = _b.refImagePath, stateName = _b.stateName;
        var path = [
            this.path,
            this.getTestDirName(refImagePath),
            stateName,
            browserId + "-" + type + path_1.extname(refImagePath),
        ];
        return path.join(path_1.sep);
    };
    ScreenSaver.prototype.getTestDirName = function (path) {
        var parsedPath = path.split(path_1.sep);
        return parsedPath[parsedPath.indexOf('screens') + 1];
    };
    return ScreenSaver;
}());
exports.default = ScreenSaver;
