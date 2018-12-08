import { Express } from 'express';
import ApiFacade from './api-facade';

export interface IApi {
  initServer: (server: Express) => void;
}

export default class Api implements IApi {
  private gui: any;

  constructor(hermione: any) {
    this.gui = hermione.gui = new ApiFacade();
  }

  public initServer(server: Express) {
    this.gui.emit(this.gui.events.SERVER_INIT, server);
  }
}
