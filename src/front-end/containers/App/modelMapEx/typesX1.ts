import {
  CommonConfig,
  QueryBuilderDefinition,
  QcStore,

  SimpleQueryRunner,

  ResourceModelQueryActionOptions,
  QueryInfo,
  ActionInfo,
  ExtraQueryInfo,
  ExtraActionInfo,

  BaseSelector,
  BuiltinSelectorCreators,
  BuiltinSelectors,

  FeatureGroup,
  FeatureGroupTypes,
} from 'querchy';

import CrudT1 from 'querchy/exports/features/CrudT1';
import UpdateCacheT1 from 'querchy/exports/features/UpdateCacheT1';
import CollectionT1 from 'querchy/exports/features/CollectionT1';

import {
  MakeResourceModelType,
  TypeHelperClass,
} from 'querchy/exports/type-helpers';

type CrudUpdateCacheTypesT1 = FeatureGroupTypes<
  CrudT1,
  UpdateCacheT1
>;

type CrudUpdateCacheTypesCollectionT1 = FeatureGroupTypes<
  FeatureGroup<
    CrudUpdateCacheTypesT1
  >,
  CollectionT1
>;
// // or use this way
// type CrudUpdateCacheTypesCollectionT1 = FeatureGroupTypes<
//   CrudT1,
//   UpdateCacheT1,
//   CollectionT1
// >;

export type MyStateX1 = any;

export interface CommonConfigX1 extends CommonConfig {
  queryRunners: {
    customRunner: SimpleQueryRunner;
  };
}

export type RawActionCreatorUpdateCacheX1 = (
  cacheChange: any, options?: ResourceModelQueryActionOptions,
) => {
  cacheChange: any;
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type ModelMapX1 = {
  userSetting: MakeResourceModelType<
    CommonConfigX1,
    CrudUpdateCacheTypesCollectionT1
  >;
  recoveryToken: MakeResourceModelType<
    CommonConfigX1,
    CrudUpdateCacheTypesCollectionT1
  >;
  challengeRecoveryToken: MakeResourceModelType<
    CommonConfigX1,
    CrudUpdateCacheTypesCollectionT1
  >;
  resetPasswordRequest: MakeResourceModelType<
    CommonConfigX1,
    CrudUpdateCacheTypesCollectionT1
  >;
  organization: MakeResourceModelType<
    CommonConfigX1,
    CrudUpdateCacheTypesCollectionT1
  >;
  project: MakeResourceModelType<
    CommonConfigX1,
    CrudUpdateCacheTypesCollectionT1
  >;
  memo: MakeResourceModelType<
    CommonConfigX1,
    CrudUpdateCacheTypesCollectionT1
  >;
};

export type QueryBuilderMapX1 = {
  defaultBuilder : QueryBuilderDefinition<CommonConfigX1, ModelMapX1>;
  customPath : QueryBuilderDefinition<CommonConfigX1, ModelMapX1>;
  forExtra : QueryBuilderDefinition<CommonConfigX1, ModelMapX1>;
} & {
  [s : string] : QueryBuilderDefinition<CommonConfigX1, ModelMapX1>;
};

export type RawActionCreatorExtraQueryX1 = (
  options?: ResourceModelQueryActionOptions,
) => {
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type RawActionCreatorExtraActionX1 = (
  cacheChange: any, options?: ResourceModelQueryActionOptions,
) => {
  cacheChange: any;
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type ExtraQueryInfosX1 = {
  extraQuery1: ExtraQueryInfo<ModelMapX1, RawActionCreatorExtraQueryX1>;
};

export type ExtraActionInfosX1 = {
  extraAction1: ExtraActionInfo<ModelMapX1, RawActionCreatorExtraActionX1>;
};

// ===========================================

export type ExtraSelectorCreatorCreatorX1<ReturnType> = (
  baseSelector : BaseSelector<ModelMapX1>,
  builtinSelectorCreators: BuiltinSelectorCreators<MyStateX1>,
  builtinSelectors: BuiltinSelectors<MyStateX1>,
) => () => (state : any) => ReturnType;

export type ExtraSelectorInfosForModelX1 = {
  userSetting: {
    extraSelectorX1: {
      creatorCreator: ExtraSelectorCreatorCreatorX1<any[]>,
    },
  },
  recoveryToken: {
    extraSelectorX1: {
      creatorCreator: ExtraSelectorCreatorCreatorX1<any[]>,
    },
  },
  challengeRecoveryToken: {
    extraSelectorX1: {
      creatorCreator: ExtraSelectorCreatorCreatorX1<any[]>,
    },
  },
  resetPasswordRequest: {
    extraSelectorX1: {
      creatorCreator: ExtraSelectorCreatorCreatorX1<any[]>,
    },
  },
  organization: {
    extraSelectorX1: {
      creatorCreator: ExtraSelectorCreatorCreatorX1<any[]>,
    },
    selectCurrentOrganization: {
      creatorCreator: ExtraSelectorCreatorCreatorX1<any>,
    },
  },
  project: {
    extraSelectorX1: {
      creatorCreator: ExtraSelectorCreatorCreatorX1<any[]>,
    },
  },
  memo: {
    extraSelectorX1: {
      creatorCreator: ExtraSelectorCreatorCreatorX1<any[]>,
    },
  },
};

// ===========================================

export const typeHelperClassX1 = new TypeHelperClass<
  CommonConfigX1,
  ModelMapX1,
  QueryBuilderMapX1,
  ExtraQueryInfosX1,
  ExtraActionInfosX1,

  any, // ExtraDependenciesX1,
  MyStateX1,
  ExtraSelectorInfosForModelX1
>();

export type Types = (typeof typeHelperClassX1)['Types'];

export type StoreX1 = QcStore<Types['StateType']>;

// ===========================================

// just for demonstrating how to do inheritance

export class AxiosRunnerX1 extends typeHelperClassX1.GetAxiosRunnerClass() {}

export class QuerchyX1 extends typeHelperClassX1.GetQuerchyClass() {}

export class CacherX1 extends typeHelperClassX1.GetCacherClass() {
  // reduce(action: QcAction, state: any) : any {
  //   return super.reduce(action, state);
  // }
}
