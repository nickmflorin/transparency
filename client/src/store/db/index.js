import { combineReducers } from 'redux';
import * as api from './api'
import * as reducers from './reducers'
import * as actions from './actions'

export * from './actions'
export * from './handler'

export const dbApi = {
    SaveQuery : api.SaveQuery,
    GetQueries : api.GetQueries,
    GetQuery : api.GetQuery,
    RemoveQuery : api.RemoveQuery,
    RunQuery : api.RunQuery,
    GetDatabase : api.GetDatabase,
    GetDatabases : api.GetDatabases,
    UpdateQuery : api.UpdateQuery,
}

export const dbReducer = combineReducers({  
    databases: reducers.databases,
    queries : reducers.queries,
    query : reducers.query,
});

export const dbActions = {
    query : {
        createTempQuery : actions.createTempQuery,
        saveNewQuery : actions.saveNewQuery,
        saveQuery : actions.saveQuery,
        removeQuery : actions.removeQuery,
        updateQuery : actions.updateQuery,
        getQuery : actions.getQuery,
        getQueries : actions.getQueries,
        runQuery : actions.runQuery,
        openQuery : actions.openQuery,
        openTableQuery : actions.openTableQuery,
    },
    databases : {
        getDatabases : actions.getDatabases
    }
}