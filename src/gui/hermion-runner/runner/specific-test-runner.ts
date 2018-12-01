import { mkFullTitle } from '../utils';
import Runner from './runner';

export default class SpecificTestRunner extends Runner {
  public tests: any;

  constructor(collection: any, tests: any) {
    super(collection);
    this.tests = tests;
  }

  public run(runHandler: (collection: any) => any) {
    this.filter();
    return super.run(runHandler);
  }

  private filter() {
    this.collection.disableAll();

    this.tests.forEach((test: any) => {
      this.collection.enableTest(mkFullTitle(test), test.browserId);
    });
  }
}
