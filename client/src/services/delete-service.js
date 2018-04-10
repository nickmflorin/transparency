import request from 'superagent'
import Cookies from 'js-cookie';

require('superagent-csrf')(request);

export const deleteApiRequestAction = next => (name) => {
    next({
        type: `${name}_REQUEST`, 
    })
}

export const deleteApiGenerator = next => (route, id, name, send = {}) => request
	.delete(route)
	.send(send)
	.set('X-CSRFToken', Cookies.get('csrftoken'))
	.csrf(Cookies.get('csrftoken'))
	.end((error, response) => {

		if (error) {
			return next({
				type: `${name}_ERROR`,
				error : error,
			})
		}
		// Response Text is "", Code = 204 if Successful Delete
		if(response.statusCode == 204){
			next({
				type: `${name}_SUCCESS`,
				id : id,
			})
		}
		else{
			const data = JSON.parse(response.text)
			if(data.error){
				return next({
					type: `${name}_ERROR`,
					error : data.error,
				})
			}
			else{
				throw new Error('Response Returned Invalid Status Code with No Error Reported')
			}
		}
	})

export const deleteService = store => next => action => {
	next(action)
	const deleteApi = deleteApiGenerator(next)
	const requestAction = deleteApiRequestAction(next)

	switch (action.type) {
        case 'REMOVE_QUERY':
        	if(!action.id){
        		throw new Error('Must Provide ID')
        	}

        	var url = '/api/db/query/' + String(action.id) + '/'
        	requestAction('REMOVE_QUERY')
        	deleteApi(url, action.id, 'REMOVE_QUERY', action.data)

		default:
            break
	}
}

export default deleteService;