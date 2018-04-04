import _ from 'underscore'
import { ActionGroup } from '../helpers'

export const Types = {
    login : {
        request: 'LOGIN_REQUEST',
        error: 'LOGIN_ERROR',
        success: 'LOGIN_SUCCESS',
    },
    logout : {
        request: 'LOGOUT_REQUEST',
        error: 'LOGOUT_ERROR',
        success: 'LOGOUT_SUCCESS',
    },
    token : {
        request: 'TOKEN_REQUEST',
        error: 'TOKEN_FAILURE',
        received: 'TOKEN_RECEIVED',
    }
}

export const Handler = {
    Login : {
        Success : function(token, user){
            return { type: Types.login.success, token, user };
        },
        Error : function(){
            return { type: Types.login.error };
        }
    },
    Logout : {
        Success : function(){
            return { type: Types.logout.success };
        },
        Error : function(){
            return { type: Types.logout.error };
        }
    }
}
    