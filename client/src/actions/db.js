import moment from 'moment'
import { apiGetDatabases, apiGetDatabase, apiQuery, apiTableQuery } from '../api'
import { HttpRequest } from './http'
import { DatabaseTypes } from './types'

export function loadDatabasesSuccess(databases) {
    return { type: DatabaseTypes.LOAD_DATABASES_SUCCESS, databases };
};
export function loadDatabasesError(error) {
    return { type: DatabaseTypes.LOAD_DATABASES_ERROR, error };
};
export function runQuerySuccess(query_result) {
    return {type: DatabaseTypes.RUN_QUERY_SUCCESS, query_result};
};
export function runQueryError(error) {
    return { type: DatabaseTypes.RUN_QUERY_ERROR, error };
};

export const getDatabases = function() {
    return function(dispatch) {
        dispatch(HttpRequest(true))

        return apiGetDatabases().then(response => {
            dispatch(HttpRequest(false))
            if(response.error){
            	dispatch(loadDatabasesError(response.error));
            }
            else{
            	dispatch(loadDatabasesSuccess(response));
            }
        }).catch(error => {
            dispatch(HttpRequest(false))
            throw (error);
        });
    };
}

export const query_table = function(tableId, query = null) {
    return function(dispatch) {
        dispatch(HttpRequest(true))

        return apiTableQuery(tableId, query).then(response => {
            dispatch(HttpRequest(false))
            if(response.error){
                dispatch(runQueryError(response.error));
            }
            else{
                // Must be Passed As List for Query Set
                if(response.length == 0){
                    throw new Error('Unexpected Query Result Response Length')
                }
                dispatch(runQuerySuccess(response[0]));
            }
        }).catch(error => {
            dispatch(HttpRequest(false))
            throw (error);
        });
    };
}

export const query = function(query) {
    if(!query || String(query).trim() == ""){
        throw new Error('Must Provide Valid Query')
    }

    return function(dispatch) {
        dispatch(HttpRequest(true))
        return apiQuery(query).then(response => {
            dispatch(HttpRequest(false))
            if(response.error){
            	dispatch(runQueryError(response.error));
            }
            else{
            	// Must be Passed As List for Query Set
            	if(response.length == 0){
            		throw new Error('Unexpected Query Result Response Length')
            	}
            	dispatch(runQuerySuccess(response[0]));
            }
        }).catch(error => {
            dispatch(HttpRequest(false))
            throw (error);
        });
    };
}




