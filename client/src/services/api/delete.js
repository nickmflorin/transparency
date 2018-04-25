import request from 'superagent';
import Cookies from 'js-cookie';
require('superagent-csrf')(request);

export const createDeleteApiRequest = function(route, id, name, send){
    return function(callback){
        return request.delete(route)
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
                // Response Text is "", Code = 204 if Successful Delete
                if(response.statusCode == 204){
                    callback({
                        type: `${name}_SUCCESS`,
                        id : id,
                    })
                }
                else{
                    const data = JSON.parse(response.text)
                    if(data.error){
                        return callback({
                            type: `${name}_ERROR`,
                            error : data.error,
                        })
                    }
                    else{
                        throw new Error('Response Returned Invalid Status Code with No Error Reported')
                    }
                }
            })
    }
}

export const deleteApiRequest = function(action){
    var req = null;

    switch (action.type) {
        case 'REMOVE_QUERY':
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            var url = '/api/db/query/' + String(action.id) + '/'
            req = createDeleteApiRequest(url, action.id, 'REMOVE_QUERY', action.data)
            break;

        case 'REMOVE_MANAGER_LIST':
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            var url = '/api/managers/lists/' + String(action.id) + '/'
            req = createDeleteApiRequest(url, action.id, 'REMOVE_MANAGER_LIST', action.data)
            break;
            
        default:
            break
    }
    return req;
}
