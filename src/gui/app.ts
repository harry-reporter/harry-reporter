import _ from 'lodash';
import ToolRunnerFactory from './hermion-runner';

export default class App {
  private hermione: any;
  private browserConfigs: any[];
  private retryCache: any;

  constructor(paths: string, hermione: any, configs: any) {
    this.hermione = ToolRunnerFactory(paths, hermione, configs);
    this.browserConfigs = [];
    this.retryCache = {};
  }

  public initialize() {
    return this.hermione.initialize();
  }

  public finalize() {
    this.hermione.finalize();
  }

  public run(tests: any) {
    return _.isEmpty(tests)
      ? this.hermione.run()
      : this.runWithoutRetries(tests);
  }

  public updateReferenceImage(failedTests: any[] = []) {
    return this.hermione.updateReferenceImage(failedTests);
  }

  public addClient(connection: any): void {
    this.hermione.addClient(connection);
  }

  get data() {
    return this.hermione.tree;
  }

  private runWithoutRetries(tests: any) {
    if (_.isEmpty(this.browserConfigs)) {
      this.browserConfigs = _.map(this.hermione.config.getBrowserIds(), (id) => this.hermione.config.forBrowser(id));
    }

    this.disableRetries();

    return this.hermione.run(tests)
      .finally(() => this.restoreRetries());
  }

  private disableRetries() {
    this.browserConfigs.forEach((broConfig) => {
      this.retryCache[broConfig.id] = broConfig.retry;
      broConfig.retry = 0;
    });
  }

  private restoreRetries() {
    this.browserConfigs.forEach((broConfig) => {
      broConfig.retry = this.retryCache[broConfig.id];
    });
  }
}
