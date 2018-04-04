import jwtDecode from 'jwt-decode'
import { Types, Handler } from './handler'
import * as reducers from './reducers'

export * from './api'
export * from './reducers'
export * from './actions'

const initialState = {
    access: undefined,
    user: undefined,
    errors: [],
}

export const isAuthenticated =
 state => reducers.isAuthenticated(state.auth)
export const user =
 state => reducers.user(state.auth)
export const accessToken = 
  state => reducers.accessToken(state.auth)
export const authErrors =
  state => reducers.errors(state.auth)

export const authReducer = function(state = initialState, action){
    switch (action.type) {
        case Types.login.error:
            return {
                access: undefined,
                user: undefined,
                errors: [action.error]
            }
        // Refresh Tokens Not Handled by DjangoRestFramework JWT in Current Setup
        case Types.login.success:
            if(!action.user || !action.token){
                throw new Error('Successful Login Must Contain Token and User')
            }
            return {
                user : action.user,
                access: { token: action.token, ...jwtDecode(action.token)},
                errors: []
            }
        case Types.logout.error:
            return state 

        case Types.logout.success:
            return {
                access: undefined,
                user: undefined,
                errors: [],
            }
        case Types.token.received:
            return {
                ...state,
                access: { token: action.token, ...jwtDecode(action.token)}
            }
        case Types.token.error:
            return {
                access: undefined,
                user: undefined,
                errors: action.response || action.statusText
            }
        default:
            return state
    }
}