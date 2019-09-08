import { from } from 'rxjs';
import {
  mergeMap, debounceTime, switchMap, map, catchError, /* auditTime */
} from 'rxjs/operators';
import { toNull } from 'querchy';
import modelMapEx from '../modelMapEx';
import {
  CHANGE_THEME,
  REQUEST_SAVE_USER_SETTING,
  SAVE_USER_SETTINGS,
} from '../constants';

import {
  requestSaveUserSetting,
  saveUserSettings,
} from '../actions';

const {
  userSetting,
} = modelMapEx.querchy.promiseActionCreatorSets;

let unsavedUserSettings = {};
const requestSaveUserSettingEpic = (action$, state$) => action$.ofType(REQUEST_SAVE_USER_SETTING)
    .pipe(
      mergeMap((action) => {
        unsavedUserSettings[action.userSettingType] = {
          ...unsavedUserSettings[action.userSettingType],
          ...action.data,
        };
        return [saveUserSettings()];
      })
    );

const delaySaveUserSettingsEpic = (action$, state$, { getStore }) => action$.ofType(SAVE_USER_SETTINGS)
    .pipe(
      debounceTime(250), // auditTime(250)
      switchMap(() => {
        const currentUnsavedUserSettings = unsavedUserSettings;
        unsavedUserSettings = {};
        const p = Promise.all(
          Object.keys(currentUnsavedUserSettings)
            .map(key => userSetting.update(key, currentUnsavedUserSettings[key]))
        );
        return from(p)
          .pipe(
            map(toNull),
            catchError((error) => {
              console.error('save user settings error :', error);
              Object.keys(currentUnsavedUserSettings)
                .forEach((key) => {
                  unsavedUserSettings[key] = {
                    ...currentUnsavedUserSettings[key],
                    ...unsavedUserSettings[key],
                  };
                });
              return [];
            })
          );
      })
    );

const saveUserSettingAfterChangeTheme = (action$, state$) => action$.ofType(CHANGE_THEME)
    .pipe(
      mergeMap((action) => {
        if (action.saveToServer) {
          const { uiTheme } = action;
          return [requestSaveUserSetting('preference', { uiTheme })];
        }
        return [];
      })
    );

export default [
  requestSaveUserSettingEpic,
  delaySaveUserSettingsEpic,
  saveUserSettingAfterChangeTheme,
];
