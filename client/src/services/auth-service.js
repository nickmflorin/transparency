import request from 'superagent'
import { createGetApiRequest, createPostApiRequest, dispatchRequest } from './api'

export const logoutService = store => next => action => {
    next(action)
    const requestAction = dispatchRequest(next)

    switch (action.type) {
        case 'LOGOUT':
            requestAction('LOGOUT')
            var url = '/accounts/logout/'
            var req = createGetApiRequest(url, 'LOGOUT', action.options)
            req(next)
            
        default:
            break
    }
}

export const loginService = store => next => action => {
    next(action)
    const requestAction = dispatchRequest(next)

    switch (action.type) {
        case 'LOGIN':
            requestAction('LOGIN')
            var url = '/accounts/login/'
            var req = createPostApiRequest(url, 'LOGIN', action.data)
            req(next)
        default:
            break
    }
}



