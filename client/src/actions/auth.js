import { RSAA } from 'redux-api-middleware';
import Cookies from 'js-cookie';
import { apiLogout, apiLogin } from '../api'
import $ from 'jquery'

export const AuthTypes = {
    LOGIN_REQUEST : 'LOGIN_REQUEST',
    LOGIN_SUCCESS : 'LOGIN_SUCCESS',
    LOGIN_FAILURE : 'LOGIN_FAILURE',

    LOGOUT_REQUEST : 'LOGOUT_REQUEST',
    LOGOUT_SUCCESS : 'LOGOUT_SUCCESS',
    LOGOUT_FAILURE : 'LOGOUT_FAILURE',

    TOKEN_REQUEST : 'TOKEN_REQUEST',
    TOKEN_RECEIVED : 'TOKEN_RECEIVED',
    TOKEN_FAILURE : 'TOKEN_FAILURE',
}

export function LogoutSuccess(complete) {
    return { type: AuthTypes.LOGOUT_SUCCESS, complete };
}
export function LogoutError(error) {
    return { type: AuthTypes.LOGOUT_FAILURE, error };
}
export function LoginError(error) {
    return { type: AuthTypes.LOGIN_FAILURE, error };
}
export const LoginSuccess = function(token, user) {
    return { type: AuthTypes.LOGIN_SUCCESS, token, user };
}
// These HTTP Methods Do Not Require CSRF Protection
export const csrfSafeMethod = function(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

export const logout = function(username, password){
    return function(dispatch) {
        return apiLogout().then(response => {
            if(response.success && response.success == true){
                dispatch(LogoutSuccess(response.success))
            }
            else{
                dispatch(LogoutError(response.error))
            }
        }).catch(error => {
            throw (error);
        });
    };
}
export const login = function(username, password){
    return function(dispatch) {
        return apiLogin(username, password).then(response => {
            if(response.error){
                dispatch(LoginError(response.error))
            }
            else{
                if(response.user && response.token){
                     dispatch(LoginSuccess(response.token, response.user))
                }
                else{
                    throw new Error('Response Must Contain User and Token')
                }
            }
        }).catch(error => {
            throw (error);
        });
    };
}


export const refreshAccessToken = function(token){
    return {
        [RSAA]: {
            endpoint: '/oauth/token/refresh/',
            method: 'POST',
            body: JSON.stringify({ refresh: token }),
            headers: { 'Content-Type': 'application/json' },
            types: [
                AuthTypes.TOKEN_REQUEST, AuthTypes.TOKEN_RECEIVED, AuthTypes.TOKEN_FAILURE
            ]
        }
    }
}
