/* eslint-disable no-nested-ternary */
import { from } from 'rxjs';
import {
  mergeMap, take, switchMap, catchError, /* auditTime */
} from 'rxjs/operators';
import HeaderManager from '~/utils/HeaderManager';
import modelMapEx from '~/containers/App/modelMapEx';
import modelMap from '../modelMap';
import {
  SESSION_VERIFIED,
} from '../constants';

import {
  sessionVerified,
  userLoaded,
  failToLoadUser,
  clearSensitiveData,
  changeTheme,
} from '../actions';

const { types } = modelMap;

const {
  getUser,
  postSessions,

  getOrganizations,
  getProjects,
} = modelMap.waitableActions;

const {
  selectOrganizationPath,
} = modelMap.actions;

const dispatchSessionVerifiedAfterPostedSession = (action$, state$) => action$.ofType(types.respondPostSessions)
  .pipe(
    mergeMap(action => [
      sessionVerified(action.data),
    ])
  );

const autoSelectDefaultOrganization = (organizations) => {
  let array = organizations.filter(org => org.name === 'default');
  array = array.length ? array : (organizations[0] ? [organizations[0]] : []);
  return array.map(org => selectOrganizationPath(org.id));
};

const fetchDataAfterSessionVerified = (action$, state$, { getStore }) => action$.ofType(SESSION_VERIFIED)
  .pipe(
    mergeMap((action) => {
      HeaderManager.set('Authorization', `${action.session.token_type} ${action.session.token}`);
      const store = getStore();
      return from(
        Promise.all([
          store.dispatch(getUser(action.session.user_id)),
          modelMapEx.querchy.promiseActionCreatorSets.userSetting.getCollection(),
          store.dispatch(getOrganizations()),
          store.dispatch(getProjects()),
        ])
        .then(
          ([_, { response: { data: userSettings } }, { data: organizations }]) => userSettings
          .filter(setting => setting.type === 'preference' && setting.data)
          .map(setting => changeTheme(setting.data.uiTheme, false))
          .concat(autoSelectDefaultOrganization(organizations))
        )
      )
      .pipe(
        mergeMap(result => result.concat([userLoaded()])),
        catchError((error) => {
          console.error('fetch data failed :', error);
          return [failToLoadUser(error)];
        })
      );
    })
  );

const clearAuthorizationHeaderAfterClearSession = (action$, state$) => action$.ofType(types.clearSessionCache)
  .pipe(
    mergeMap((action) => {
      HeaderManager.delete('Authorization');
      return [
        clearSensitiveData(),
      ];
    })
  );

const autologinAfterRegistration = (action$, state$) => action$.ofType(types.postUsers)
  .pipe(
    switchMap(
      startAction => action$.ofType(types.respondPostUsers)
      .pipe(
        take(1), // don't listen forever! IMPORTANT!
        switchMap(() => [postSessions(startAction.data.accountLinks[0])])
      )
    )
  );

export default [
  dispatchSessionVerifiedAfterPostedSession,
  fetchDataAfterSessionVerified,
  clearAuthorizationHeaderAfterClearSession,
  autologinAfterRegistration,
];
