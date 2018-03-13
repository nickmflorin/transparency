import jwtDecode from 'jwt-decode'
import Cookies from 'js-cookie';
import { AuthTypes } from '../actions'

const initialState = {
    access: undefined,
    refresh: undefined,
    user: undefined,
    errors: {},
}
// Not Currently Using
export function refreshToken(state) {
    if (state.refresh) {
        return state.refresh.token
    }
}
// Not Currently Using
// Override to Never Expire -> Dont Have DRF Refresh Setup Yet
export function isAccessTokenExpired(state) {
    if (state.access && state.access.exp) {
        return 1000 * state.access.exp - (new Date()).getTime() < 5000
    }
    return true
}
// Not Currently Using
// Override to Never Expire -> Dont Have DRF Refresh Setup Yet
export function isRefreshTokenExpired(state) {
    if (state.refresh && state.refresh.exp) {
        return 1000 * state.refresh.exp - (new Date()).getTime() < 5000
    }
    return true
}

export function accessToken(state) {
    if (state.access) {
        return state.access.token
    }
}
export function isAuthenticated(state) {
    var csrftoken = Cookies.get('csrftoken');
    if(state.user && state.access && state.access.token && csrftoken){
        return true 
    }
    return false 
}
export function user(state) {
    return state.user
}
export function errors(state) {
    return state.errors
}

export default (state = initialState, action) => {
    switch (action.type) {
        case AuthTypes.LOGOUT_SUCCESS:
            return {
                access: undefined,
                user: undefined,
                refresh: undefined,
                errors: [],
            }
        case AuthTypes.LOGIN_SUCCESS:
            // To Do: Reevaluate if we need this, the only reason we are doing this is because we want to be able 
            // to easily include this token in POST API Requests when we don't have access to the state.
            if(!action.user || !action.token){
                throw new Error('Successful Login Must Contain Token and User')
            }
            return {
                user : action.user,
                access: {
                    token: action.token,
                    ...jwtDecode(action.token)
                },
                // Refresh Tokens Not Handled by DjangoRestFramework JWT in Current Setup
                // refresh: {
                //     token: action.payload.refresh,
                //     ...jwtDecode(action.payload.refresh)
                // },
                errors: {}
            }
        case AuthTypes.TOKEN_RECEIVED:
            return {
                ...state,
                access: {
                    token: action.payload.token,
                    ...jwtDecode(action.payload.token)
                }
            }
        case AuthTypes.LOGIN_FAILURE:
        case AuthTypes.TOKEN_FAILURE:
            return {
                access: undefined,
                user: undefined,
                refresh: undefined,
                errors: action.payload.response || { 'non_field_errors': action.payload.statusText },
            }
        default:
            return state
    }
}