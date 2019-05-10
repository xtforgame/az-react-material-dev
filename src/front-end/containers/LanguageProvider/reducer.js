/*
 *
 * LanguageProvider reducer
 *
 */

import { fromJS } from 'immutable';
import moment from 'moment';
import i18next from '~/i18next';

import {
  CHANGE_LOCALE,
  DEFAULT_LOCALE,
} from './constants';

const initialState = fromJS({
  locale: DEFAULT_LOCALE,
});

moment.locale(DEFAULT_LOCALE);

function languageProviderReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LOCALE:
      i18next.changeLanguage(action.locale);
      moment.locale(action.locale);
      return state
        .set('locale', action.locale);
    default:
      return state;
  }
}

export default languageProviderReducer;
