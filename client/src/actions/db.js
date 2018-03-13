import moment from 'moment'
import { DatabaseTypes } from './types'
import { apiGetDatabases, apiGetDatabase, apiQuery } from '../api'
import {HttpRequest} from './http'

function loadDatabasesSuccess(databases) {
    return { type: DatabaseTypes.LOAD_DATABASES_SUCCESS, databases };
}
function loadDatabasesError(error) {
    return { type: DatabaseTypes.LOAD_DATABASES_ERROR, error };
}
function runQuerySuccess(result) {
    return { type: DatabaseTypes.RUN_QUERY_SUCCESS, result };
}
function runQueryError(error) {
    return { type: DatabaseTypes.RUN_QUERY_ERROR, error };
}

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

export const query = function(tableId, query = null) {
    return function(dispatch) {
        dispatch(HttpRequest(true))

        return apiQuery(tableId, query).then(response => {
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



