import { createEpicMiddleware, combineEpics } from 'pure-epic';
import {
  QcAction,
  AnyQueryActionCreatorWithProps,
  INIT_FUNC,
  createFeatureGroup,
} from 'querchy';

import combineReducers from 'querchy/exports/redux/combineReducers';

import {
  QuerchyX1,
  AxiosRunnerX1,
  CacherX1,

  StoreX1,
  Types,
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

export const crudToRestMap = {
  create: 'post',
  read: 'get',
  update: 'patch',
  delete: 'delete',
  getCollection: 'get',
};

export const createEpicMiddlewareX1 = (...args : any[]) => createEpicMiddleware<
  QcAction,
  Types['StateType'],
  StoreX1,
  any
>(...args);

export type EpicMiddlewareCb = (next: Function) => (action: QcAction) => any;

const rootSliceKey = 'cache';

let modelMapEx : {
  querchy: QuerchyX1,
  cacher: CacherX1,
} | null = null;

const getSharedInfo = () => ({
  url: 'https://httpbin.org',
  buildUrl: (modelBaseUrl, action) => `${modelBaseUrl}/${crudToRestMap[action.crudType]}`,
  queryInfos: {},
  actionInfos: {},
});

export const createModelMapEx = () => {
  if (modelMapEx) {
    return modelMapEx;
  }
  const querchy = new QuerchyX1({
    commonConfig: {
      // defaultBuildUrl: (modelBaseUrl, action) => {
      //   if (action.crudType === 'create') {
      //     return modelBaseUrl;
      //   }
      //   return `${modelBaseUrl}/${action.id}`;
      // },
      defaultBuildUrl: (
        modelBaseUrl,
        action,
      ) => `${modelBaseUrl}/${crudToRestMap[action.crudType]}`,
      defaultQueryRunner: new AxiosRunnerX1(),
      queryRunners: {
        customRunner: new AxiosRunnerX1(),
      },
      actionTypePrefix: '@@appex/App/',
    },
    baseSelector: (s) => {
      return s[rootSliceKey];
    },
    models: {
      httpBinRes: {
        ...getSharedInfo(),
        feature: crudUpdateCacheT1,
        featureDeps: {
          getId: (action) => {
            return (
              action.response
              && action.response.data
              && action.response.data.args
              && action.response.data.args.id
            );
          },
        },
      },
      httpBinRes2: {
        ...getSharedInfo(),
        actionInfos: {
          updateCache2: {
            actionCreator: cacheChange => ({ cacheChange }),
            resourceMerger: s => s,
          },
        },
        feature: crudUpdateCacheCollectionT1,
        featureDeps: {
          getId: (action) => {
            return (
              action.response
              && action.response.data
              && action.response.data.args
              && action.response.data.args.id
            );
          },
          parseResponse: (s, action) => ({
            update: {
              '1': action.response.data,
              '2': action.response.data,
            },
          }),
        },
      },
    },
    queryBuilders: {
      defaultBuilder: {
        buildRequestConfig: [
          ({ action, runnerType, commonConfig, models, modelRootState }, next) => {
            const resourceId : string = action.resourceId;
            const modelName = action.modelName;
            if (
              resourceId && modelName
              && modelRootState[modelName].resourceMap.metadata[resourceId]
              && modelRootState[modelName].resourceMap.metadata[resourceId].lastUpdate
              && modelRootState[modelName].resourceMap.metadata[resourceId].lastUpdate!.updateData
            ) {
              return {
                overwriteQueryId: resourceId,
                fromCache: true,
                responseFromCache: modelRootState
                  [modelName].resourceMap.metadata[resourceId].lastUpdate!.updateData,
              };
            }
            return next();
          },
          crudUpdateCacheT1.getBuildRequestConfigMiddleware(),
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
    httpBinRes: {
      extraSelectorX1: {
        creatorCreator: (baseSelector) => {
          return () => (state) => {
            return Object.keys(
              baseSelector(state).httpBinRes.resourceMap.values,
            )[0] || 'XX';
          };
        },
      },
    },
  });

  return modelMapEx = {
    querchy,
    cacher,
  };
};

createModelMapEx();
