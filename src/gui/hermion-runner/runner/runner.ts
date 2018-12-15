export default class Runner {
  public collection: any;

  constructor(collection: any) {
    this.collection = collection;
  }

  public run(runHandler: (collection: any) => any) {
    return runHandler(this.collection);
  }
}
