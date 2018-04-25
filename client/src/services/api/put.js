import request from 'superagent';
import Cookies from 'js-cookie';
import { dispatchRequest } from './request'
require('superagent-csrf')(request);

export const createPutApiRequest = function(route, name, send){
    return (callback) => request
        .put(route)
        .send(send)
        .set('X-CSRFToken', Cookies.get('csrftoken'))
        .csrf(Cookies.get('csrftoken'))
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
                    type: `${name}_SUCCESS`,
                    data : data,
                })
            }
        });

}

export const putApiRequest = function(action){
    var req = null;

    switch (action.type) {
        case 'SAVE_MANAGER_LIST':
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            var url = '/api/managers/lists/' + action.id + '/'
            req = createPutApiRequest(url, 'SAVE_MANAGER_LIST', action.data)
            break;

        case 'SAVE_QUERY':
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            var url = '/api/db/query/' + action.id + '/'
            req = createPutApiRequest(url, 'SAVE_QUERY', action.data)
            break;

        default:
            break
    }

    return req;
}
