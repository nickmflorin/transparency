import moment from 'moment'
import { ManagerTypes } from './types'
import { apiGetManagerReturns, apiSearchManager, apiGetManagers, apiGetManager } from '../api'
import { HttpRequest } from './http'

function loadManagerSuccess(manager) {
    return { type: ManagerTypes.LOAD_MANAGER_SUCCESS, manager };
}
function searchedManagerSuccess(results) {
    return { type: ManagerTypes.SEARCH_MANAGER_SUCCESS, results };
}
function selectManagerSuccess(selected){
    return { type: ManagerTypes.SELECT_MANAGER_SUCCESS, selected };
}
function loadManagersSuccess(managers) {
    return { type: ManagerTypes.LOAD_MANAGERS_SUCCESS, managers };
}
function clearManagersSuccess() {
    return { type: ManagerTypes.CLEAR_MANAGERS };
}
function removeManagerSuccess(id) {
    return { type: ManagerTypes.REMOVE_MANAGER, id };
}
function UpdateManagerReturns(id, returns){
    return { type: ManagerTypes.UPDATE_MANAGER_RETURNS, id , returns};
}
export const getManagers = function(ids, start_date = null, end_date = null, extended = true) {
    return function(dispatch) {
        dispatch(HttpRequest(true))

        return apiGetManagers(ids,  start_date, end_date, extended).then(selected => {
            dispatch(HttpRequest(false))
            dispatch(loadManagersSuccess(selected));

        }).catch(error => {
            dispatch(HttpRequest(false))
            throw (error);
        });
    };
}
export const clearManagers = function(ids, query) {
    return function(dispatch) {
        dispatch(clearManagersSuccess())
    };
}
export const removeManager = function(id) {
    return function(dispatch) {
        dispatch(removeManagerSuccess(id))
    };
}
export const selectManager = function(id, start_date = null, end_date = null, extended = true) {
    return function(dispatch) {
        dispatch(HttpRequest(true))

        return apiGetManager(id, start_date, end_date, extended).then(selected => {
            dispatch(HttpRequest(false))
            dispatch(selectManagerSuccess(selected));

        }).catch(error => {
            dispatch(HttpRequest(false))
            throw (error);
        });
    };
}
// To Do: Make Sure Start and End Dates Valid
// Start Date and End Dates Passed In as Moment Objects
export const updateManagerReturns = function(ids, start_date = null, end_date = null){
    return function(dispatch) {
        dispatch(HttpRequest(true))

        return apiGetManagerReturns(ids, start_date, end_date).then(returns => {
            dispatch(HttpRequest(false))

            for(var i = 0; i<returns.length; i++){
                dispatch(UpdateManagerReturns(returns[i].id, returns[i].returns));
            }
        }).catch(error => {
            dispatch(HttpRequest(false))
            throw (error);
        });
    };
}
export const getManager = function(id,  start_date = null, end_date = null, extended = true) {
    return function(dispatch) {
        dispatch(HttpRequest(true))

        return apiGetManager(id, start_date, end_date, extended).then(manager => {
            dispatch(HttpRequest(false))
            dispatch(loadManagerSuccess(manager));

        }).catch(error => {
            dispatch(HttpRequest(false))
            throw (error);
        });
    };
}
export const searchManager = function(search, limit) {
    return function(dispatch) {
        return apiSearchManager(search, limit=limit).then(results => {
            dispatch(searchedManagerSuccess(results));
        }).catch(error => {
            throw (error);
        });
    };
}

