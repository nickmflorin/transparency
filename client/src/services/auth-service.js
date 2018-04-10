import request from 'superagent'
import { postApiGenerator, postApiRequestAction } from './post-service'
import { getApiGenerator, getApiRequestAction } from './data-service'

export const logoutService = store => next => action => {
    next(action)
    const getApi = getApiGenerator(next)
    const requestAction = getApiRequestAction(next)

    switch (action.type) {
        case 'LOGOUT':
            var url = '/accounts/logout/'
            requestAction('LOGOUT')
            getApi(url, 'LOGOUT')

        default:
            break
    }
}

export const loginService = store => next => action => {
    next(action)
    const postApi = postApiGenerator(next)
    const requestAction = postApiRequestAction(next)

    switch (action.type) {
        case 'LOGIN':
            var url = '/accounts/login/'
            requestAction('LOGIN')
            postApi(url, 'LOGIN', action.data)

        default:
            break
    }
}



