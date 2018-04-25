import moment from 'moment'
import _ from 'underscore'
import { getApiRequest, postApiRequest, putApiRequest, dispatchRequest } from '../services/api'

export const GetManagerPromise = function(id, dispatch){
    const requestor = dispatchRequest(dispatch)

    const managerRequest = getApiRequest({
        type : 'GET_MANAGER',
        id : id,
    })
    return new Promise(function(resolve, reject) {
        requestor('GET_MANAGER')

        managerRequest(function(action){
            dispatch(action) // Have to Notify Response Received
            if(action.error){
                reject(action)
            }
            else{
                resolve(action)
            }
        })
    })
}


export const GetManagerReturnsPromise = function(id, options = { start_date : null, end_date : null }, dispatch){
    const requestor = dispatchRequest(dispatch)

    const returnsRequest = getApiRequest({
        type : 'GET_MANAGER_RETURNS',
        id : id,
        options : {
            start_date : options.start_date,
            end_date : options.end_date
        }
    })
    return new Promise(function(resolve, reject) {
        requestor('GET_MANAGER_RETURNS')

        returnsRequest(function(action){
            dispatch(action) // Have to Notify Response Received
            if(action.error){
                reject(action)
            }
            else{
                resolve(action)
            }
        })
    })
}
