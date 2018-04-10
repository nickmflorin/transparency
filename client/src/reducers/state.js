import { combineReducers } from 'redux';
import _ from 'underscore'

export function list_successes(state = { save : null }, action){
    switch(action.type){
        case 'SAVE_MANAGER_LIST_REQUEST':
            return {
                ...state,
                save : false
            }
        case 'SAVE_NEW_MANAGER_LIST_REQUEST':
            return {
                ...state,
                save : false
            }
        case 'SAVE_MANAGER_LIST_SUCCESS':
            return {
                ...state,
                save : true
            }
        case 'SAVE_NEW_MANAGER_LIST_SUCCESS':
            return {
                ...state,
                save : true
            }
        case 'SAVE_MANAGER_LIST_ERROR':
            return {
                ...state,
                save : false,
            }
        case 'SAVE_NEW_MANAGER_LIST_ERROR':
            return {
                ...state,
                save : false,
            }
        default:
            return state;
    }
}

const list_errors = function(state = { save : null }, action){
    switch(action.type){
        case 'SAVE_MANAGER_LIST_REQUEST':
                return {
                    ...state,
                    save : null
                }
            case 'SAVE_NEW_MANAGER_LIST_REQUEST':
                return {
                    ...state,
                    save : null
                }
            case 'SAVE_NEW_MANAGER_LIST_SUCCESS':
                return {
                    ...state,
                    save : null
                }
            case 'SAVE_MANAGER_LIST_ERROR':
                return {
                    ...state,
                    save : action.error
                }
            case 'SAVE_NEW_MANAGER_LIST_ERROR':
                return {
                    ...state,
                    save : action.error
                }
            default:
                return state;
    }
}

const manager_errors = function(state = {}, action) {
    switch(action.type){
        default:
            return state;
    }
};

const manager_warnings = function(state = { exposures : null, exposure : null, categories : null, category : null, returns : null }, action) {
    switch(action.type){
        case 'GET_MANAGER_EXPOSURES_RECEIVED':
            const exposures = action.data.exposures
            if(exposures.length == 0){
                return {
                    ...state,
                    exposures : "No exposures found for the provided manager."
                }
            }
            else{
                return {
                    ...state,
                    exposures : null,
                }
            }
            return state 

        case 'GET_MANAGER_CATEGORY_EXPOSURES_RECEIVED':
            const categories = action.data.exposures
            if(categories.length == 0){
                return {
                    ...state,
                    categories : "No exposures found for the provided manager."
                }
            }
            else{
                return {
                    ...state,
                    categories : null,
                }
            }
            return state;

        case 'GET_MANAGER_CATEGORY_EXPOSURE_RECEIVED':
            const category = action.data.exposures
            if(category.length == 0){
                return {
                    ...state,
                    category : "No exposures found for the provided manager."
                }
            }
            else{
                return {
                    ...state,
                    category : null,
                }
            }
            return state

        case 'GET_MANAGER_EXPOSURE_RECEIVED':
            const exposure = action.data.exposures 
            if(exposure.length == 0){
                return {
                    ...state,
                    exposure : "No exposure found for the provided manager."
                }
            }
            else{
                return {
                    ...state,
                    exposure : null,
                }
            }
            return state 

        case 'GET_MANAGER_RETURNS_RECEIVED':
            const returns = action.data 
            if(returns.series.length == 0){
                return {
                    ...state,
                    returns : "No returns found for the provided manager."
                }
            }
            else{
                return {
                    ...state,
                    returns : null,
                }
            }
            return state;

        default:
            return state;
    }
};

const query_successes = function(state = { save : false, create : false }, action){
    switch(action.type){
        case 'CLEAR_QUERY_SUCCESSES':
            if(state[action.success_type] !== undefined){
                const new_state = _.clone(state)
                new_state[action.success_type] = false
                return new_state
            }
            return state 

        case 'SAVE_QUERY':
            return {
                ...state,
                save : false
            }
        case 'SAVE_NEW_QUERY':
            return {
                ...state,
                create : false
            }
        case 'SAVE_QUERY_SUCCESS':
            return {
                ...state,
                save : true
            }
        case 'SAVE_NEW_QUERY_SUCCESS':
            return {
                ...state,
                create : true
            }
        default:
            return state;
    }
}

// Currently Not Using These -> But Will be Useful in Future
const query_errors = function(state = { save : null, create : null, run : null }, action) {
    switch(action.type){
        case 'CLEAR_QUERY_ERRORS':
            if(state[action.error_type] !== undefined){
                const new_state = _.clone(state)
                new_state[action.error_type] = null
                return new_state
            }
            return state 

        case 'RUN_QUERY_ERROR':
            return {
                ...state,
                run : action.error
            }
        case 'SAVE_QUERY_ERROR':
            return {
                ...state,
                save : action.error
            }
        case 'SAVE_NEW_QUERY_ERROR':
            return {
                ...state,
                create : action.error
            }
        default:
            return state;
    }
};

export const successesReducer = combineReducers({  
    query : query_successes,
    list : list_successes,
});

export const warningsReducer = combineReducers({  
    query : query_errors,
    manager : manager_warnings,
});

export const errorsReducer = combineReducers({  
    query : query_errors,
    manager : manager_errors,
    list : list_errors,
});

