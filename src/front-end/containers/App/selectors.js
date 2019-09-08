import { createSelector } from 'reselect';
import { defaultUiTheme } from '~/styles/getPageContext';

import modelMapEx from './modelMapEx';

const makeMyUserSelector = () => createSelector(
  modelMapEx.cacher.selectorCreatorSet.session.selectMe(),
  modelMapEx.cacher.selectorCreatorSet.user.selectResourceMapValues(),
  (mySession, users) => {
    if (
      !mySession || !users
      || (mySession.user_id === undefined)
    ) {
      return undefined;
    }
    return users[mySession.user_id];
  }
);

const persistenceSelector = state => state.global.persistence;
const makeRememberUserSelector = () => createSelector(
  persistenceSelector,
  persistence => persistence.rememberUser
);

const makeUiThemeSelector = () => createSelector(
  persistenceSelector,
  persistence => persistence.uiTheme || defaultUiTheme,
);

const appTempStateSelector = state => state.global.appTempState;

export {
  makeMyUserSelector,
  persistenceSelector,
  makeRememberUserSelector,
  makeUiThemeSelector,

  appTempStateSelector,
};
