import { combineReducers } from 'redux';
import { Utilities } from '../utilities'
import _ from 'underscore'

class Error {
    constructor(action){
        this.id = Utilities.guid()
        this.message = action.error 
        this.reference = action.reference 
        this.time = new Date()
    }
}

export const errorsReducer = function(state = [], action){
    switch(action.type){
        case 'CLEAR_ERRORS':
            if(action.reference){
                return state.filter( (element) => {
                    return element.reference != action.reference
                })
            }
            return []
        
        case 'LOGOUT_ERROR':
            return [
                ...state,
                new Error({ error : action.error, reference : 'LOGOUT' })
            ]
        case 'LOGIN_ERROR':
            return [
                ...state,
                new Error({ error : action.error, reference : 'LOGIN' })
            ]
        case 'LOGIN_REQUEST':
            return state.filter( (element) => {
                return element.reference != 'LOGIN'
            })
        case 'LOGOUT_REQUEST':
            return state.filter( (element) => {
                return element.reference != 'LOGOUT'
            })
        case 'LOGIN_SUCCESS':
            return state.filter( (element) => {
                return element.reference != 'LOGIN'
            })
        case 'LOGOUT_SUCCESS':
            return state.filter( (element) => {
                return element.reference != 'LOGOUT'
            })

        // No Requests for Adding Manager to List... Only Action
        case 'ERROR':
            if(!action.reference){
                throw new Error('Error Must Include Reference')
            }
            return [...state, new Error(action)];

        case 'SAVE_MANAGER_LIST_REQUEST':
            return state.filter( (element) => {
                return element.reference != 'SAVE_MANAGER_LIST'
            })

        case 'SAVE_MANAGER_LIST_SUCCESS':
            return state.filter( (element) => {
                return element.reference != 'SAVE_MANAGER_LIST'
            })

        case 'SAVE_NEW_MANAGER_LIST_REQUEST':
            return state.filter( (element) => {
                return element.reference != 'SAVE_NEW_MANAGER_LIST'
            })

        case 'SAVE_NEW_MANAGER_LIST_SUCCESS':
            return state.filter( (element) => {
                return element.reference != 'SAVE_NEW_MANAGER_LIST'
            })

        default:
            return state;
    }
}

export default errorsReducer;
