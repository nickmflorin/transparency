import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode'
import { combineReducers } from 'redux';

export function isAuthenticated(state) {
    var csrftoken = Cookies.get('csrftoken');
    if(state.auth.user && state.auth.token && csrftoken){
        return true 
    }
    return false 
}

const missing_auth = { user : null, token : null }
export const authReducer = function(state = missing_auth, action){

    switch (action.type) {
        case 'LOGIN_ERROR':
            return missing_auth
        case 'LOGOUT_ERROR':
            return state;
        case 'LOGOUT_RECEIVED':
            return missing_auth
        case 'TOKEN_ERROR':
            return missing_auth

        // TOKEN_RECEIVED Not Currently Used but We Will Use When Refreshing API Tokens
        case 'TOKEN_RECEIVED':
            return {
                ...state,
                ...jwtDecode(action.data.token),
                token: action.data.token, 
            }
        case 'LOGIN_SUCCESS':
            if(!action.data.user || !action.data.token){
                throw new Error('Successful Login Must Contain Token and User')
            }
            return { 
                ...jwtDecode(action.data.token),
                token: action.data.token, 
                user : action.data.user,
            }
        default:
            // Django Admin Forces Logout by Removing CSRF Token, This Will Remove Stored User As Well
            var csrftoken = Cookies.get('csrftoken');
            if(!csrftoken){
                return missing_auth
            }
            return state
    }
}

export default authReducer;

