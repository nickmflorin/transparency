import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode'
import { combineReducers } from 'redux';

const error_default = { login : null, logout : null }
export const errors = function(state = error_default, action){
    switch(action.type){
        case 'LOGOUT_ERROR':
            return {
                ...state,
                logout : action.error,
            }
        case 'LOGIN_ERROR':
            return {
                ...state,
                login : action.error,
            }
        case 'LOGIN_REQUEST':
            return {
                ...state,
                login : null
            }
        case 'LOGOUT_REQUEST':
            return {
                ...state,
                logout : null
            }
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                login : null
            }
        case 'LOGOUT_SUCCESS':
            return {
                ...state,
                logout : null
            }
        default:
                return state;
    }
}

export function accessToken(state) {
    if (state.access) {
        return state.access.token
    }
}
export function isAuthenticated(state) {
    var csrftoken = Cookies.get('csrftoken');
    if(state.auth.user && state.auth.access && state.auth.access.token && csrftoken){
        return true 
    }
    return false 
}

export const user = function(state = null, action){
    switch (action.type) {
        case 'LOGIN_ERROR':
            return null

        case 'LOGIN_SUCCESS':
            if(!action.data.user) throw new Error('Successful Login Must Contain Token and User')
            return action.data.user
        
        case 'LOGOUT_ERROR':
            return state 

        case 'LOGOUT_RECEIVED':
            return null

        case 'TOKEN_ERROR':
            return null

        default:
            return state
    }
}

export const access = function(state = null, action){
    switch (action.type) {
        case 'LOGIN_ERROR':
            return null

        case 'LOGIN_SUCCESS':
            if(!action.data.token) throw new Error('Successful Login Must Contain Token and User')
            return { 
                ...jwtDecode(action.data.token),
                token: action.data.token, 
            }
    
        case 'LOGOUT_ERROR':
            return state 

        case 'LOGOUT_RECEIVED':
            return null

        case 'TOKEN_RECEIVED':
            return {
                ...jwtDecode(action.data.token),
                token: action.data.token, 
            }
        case 'TOKEN_ERROR':
            return null

        default:
            return state
    }
}

export const authReducer = combineReducers({  
    access : access,
    user : user,
    errors : errors,
});

export default authReducer;

