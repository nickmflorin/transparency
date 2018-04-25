import request from 'superagent';
import Cookies from 'js-cookie';
require('superagent-csrf')(request);

export const createPostApiRequest = function(route, name, send){
    return function(callback){
        return request.post(route)
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
                })
    }
}

export const postApiRequest = function(action){
    var req = null;
    switch (action.type) {

        case 'SAVE_NEW_MANAGER_LIST':
            var url = '/api/managers/lists/'
            req = createPostApiRequest(url, 'SAVE_NEW_MANAGER_LIST', action.data)
            break;

        case 'SAVE_NEW_QUERY':
            var url = '/api/db/query/'
            req = createPostApiRequest(url, 'SAVE_NEW_QUERY', action.data)
            break;
            
        default:
            break
    }

    return req;
}
