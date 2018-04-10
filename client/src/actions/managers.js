import moment from 'moment'
import _ from 'underscore'

export const selectManager = function(manager) {
    return function(dispatch) {
        dispatch({
            type : 'SELECT_MANAGER',
            data : manager
        })
    };
}
export const getManager = function(id) {
    return function(dispatch) {
        dispatch({
            type : 'GET_MANAGER',
            id : id
        })
    };
}
export const searchManager = function(search, limit) {
    return function(dispatch) {
        dispatch({
            type : 'SEARCH_MANAGER',
            options : {
                search : search,
                limit : limit
            }
        })
    };
}

export const getManagerCategoryExposure = function(id, date, options = { category : null, tier : null, level : null }) {
    return function(dispatch) {
        dispatch({
            type : 'GET_MANAGER_CATEGORY_EXPOSURE',
            id : id,
            options : {
                date : date,
                category : options.category,
                level : options.level,
                tier : options.tier,
            }
        })
    };
}

export const getManagerCategoryExposures = function(id, options = { category : null, tier : null, level : null, start_date : null, end_date : null}) {
    return function(dispatch) {
        dispatch({
            type : 'GET_MANAGER_CATEGORY_EXPOSURES',
            id : id,
            options : {
                category : options.category,
                level : options.level,
                tier : options.tier,
                start_date : options.start_date,
                end_date : options.end_date,
            }
        })
    };
}

export const getManagerExposure = function(id, date) {
    return function(dispatch) {
        dispatch({
            type : 'GET_MANAGER_EXPOSURE',
            id : id,
            options : {
                date : date,
            }
        })
    };
}

export const getManagerExposures = function(id, options = { start_date : null, end_date : null}) {
    return function(dispatch) {
        dispatch({
            type : 'GET_MANAGER_EXPOSURES',
            id : id,
            options : {
                start_date : options.start_date,
                end_date : options.end_date,
            }
        })
    };
}

// To Do: Make Sure Start and End Dates Valid
// Start Date and End Dates Passed In as Moment Objects
export const getManagerReturns = function(id, options = { start_date : null, end_date : null, date : null}){
    return function(dispatch) {
        dispatch({
            type : 'GET_MANAGER_RETURNS',
            id : id,
            options : {
                start_date : options.start_date,
                end_date : options.end_date,
                date : options.date,
            }
        })
    };
}

// Start and End Dates Probably Not Currently Implemented in API Backend
// Common Refers to Specific Manager Group with Common Indices In It
export const getManagerBetas = function(id, options = { managers : [], groups : ["common"], start_date : null, end_date : null, date : null}) {
    return function(dispatch) {
        dispatch({
            type : 'GET_MANAGER_BETAS',
            id : id,
            options : {
                groups : options.groups,
                managers : options.managers,
                start_date : options.start_date,
                end_date : options.end_date,
                date : options.date,
            }
        })
    };
}

