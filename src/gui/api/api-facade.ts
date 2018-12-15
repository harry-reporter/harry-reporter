import { EventEmitter } from 'events';
import { guiEvents } from '../constants/gui-events';

interface IguiEvents {
  [key: string]: string;
}

export default class ApiFacade extends EventEmitter {
  private events: IguiEvents;

  constructor() {
    super();
    this.events = guiEvents;
  }
}
