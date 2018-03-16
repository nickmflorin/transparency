import moment from 'moment'
import { ManagerTypes } from './types'
import { apiGetManagerReturns, apiSearchManager, apiGetManagers, apiGetManager, apiGetManagerExposures } from '../api'
import { HttpRequest } from './http'

function SearchManagerSuccess(results) {
    return { type: ManagerTypes.SEARCH_MANAGER, results };
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
export const addManager = function(id, options = { start_date : null, end_date : null, date : null}) {
    return function(dispatch) {
        dispatch(HttpRequest(true))

        return apiGetManager(id, options).then(added => {
            dispatch(HttpRequest(false))
            dispatch({ type: ManagerTypes.ADD_MANAGER, added });

        }).catch(error => {
            dispatch(HttpRequest(false))
            throw (error);
        });
    };
}
export const getManagerExposures = function(id, options = { start_date : null, end_date : null, date : null}) {
    return function(dispatch) {
        dispatch(HttpRequest(true))

        return apiGetManagerExposures(id, options).then(exposures => {
            dispatch(HttpRequest(false))
            dispatch({ type: ManagerTypes.GET_MANAGER_EXPOSURES, exposures });
        }).catch(error => {
            dispatch(HttpRequest(false))
            throw (error);
        });
    };
}

export const selectManager = function(id, options = { start_date : null, end_date : null, date : null}) {
    return function(dispatch) {
        dispatch(HttpRequest(true))

        return apiGetManager(id, options).then(selected => {
            dispatch(HttpRequest(false))
            dispatch({ type: ManagerTypes.SELECT_MANAGER, selected });

        }).catch(error => {
            dispatch(HttpRequest(false))
            throw (error);
        });
    };
}
// To Do: Make Sure Start and End Dates Valid
// Start Date and End Dates Passed In as Moment Objects
export const updateManagerReturns = function(ids, options = { start_date : null, end_date : null, date : null}){
    return function(dispatch) {
        dispatch(HttpRequest(true))

        return apiGetManagerReturns(ids, options).then(returns => {
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
export const searchManager = function(search, limit) {
    return function(dispatch) {
        return apiSearchManager(search, limit=limit).then(results => {
            dispatch(SearchManagerSuccess(results));
        }).catch(error => {
            throw (error);
        });
    };
}

