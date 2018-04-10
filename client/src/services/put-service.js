import request from 'superagent'
import Cookies from 'js-cookie';

require('superagent-csrf')(request);

export const putApiRequestAction = next => (name) => {
    next({
        type: `${name}_REQUEST`, 
    })
}

export const putApiGenerator = next => (route, name, send = {}) => request
	.put(route)
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
		const data = JSON.parse(response.text)
		if(data.error){
			return next({
				type: `${name}_ERROR`,
				error : data.error,
			})
		}
		else{
			next({
				type: `${name}_SUCCESS`,
				data : data,
			})
		}
	})

const putService = store => next => action => {
	next(action)
	const putApi = putApiGenerator(next)
	const requestAction = putApiRequestAction(next)

	switch (action.type) {
		case 'SAVE_MANAGER_LIST':
        	var url = '/api/managers/lists/' + action.id + '/'
        	if(!action.id){
        		throw new Error('Must Provide ID')
        	}
        	requestAction('SAVE_MANAGER_LIST')
            putApi(url, 'SAVE_MANAGER_LIST', action.data)
            break

        case 'SAVE_QUERY':
        	var url = '/api/db/query/' + action.id + '/'
        	if(!action.id){
        		throw new Error('Must Provide ID')
        	}
        	requestAction('SAVE_QUERY')
        	console.log(action.data)
            putApi(url, 'SAVE_QUERY', action.data)
            break

		default:
            break
	}
}

export default putService;