/* eslint-disable import/prefer-default-export */
import {
  getStore,
} from '~/configureStore';
import modelMapEx from './modelMapEx';

const {
  promiseActionCreatorSets,
} = modelMapEx.querchy;

export const refreshSelectedOrganizationCollections = (resourceNames = []) => {
  const store = getStore();
  const org = modelMapEx.cacher.selectorCreatorSet.organization
  .selectCurrentOrganization(store.getState());

  const organizationId = org && org.id;
  if (!organizationId) {
    return Promise.reject(new Error('Organization id not found'));
  }
  const promises = resourceNames.map(
    name => promiseActionCreatorSets[name].getCollection(),
  ).filter(p => p);
  return Promise.all(promises);
};
