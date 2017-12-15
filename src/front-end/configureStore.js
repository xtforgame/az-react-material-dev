import 'rxjs';
import { createStore, applyMiddleware } from 'redux';
import { fromJS } from 'immutable';
import { routerMiddleware } from 'react-router-redux';

import { createEpicMiddleware } from 'redux-observable';
import createSagaMiddleware from 'redux-saga';
import createReducer from './createReducer';
import createInjectableEpic from './createInjectableEpic';

import globalSaga from './containers/App/saga';

const rootInjectable = createInjectableEpic();
const epicMiddleware = createEpicMiddleware(rootInjectable.injectableEpic);
const sagaMiddleware = createSagaMiddleware();

let store = null;

export const getStore = () => store;

export default function configureStore(initialState = {}, history) {
  const rMiddleware = routerMiddleware(history);
  store = createStore(
    createReducer(),
    fromJS(initialState),
    applyMiddleware(epicMiddleware, sagaMiddleware, rMiddleware)
  );

  // Extensions
  store.asyncReducers = {}; // Async reducer registry
  store.asyncInjectables = {}; // Async epic registry
  store.asyncSagas = {}; // Async saga registry
  store.runSaga = sagaMiddleware.run;

  store.runSaga(globalSaga);

  // rootInjectable.remove();
  rootInjectable.inject();

  return store;
}
