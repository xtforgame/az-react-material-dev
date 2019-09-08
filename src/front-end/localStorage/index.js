import throttle from 'lodash/throttle';
import {
  makeRememberUserSelector,
} from '~/containers/App/selectors';
import modelMapEx from '~/containers/App/modelMapEx';

const userSessionSelector = modelMapEx.cacher.selectorCreatorSet.session.selectMe();
const rememberUserSelector = makeRememberUserSelector();

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState == null) {
      return undefined;
    }
    const global = JSON.parse(serializedState);
    return {
      global,
    };
  } catch (err) {
    console.error('loadState error :', err);
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    // console.log('state :', state);
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    console.error('saveState error :', err);
  }
};

export const removeState = () => {
  localStorage.removeItem('state');
};

export const clearState = () => {
  localStorage.clear();
};

const delaySave = throttle((store) => {
  const state = store.getState();
  const persistedData = state.global;

  if (rememberUserSelector(state) && userSessionSelector(state)) {
    const {
      cache: {
        session,
      },
      persistence,
    } = persistedData;
    saveState({
      cache: {
        session,
      },
      persistence,
    });
  } else {
    // removeState();
    localStorage.clear();
  }
}, 300);

export const middleware = store => next => (action) => {
  setTimeout(() => {
    delaySave(store);
  }, 0);
  return next(action);
};
