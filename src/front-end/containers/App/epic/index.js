import { createModelMapEx } from '../modelMapEx';
import handleSessionEpics from './handleSessionEpics';
import handleUserSettingsEpics from './handleUserSettingsEpics';
import handleDomainLogic from './handleDomainLogic';

const {
  querchy,
  cacher,
} = createModelMapEx();

export default [
  ...handleSessionEpics,
  ...handleUserSettingsEpics,
  ...handleDomainLogic,

  querchy.getRootEpic(),
  cacher.getRootEpic(),
];
