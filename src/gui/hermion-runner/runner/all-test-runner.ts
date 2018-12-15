import Runner from './runner';

export default class AllTestRunner extends Runner {
  public run(runHandler: (collection: any) => any) {
    this.collection.enableAll();

    return super.run(runHandler);
  }
}
