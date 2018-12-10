import { Dispatch } from 'redux';
import { INIT_GUI } from './constants';
import { getInitialState } from './utils';
import { CompiledData } from 'src/store/modules/tests/types';

export const initGui = () => {
  return async (dispatch: Dispatch) => {
    try {
      const appState: CompiledData = await fetch('/init').then((res) => res.json());

      dispatch({
        type: INIT_GUI,
        payload: getInitialState(appState),
      });
    } catch (e) {
      // handle error
    }
  };
};
