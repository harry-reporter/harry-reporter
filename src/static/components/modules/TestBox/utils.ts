export class TestBoxesCache {
  public data: { [key: string]: any} = {};

  public set(prop: string, key: string, value: any) {
    this.data[key] = { ...this.data[key], [prop]: value };
  }
}
