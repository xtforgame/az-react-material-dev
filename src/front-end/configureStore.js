/* eslint-disable no-underscore-dangle, no-param-reassign, no-return-assign */
import { compose } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { configureStore } from 'rrw-module';
import RrwExEpic from 'rrw-module/extensions/epic';
import createReduxWaitForMiddleware from 'redux-wait-for-action';
import { createQuerchyMiddleware } from 'querchy';

import languageProviderReducer from '~/containers/LanguageProvider/reducer';
import { createModelMapEx } from '~/containers/App/modelMapEx';

import {
  CLEAR_SENSITIVE_DATA,
} from '~/containers/App/constants';
import appReducer from '~/containers/App/reducer';
import appEpic from '~/containers/App/epic';

import { middleware as localStorageMiddleware } from './localStorage';

let staticReducers = null;

const getStaticReducers = history => staticReducers = ({
  global: appReducer,
  router: connectRouter(history),
  language: languageProviderReducer,
});

let composeEnhancers;

if (process.env.NODE_ENV === 'development') {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

let store = null;

export const getStore = () => store;

export default (initialState, history) => store = configureStore(getStaticReducers(history), initialState, {
  reducerOptions: {
    createRootReducer: (rootReducer => (state, action) => {
      if (action.type === CLEAR_SENSITIVE_DATA) {
        // leave keys belong to staticReducers after logout
        state = Object.keys(state)
        .filter(k => staticReducers[k] !== undefined)
        .reduce((s, k) => ({ ...s, [k]: state[k] }), {});
        state.global = { persistence: state.global.persistence };
      }

      return rootReducer(state, action);
    }),
  },
  extensions: [
    {
      extension: RrwExEpic,
      options: {
        staticEpic: appEpic,
      },
    },
  ],
  middlewares: [createQuerchyMiddleware(), routerMiddleware(history), localStorageMiddleware, createReduxWaitForMiddleware()],
  compose: composeEnhancers,
});
