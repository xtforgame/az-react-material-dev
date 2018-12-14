import { createSelector } from 'reselect';

const loginSelector = state => state.get('login');
const makeUsernameSelector = () => createSelector(
  loginSelector,
  login => login.username
);

export {
  loginSelector,
  makeUsernameSelector,
};
