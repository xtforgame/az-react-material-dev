import { createSelector } from 'reselect';
import { getHeaders } from '~/utils/HeaderManager';
import {
  INIT_FUNC,
  createFeatureGroup,
} from 'querchy';

import {
  ExtraSelectorCreatorCreatorX1,
  QuerchyX1,
  AxiosRunnerX1,
  CacherX1,
} from './typesX1';

import CrudT1 from 'querchy/exports/features/CrudT1';
import UpdateCacheT1 from 'querchy/exports/features/UpdateCacheT1';
import CollectionT1 from 'querchy/exports/features/CollectionT1';

export const crudT1 = new CrudT1();
export const updateCacheT1 = new UpdateCacheT1();
export const collectionT1 = new CollectionT1();

export const crudUpdateCacheT1 = createFeatureGroup(
  crudT1,
  updateCacheT1,
);

export const crudUpdateCacheCollectionT1 = createFeatureGroup(
  crudUpdateCacheT1,
  collectionT1,
);
// // or use this way
// export const crudUpdateCacheCollectionT1 = createFeatureGroup(
//   crudT1,
//   updateCacheT1,
//   collectionT1,
// );

const rootSliceKey = 'cache';

const getSharedInfo = () => ({
  buildUrl: (modelBaseUrl, action) => {
    if (
      action.crudType === 'create'
      || action.crudType === 'getCollection'
    ) {
      return modelBaseUrl;
    }
    return `${modelBaseUrl}/${action.resourceId}`;
  },
  queryInfos: {},
  actionInfos: {},
  feature: crudUpdateCacheCollectionT1,
  featureDeps: {
    getId: (action) => {
      return (
        action.response
        && action.response.data
        && action.response.data.id
      );
    },
    parseResponse: (s, action) => {
      return {
        update: (
          (
            action.response
            && action.response.data
          ) || []
        ).reduce((m, item) => ({ ...m, [item.id]: item }), {}),
      };
    },
  },
});

const getExtraSelectorX1 :
  () => ExtraSelectorCreatorCreatorX1<any[]> = () => (baseSelector, builtinSelectorCreators) => {
    return () => createSelector(
      builtinSelectorCreators.selectQueryMapValues(),
      builtinSelectorCreators.selectResourceMapValues(),
      (queryMap, resourceMap) => {
        if (!queryMap
          || !queryMap.getCollection
        ) {
          return [];
        }
        return queryMap.getCollection.map(item => resourceMap[item.id]);
      },
    );
  };

export const createModelMapEx = () => {
  const querchy = new QuerchyX1({
    commonConfig: {
      defaultBuildUrl: (modelBaseUrl, action) => {
        if (
          action.crudType === 'create'
          || action.crudType === 'getCollection'
        ) {
          return modelBaseUrl;
        }
        return `${modelBaseUrl}/${action.resourceId}`;
      },
      defaultQueryRunner: new AxiosRunnerX1(),
      queryRunners: {
        customRunner: new AxiosRunnerX1(),
      },
      actionTypePrefix: '@@appex/App/',
    },
    baseSelector: (s) => {
      return s.global[rootSliceKey];
    },
    models: {
      userSetting: {
        ...getSharedInfo(),
        url: './api/userSettings',
        featureDeps: {
          getId: (action) => {
            return (
              action.response
              && action.response.data
              && action.response.data.type
            );
          },
          parseResponse: (s, action) => {
            return {
              update: (
                (
                  action.response
                  && action.response.data
                ) || []
              ).reduce((m, item) => ({ ...m, [item.type]: item }), {}),
            };
          },
        },
      },
      organization: {
        ...getSharedInfo(),
        url: './api/organizations',
      },
      project: {
        ...getSharedInfo(),
        url: './api/projects',
      },
      memo: {
        ...getSharedInfo(),
        url: './api/memos',
      },
    },
    queryBuilders: {
      defaultBuilder: {
        buildRequestConfig: [
          ({ action, runnerType, commonConfig, models, modelRootState, requestConfig }, next) => {
            const nextCfg = next(requestConfig);
            if (nextCfg && !nextCfg.fromCache) {
              nextCfg.headers = {
                ...getHeaders(),
                ...nextCfg.headers,
              };
            }
            return nextCfg;
          },
          crudUpdateCacheCollectionT1.getBuildRequestConfigMiddleware(),
        ],
      },
      customPath: {
        queryRunner: 'customRunner',
        buildRequestConfig: [
          crudUpdateCacheCollectionT1.getBuildRequestConfigMiddleware(),
        ],
      },
      forExtra: {
        queryRunner: 'customRunner',
        buildRequestConfig: [
          ({ action, runnerType, commonConfig, models }, next) => {
            let overwriteQueryId : any = action.queryId;
            if (!overwriteQueryId) {
              if (action.resourceId) {
                overwriteQueryId = `${action.crudType}?resourceId=${action.resourceId}`;
              } else {
                overwriteQueryId = action.crudType;
              }
            }
            return {
              overwriteQueryId,
              method: 'get',
              url: 'https://httpbin.org/get',
              headers: action.options.headers,
              query: action.options.queryPart,
              body: action.data,
            };
          },
        ],
      },
    },
    extraActionCreators: {
      [INIT_FUNC]: (models) => {
        // console.log('models :', models);
      },
      queryInfos: {
        extraQuery1: {
          actionCreator: (options?) => ({ options }),
          queryBuilderName: 'forExtra',
          globalMerger: (s) => {
            // delete s.httpBinRes.resourceMap['1'];
            delete s.httpBinRes.resourceMap['2'];
            delete s.httpBinRes2.resourceMap['1'];
            delete s.httpBinRes2.resourceMap['2'];
            // console.log('===================== s :', s);
            return s;
          },
        },
      },
      actionInfos: {
        extraAction1: {
          actionCreator: (options) => {
            return {
              cacheChange: null,
            };
          },
        },
      },
    },
  });
  const cacher = new CacherX1(querchy, {
    userSetting: {
      extraSelectorX1: {
        creatorCreator: getExtraSelectorX1(),
      },
    },
    organization: {
      extraSelectorX1: {
        creatorCreator: getExtraSelectorX1(),
      },
      selectCurrentOrganization: {
        creatorCreator: (baseSelector, builtinSelectorCreators) => {
          return () => createSelector(
            builtinSelectorCreators.selectQueryMapValues(),
            builtinSelectorCreators.selectResourceMapValues(),
            (queryMap, resourceMap) => {
              if (!queryMap
                || !queryMap.getCollection
              ) {
                return undefined;
              }
              return queryMap.getCollection.find(
                item => resourceMap[item.id] && resourceMap[item.id].name === 'default',
              );
            },
          );
        },
      },
    },
    project: {
      extraSelectorX1: {
        creatorCreator: getExtraSelectorX1(),
      },
    },
    memo: {
      extraSelectorX1: {
        creatorCreator: getExtraSelectorX1(),
      },
    },
  });

  return {
    querchy,
    cacher,
  };
};

export default createModelMapEx();
