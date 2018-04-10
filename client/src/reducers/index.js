import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory'
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { routerMiddleware, routerReducer } from 'react-router-redux'
import { apiMiddleware } from 'redux-api-middleware';

import createSagaMiddleware from 'redux-saga'

import { persistStore, persistReducer } from 'redux-persist'
import { createFilter } from 'redux-persist-transform-filter';
import storage from 'redux-persist/es/storage'

import { loadState, saveState } from './localStorage'

import dataService from '../services/data-service'
import postService from '../services/post-service'
import putService from '../services/put-service'
import deleteService from '../services/delete-service'
import { loginService, logoutService } from '../services/auth-service'

import { requesting, dates, sidebarShowing } from './utility'
import { successesReducer, errorsReducer, warningsReducer } from './state'
import listsReducer from './lists'
import managersReducer from './managers'
import dbReducer from './db'
import authReducer from './auth'

export * from './auth'

const rootReducer = combineReducers({  
    successes : successesReducer, 
    errors : errorsReducer, 
    warnings : warningsReducer,
    router: routerReducer,
    auth: authReducer,
    db : dbReducer,
    managers : managersReducer,
    lists : listsReducer,
    dates : dates,
    requesting : requesting,
    sidebarShowing : sidebarShowing,
});


const persistedFilter = createFilter(
  'auth', ['access', 'refresh', 'user'],
  'dates', ['access', 'refresh', 'user'],
  'managers', ['access', 'refresh', 'user']
);

const persistConfig = {
  key: 'polls',
  storage: storage,
  whitelist: ['auth'],
  transforms: [persistedFilter],
}

// Reducer Maintains Logged In State Across Page Refreshes
const persistedReducer = persistReducer(persistConfig, rootReducer)

const persistedState = loadState()
export const history = createHistory()

const sagaMiddleware = createSagaMiddleware()

const configureStore = function(history){
  // Use Uncommented Version Below to Persist State Into Local Storage Across Page Refreshes and Browser Reloads
  let store = createStore(persistedReducer, persistedState, applyMiddleware(thunk, loginService, logoutService, postService, putService, deleteService, dataService, apiMiddleware, routerMiddleware(history), sagaMiddleware))
  persistStore(store)

  store.subscribe( () => {
    saveState(store.getState())
  })
  return store
}

export const store = configureStore(history)

