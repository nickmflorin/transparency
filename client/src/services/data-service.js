import request from 'superagent'
import { dispatchRequest, deleteApiRequest, getApiRequest, putApiRequest, postApiRequest } from './api'

// Data Service is Included in API Middle Ware -> Triggered Whenenver Dispatched Action Created Has Type
// with Valid Req Object in Above Function
export const dataService = store => next => action => {
    next(action)
    const requestAction = dispatchRequest(next)
    
    // Make Only Applicable Requests (Applicable to a Given Action)
    // Data Service Used as Middle Ware for Many Different Actions
    var req = getApiRequest(action)
    if(req){
        requestAction(action.type)
        req(next)
    }
};

export const deleteService = store => next => action => {
    next(action)
    const requestAction = dispatchRequest(next)

    var req = deleteApiRequest(action)
    if(req){
        requestAction(action.type)
        req(next)
    }
};

export const putService = store => next => action => {
    next(action)
    const requestAction = dispatchRequest(next)

    var req = putApiRequest(action)
    if(req){
        requestAction(action.type)
        req(next)
    }
};

export const postService = store => next => action => {
    next(action)
    const requestAction = dispatchRequest(next)

    var req = postApiRequest(action)
    if(req){
        requestAction(action.type)
        req(next)
    }
};
