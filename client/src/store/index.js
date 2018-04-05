import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory'
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { routerMiddleware, routerReducer } from 'react-router-redux'
import { apiMiddleware } from 'redux-api-middleware';

import { persistStore, persistReducer } from 'redux-persist'
import { createFilter } from 'redux-persist-transform-filter';
import storage from 'redux-persist/es/storage'

import { loadState, saveState } from './localStorage'

import { authReducer, login, logout } from './auth'
import { listsReducer, listsActions } from './lists'
import { managerReducer, managerActions } from './manager'
import { dbReducer, dbActions } from './db'
import { requesting, dates, sidebarShowing, toggleSidebar, StartRequest, StopRequest, changeDate, HttpRequest} from './utility'

import dataService from '../services/data-service'
import saveService from '../services/save-service'
import putService from '../services/put-service'

export * from './api'
export * from './auth'

const rootReducer = combineReducers({  
    router: routerReducer,
    auth: authReducer,
    db : dbReducer,
    managers : managerReducer,
    lists : listsReducer,
    dates : dates,
    requesting : requesting,
    sidebarShowing : sidebarShowing
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

const configureStore = function(history){
  // Use Uncommented Version Below to Persist State Into Local Storage Across Page Refreshes and Browser Reloads
  let store = createStore(persistedReducer, persistedState, applyMiddleware(thunk, saveService, putService, dataService, apiMiddleware, routerMiddleware(history)))
  persistStore(store)

  store.subscribe( () => {
    saveState(store.getState())
  })
  return store
}

export const store = configureStore(history)

export const Actions = {
    toggleSidebar : toggleSidebar,
    StartRequest : StartRequest,
    StopRequest : StopRequest,
    changeDate : changeDate,
    HttpRequest : HttpRequest,
    login : login,
    logout : logout,
    ...listsActions,
    ...dbActions,
    ...managerActions
}

