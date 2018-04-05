import request from 'superagent'
import Cookies from 'js-cookie';

require('superagent-csrf')(request);

const postApiGenerator = next => (route, name, send = {}) => request
	.post(route)
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
				error : error,
			})
		}
		else{
			next({
				type: `${name}_SUCCESS`,
				data : data,
			})
		}
	})


const saveService = store => next => action => {
	next(action)
	const postApi = postApiGenerator(next)

	switch (action.type) {
		case 'SAVE_NEW_MANAGER_LIST':
        	var url = '/api/managers/lists/'
        	postApi(url, 'SAVE_NEW_MANAGER_LIST', action.data)

		default:
            break
	}
}

export default saveService;