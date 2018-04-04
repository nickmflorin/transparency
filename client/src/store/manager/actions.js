import moment from 'moment'
import _ from 'underscore'

import { store, Api } from '../../store'
import { HttpRequest, StartRequest, StopRequest } from '../utility'
import { Handler, Types } from './handler'

export const selectManager = function(manager) {
    return function(dispatch) {
        dispatch(Handler.Manager.Select.Success(manager))
    };
}
export const getManager = function(id) {
    return function(dispatch) {
        StartRequest()
        return Api.manager.GetManager(id).then(response => {
            StopRequest()
            if(response.error){
                dispatch(Handler.Manager.Get.Error(response.error))
            }
            else{
                dispatch(Handler.Manager.Get.Success(response))
            }
        }).catch(error => {
            throw (error);
        });
    };
}
export const searchManager = function(search, limit) {
    return function(dispatch) {
        return Api.manager.SearchManager(search, limit=limit).then(results => {
            dispatch(Handler.Manager.Search.Success(results));
        }).catch(error => {
            throw (error);
        });
    };
}

export const getManagerCategoryExposures = function(id, options = { category : null, tier : null, level : null, start_date : null, end_date : null, date : null}) {
    return function(dispatch) {
        StartRequest()
        return Api.manager.GetManagerCategoryExposures(id, options).then(response => {
            StopRequest()
            if(response.error){
                dispatch(Handler.Manager.Categories.Get.Error(response.error))
            }
            else{
                dispatch(Handler.Manager.Categories.Get.Success(response))
            }
        }).catch(error => {
            throw (error);
        });
    };
}

export const getManagerExposure = function(id, date) {
    return function(dispatch) {
        StartRequest()
        return Api.manager.GetManagerExposure(id, date).then(response => {
            StopRequest()
            if(response.error){
                dispatch(Handler.Manager.Exposure.Get.Error(response.error))
            }
            else{
                dispatch(Handler.Manager.Exposure.Get.Success(response))
            }
        }).catch(error => {
            throw (error);
        });
    };
}

export const getManagerExposures = function(id, options = { start_date : null, end_date : null}) {
    return function(dispatch) {
        StartRequest()
        return Api.manager.GetManagerExposures(id, options).then(response => {
            StopRequest()
            if(response.error){
                dispatch(Handler.Manager.Exposures.Get.Error(response.error))
            }
            else{
                dispatch(Handler.Manager.Exposures.Get.Success(response))
            }
        }).catch(error => {
            throw (error);
        });
    };
}

// Start and End Dates Probably Not Currently Implemented in API Backend
// Common Refers to Specific Manager Group with Common Indices In It
export const getManagerBetas = function(id, options = { managers : [], groups : ["common"], start_date : null, end_date : null, date : null}) {
    return function(dispatch) {
        StartRequest()
        return Api.manager.GetManagerBetas(id, options).then(response => {
            StopRequest()
            if(response.error){
                dispatch(Handler.Manager.Betas.Get.Error(response.error))
            }
            else{
                dispatch(Handler.Manager.Betas.Get.Success(response))
            }
        }).catch(error => {
            throw (error);
        });
    };
}

// To Do: Make Sure Start and End Dates Valid
// Start Date and End Dates Passed In as Moment Objects
export const getManagerReturns = function(id, options = { start_date : null, end_date : null, date : null}){
    return function(dispatch) {
        StartRequest()
        return Api.manager.GetManagerReturns(id, options).then(response => {
            StopRequest()
            if(response.error){
                dispatch(Handler.Manager.Returns.Get.Error(response.error))
            }
            else{
                dispatch(Handler.Manager.Returns.Get.Success(response))
            }
        }).catch(error => {
            throw (error);
        });
    };
}
