import request from 'superagent';
import Cookies from 'js-cookie';
import { dispatchRequest } from './request'

export const createGetApiRequest = function(route, name, options){
    return function(callback){
        return request.get(route)
            .query(options)
            .end((error, response) => {
                if (error) {
                    return callback({
                        type: `${name}_ERROR`,
                        error : error,
                    })
                }
                const data = JSON.parse(response.text)
                if(data.error){
                    return callback({
                        type: `${name}_ERROR`,
                        error : data.error,
                    })
                }
                else{
                    callback({
                        type: `${name}_RECEIVED`,
                        data : data,
                    })
                }
            });
    }
}


export const getApiRequest = function(action){
    var req = null;

    switch (action.type) {

        case 'SEARCH_MANAGER': 
             var url = '/api/managers/search/'
             req = createGetApiRequest(url, 'SEARCH_MANAGER', action.options)
             break

        case 'GET_MANAGER':
            var url = '/api/managers/' + action.id + '/'
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            req = createGetApiRequest(url, 'GET_MANAGER', action.options)
            break

        case 'GET_MANAGER_LISTS':
            var url = '/api/managers/lists/'
            req = createGetApiRequest(url, 'GET_MANAGER_LISTS', action.options)
            break

        case 'GET_MANAGER_RETURNS':
            var url = '/api/managers/returns/' + action.id + '/'
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            req = createGetApiRequest(url, 'GET_MANAGER_RETURNS', action.options)
            break

        case 'GET_DATABASES':
            var url = '/api/db/databases/'
            req = createGetApiRequest(url, 'GET_DATABASES', action.options)
            break

        case 'GET_QUERIES':
            var url = '/api/db/query/'
            req = createGetApiRequest(url, 'GET_QUERIES', action.options)
            break

        case 'GET_QUERY':
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            var url = '/api/db/query/' + action.id + '/'
            req = createGetApiRequest(url, 'GET_QUERY', action.options)
            break

        case 'RUN_QUERY':
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            var url = '/api/db/query/' + action.id + '/run/'
            req = createGetApiRequest(url, 'RUN_QUERY', action.options)
            break

        case 'GET_MANAGER_LISTS':
            var url = '/api/managers/lists/'
            req = createGetApiRequest(url, 'GET_MANAGER_LISTS', action.options)
            break

        case 'GET_MANAGER_LIST':
            var url = '/api/managers/lists/' + action.id + '/'
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            req = createGetApiRequest(url, 'GET_MANAGER_LIST', action.options)
            break

        case 'GET_MANAGER_BETAS':
            var url = '/api/managers/betas/' + action.id + '/'
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            req = createGetApiRequest(url, 'GET_MANAGER_BETAS', action.options)
            break

        case 'GET_MANAGER_EXPOSURE':
            var url = '/api/managers/exposures/' + action.id + '/'
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            if(!action.options.date){
                throw new Error('Must Provide Date')
            }
            req = createGetApiRequest(url, 'GET_MANAGER_EXPOSURE', action.options)
            break

        case 'GET_MANAGER_EXPOSURES':
            var url = '/api/managers/exposures/' + action.id + '/'
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            req = createGetApiRequest(url, 'GET_MANAGER_EXPOSURES', action.options)
            break

        case 'GET_MANAGER_CATEGORY_EXPOSURE':
            var url = '/api/managers/categories/' + action.id + '/'
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            if(!action.options.date){
                throw new Error('Must Provide Date')
            }
            req = createGetApiRequest(url, 'GET_MANAGER_CATEGORY_EXPOSURE', action.options)
            break

        case 'GET_MANAGER_CATEGORY_EXPOSURES':
            var url = '/api/managers/categories/' + action.id + '/'
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            req = createGetApiRequest(url, 'GET_MANAGER_CATEGORY_EXPOSURES', action.options)
            break

        default:
            break;
    }
    return req;
}
