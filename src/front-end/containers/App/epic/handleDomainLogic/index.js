// import {
//   take, switchMap, /* auditTime */
// } from 'rxjs/operators';
// import modelMap from '~/containers/App/modelMap';


// const { types } = modelMap;

// const {
//   selectOrganizationPath,
// } = modelMap.actions;

// const autoSelectDefaultOrganization = (action$, store$) => action$.ofType(types.getOrganizations)
//     .pipe(
//       switchMap(startAction => action$.ofType(types.respondGetOrganizations)
//       .pipe(
//         take(1), // don't listen forever! IMPORTANT!
//         switchMap(action => action.data.filter(org => org.name === 'default')
//           .map(org => selectOrganizationPath(org.id)))
//       ))
//     );

export default [
  // autoSelectDefaultOrganization,
];
