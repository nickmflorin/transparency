import { combineReducers } from 'redux';
import { Utilities } from '../utilities'
import _ from 'underscore'

class Warning {
    constructor(reference, message){
        this.id = Utilities.guid()
        this.message = message
        this.reference = reference 
        this.time = new Date()
    }
}

const NoExposuresMessage = "No exposures found for the provided manager."
const NoReturnsMessage = "No returns found for the provided manager."

const removeWarnings = function(state, type){
    return state.filter( (element) => {
        return element.reference != type
    })
}

export const warningsReducer = function(state = [], action) {
    switch(action.type){
        case 'GET_MANAGER_RETURNS_REQUEST':
            return removeWarnings(state, 'GET_MANAGER_RETURNS')
        case 'GET_MANAGER_EXPOSURE_REQUEST':
            return removeWarnings(state, 'GET_MANAGER_EXPOSURES')
        case 'GET_MANAGER_EXPOSURES_REQUEST':
            return removeWarnings(state, 'GET_MANAGER_EXPOSURE')
        case 'GET_MANAGER_CATEGORY_EXPOSURES_REQUEST':
            return removeWarnings(state, 'GET_MANAGER_CATEGORY_EXPOSURES')
        case 'GET_MANAGER_CATEGORY_EXPOSURE_REQUEST':
            return removeWarnings(state, 'GET_MANAGER_CATEGORY_EXPOSURE')

        case 'GET_MANAGER_EXPOSURES_RECEIVED':
            const exposures = action.data.exposures
            if(exposures.length == 0){
                return [
                    ...state,
                    new Warning('GET_MANAGER_EXPOSURES', NoExposuresMessage)
                ]
            }
            else{
                return removeWarnings(state, 'GET_MANAGER_EXPOSURES')
            }
            return state 

        case 'GET_MANAGER_CATEGORY_EXPOSURES_RECEIVED':
            const categories = action.data.exposures
            if(categories.length == 0){
                return [
                    ...state,
                    new Warning('GET_MANAGER_CATEGORY_EXPOSURES', NoExposuresMessage)
                ]
            }
            else{
                return removeWarnings(state, 'GET_MANAGER_CATEGORY_EXPOSURES')
            }

        case 'GET_MANAGER_CATEGORY_EXPOSURE_RECEIVED':
            const category = action.data.exposures
            if(category.length == 0){
                return [
                    ...state,
                    new Warning('GET_MANAGER_CATEGORY_EXPOSURE', NoExposuresMessage)
                ]
            }
            else{
                return removeWarnings(state, 'GET_MANAGER_CATEGORY_EXPOSURE')
            }
            return state

        case 'GET_MANAGER_EXPOSURE_RECEIVED':
            const exposure = action.data.exposures 
            if(exposure.length == 0){
                return [
                    ...state,
                    new Warning('GET_MANAGER_EXPOSURE', NoExposuresMessage)
                ]
            }
            else{
                return removeWarnings(state, 'GET_MANAGER_EXPOSURE')
            }
            return state 

        case 'GET_MANAGER_RETURNS_RECEIVED':
            const returns = action.data 
            if(returns.series.length == 0){
                return [
                    ...state,
                    new Warning('GET_MANAGER_RETURNS', NoReturnsMessage)
                ]
            }
            else{
                return removeWarnings(state, 'GET_MANAGER_RETURNS')
            }
            return state;

        default:
            return state;
    }
};

export default warningsReducer;