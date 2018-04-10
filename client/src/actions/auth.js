import { RSAA } from 'redux-api-middleware';
import Cookies from 'js-cookie';
import $ from 'jquery'

// These HTTP Methods Do Not Require CSRF Protection
export const csrfSafeMethod = function(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

export const logout = function(username, password){
    return function(dispatch) {
        dispatch({
            type : 'LOGOUT'
        })
    };
}
export const login = function(username, password){
    return function(dispatch) {
        dispatch({
            type : 'LOGIN',
            data : {
                username : username,
                password : password,
            }
        })
    };
}

// Not Currently Used => May Want to Use in the Future... This Was Recommended by Many Django React CSRF Guidelines
export const refreshAccessToken = function(token){
    return {
        [RSAA]: {
            endpoint: '/oauth/token/refresh/',
            method: 'POST',
            body: JSON.stringify({ refresh: token }),
            headers: { 'Content-Type': 'application/json' },
            types: [
                'TOKEN_REQUEST',
                'TOKEN_RECEIVED',
                'TOKEN_ERROR',
            ]
        }
    }
}
