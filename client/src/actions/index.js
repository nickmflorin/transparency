import { HttpRequest } from './http'

export * from './http'
export * from './lists'
export * from './manager'
export * from './auth'
export * from './db'
export * from './types'

export class Loading {
    static startLoading() {
        return function(dispatch) {
            dispatch(HttpRequest(true))
        }
    }
    static stopLoading() {
        return function(dispatch) {
            dispatch(HttpRequest(false))
        }
    }
}

