import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import { persistStore, persistReducer } from 'redux-persist'
import { createFilter } from 'redux-persist-transform-filter';
import storage from 'redux-persist/es/storage'

// Individual Reducers
import { requesting, dates, sidebarShowing } from './utility'
import authReducer from './auth'
import errorsReducer from './errors'
import warningsReducer from './warnings'
import listsReducer from './lists'
import managersReducer from './managers'
import dbReducer from './db'

export * from './auth'
export * from './apps'

// Cannot Persist Apps Because of JSON Structure & Icons
// To Do: Include Other Things We Want to Persist
const persistedFilter = createFilter(
  'auth', ['user', 'token'],
  'managers', ['selected'],
);

const persistConfig = {
  key: 'state',
  storage: storage,
  whitelist: ['auth', 'managers'],
  blacklist: ['requesting'],
  transforms: [persistedFilter],
}

const rootReducer = combineReducers({  
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

// Reducer Maintains Logged In State Across Page Refreshes
export const persistedReducer = persistReducer(persistConfig, rootReducer)
