import { createStore } from './utils/createStore';
import reducer from './modules/reducer';

export const store = createStore(reducer);
