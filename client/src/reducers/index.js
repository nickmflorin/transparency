import { combineReducers, createStore, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux'
import storage from 'redux-persist/es/storage'

import { apiMiddleware } from 'redux-api-middleware';
import { createFilter   } from 'redux-persist-transform-filter';
import { persistReducer, persistStore } from 'redux-persist'

import thunk from 'redux-thunk';
import auth, * as Auth from './auth.js'

import { lists, list } from './lists';
import { mgrs } from './managers'
import { db } from './db'
import { requesting } from './http'

const rootReducer = combineReducers({  
    router: routerReducer,
    auth: auth,
    db,
    mgrs,
    lists, list, requesting,
});

const persistedFilter = createFilter(
  'auth', ['access', 'refresh', 'user']
);

const persistConfig = {
  key: 'polls',
  storage: storage,
  whitelist: ['auth'],
  transforms: [persistedFilter],
}
// Reducer Maintains Logged In State Across Page Refreshes
export const persistedReducer = persistReducer(persistConfig, rootReducer)

export default (history) => {
  let store = createStore(persistedReducer, applyMiddleware(thunk, apiMiddleware, routerMiddleware(history)))
  persistStore(store)
  return store
}

export const isAuthenticated =
 state => Auth.isAuthenticated(state.auth)
export const user =
 state => Auth.user(state.auth)
export const accessToken = 
  state => Auth.accessToken(state.auth)
export const isAccessTokenExpired =
  state => Auth.isAccessTokenExpired(state.auth)
export const refreshToken =
  state => Auth.refreshToken(state.auth)
export const isRefreshTokenExpired =
  state => Auth.isRefreshTokenExpired(state.auth)
export const authErrors =
  state => Auth.errors(state.auth)


