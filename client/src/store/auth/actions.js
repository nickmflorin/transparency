import { RSAA } from 'redux-api-middleware';
import Cookies from 'js-cookie';
import $ from 'jquery'

import { StartRequest, StopRequest } from '../utility'
import { apiLogout, apiLogin } from './api'
import { Handler, Types } from './handler'

// These HTTP Methods Do Not Require CSRF Protection
export const csrfSafeMethod = function(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

export const logout = function(username, password){
    return function(dispatch) {
        StartRequest()
        return apiLogout().then(response => {
            StopRequest()

            if(response.success && response.success == true){
                dispatch(Handler.Logout.Success(response.success))
            }
            else{
                dispatch(Handler.Logout.Error(response.error))
            }
        }).catch(error => {
            throw (error);
        });
    };
}
export const login = function(username, password){
    return function(dispatch) {
        StartRequest()
        return apiLogin(username, password).then(response => {
            StopRequest()
    
            if(response.error){
                dispatch(Handler.Login.Error(response.error))
            }
            else{
                if(response.user && response.token){
                     dispatch(Handler.Login.Success(response.token, response.user))
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

// Not Currently Used => May Want to Use in the Future... This Was Recommended by Many Django React CSRF Guidelines
export const refreshAccessToken = function(token){
    return {
        [RSAA]: {
            endpoint: '/oauth/token/refresh/',
            method: 'POST',
            body: JSON.stringify({ refresh: token }),
            headers: { 'Content-Type': 'application/json' },
            types: [
                Types.token.request,
                Types.token.received,
                Types.token.error,
            ]
        }
    }
}
