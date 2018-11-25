import fs from 'fs-extra';
import { dirname, extname, resolve, sep } from 'path';

class ScreenSaver {
  private path: string;

  constructor(path: string) {
    this.path = path + sep + 'images';
    fs.ensureDir(this.path);
  }

  public saveFailedScreens(testResult: any) {
    const queue: any[] = [];

    testResult.assertViewResults.forEach((assertResult: any) => {

      const { diffOpts, name, currentImagePath } = assertResult;
      if (name === 'ImageDiffError') {
        const { reference, current } = diffOpts;
        queue.push(
          this.copyScreen(
            reference,
            resolve(this.getScreenPath(testResult, assertResult, 'ref')),
          ),
          this.copyScreen(
            current,
            resolve(this.getScreenPath(testResult, assertResult, 'current')),
          ),
          this.saveDiffScreen(testResult, assertResult),
        );

      } else if (name === 'NoRefImageError') {
        queue.push(
          this.copyScreen(
            currentImagePath,
            resolve(this.getScreenPath(testResult, assertResult, 'current')),
          ),
        );
      }
    });

    return Promise.all(queue);
  }

  public savePassedScreens(testResult: any) {
    const queue = testResult.assertViewResults.map((assertResult: any) => {
      const { refImagePath, stateName } = assertResult;
      return this.copyScreen(
        refImagePath,
        resolve(this.getScreenPath(testResult, assertResult, 'ref')),
      );
    });

    return Promise.all(queue);
  }

  private saveDiffScreen(testResult: any, assertResult: any) {
    const path = this.getScreenPath(testResult, assertResult, 'diff');

    return fs.ensureDir(dirname(path))
      .then(() => assertResult.saveDiffTo(path));
  }

  private copyScreen(src: string, dest: string) {
    return fs.copy(src, dest);
  }

  private getScreenPath({ browserId }: any, { refImagePath, stateName }: any, type: string) {
    const path = [
      this.path,
      this.getTestDirName(refImagePath),
      stateName,
      `${browserId}-${type}${extname(refImagePath)}`,
    ];
    return path.join(sep);
  }

  private getTestDirName(path: string) {
    const parsedPath = path.split(sep);
    return parsedPath[parsedPath.indexOf('screens') + 1];
  }
}

export default ScreenSaver;
