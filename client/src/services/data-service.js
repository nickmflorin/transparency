import request from 'superagent'

const getApiGenerator = next => (route, name, options = {}) => request
	.get(route)
	.query(options)
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
                type: `${name}_RECEIVED`,
                data : data,
            })
        }
	})


const dataService = store => next => action => {
    next(action)
    const getApi = getApiGenerator(next)

    switch (action.type) {
        case 'GET_MANAGER_LISTS':
        	var url = '/api/managers/lists/'
            getApi(url, 'GET_MANAGER_LISTS')
            break

        case 'GET_MANAGER_LIST':
        	var url = '/api/managers/lists/' + action.id + '/'
        	if(!action.id){
        		throw new Error('Must Provide ID')
        	}
            getApi(url, 'GET_MANAGER_LIST')
            break

        case 'GET_MANAGER':
            var url = '/api/managers/' + action.id + '/'
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            getApi(url, 'GET_MANAGER', action.options)
            break

        case 'SEARCH_MANAGER': 
             var url = '/api/managers/search/'
             getApi(url, 'SEARCH_MANAGER', action.options)
             break

        case 'GET_MANAGER_RETURNS':
        	var url = '/api/managers/returns/' + action.id + '/'
        	if(!action.id){
        		throw new Error('Must Provide ID')
        	}
            getApi(url, 'GET_MANAGER_RETURNS', action.options)
            break

        case 'GET_MANAGER_BETAS':
            var url = '/api/managers/betas/' + action.id + '/'
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            getApi(url, 'GET_MANAGER_BETAS', action.options)
            break

        case 'GET_MANAGER_EXPOSURE':
            var url = '/api/managers/exposures/' + action.id + '/'
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            if(!action.options.date){
                throw new Error('Must Provide Date')
            }
            getApi(url, 'GET_MANAGER_EXPOSURE', action.options)
            break

        case 'GET_MANAGER_EXPOSURES':
            var url = '/api/managers/exposures/' + action.id + '/'
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            getApi(url, 'GET_MANAGER_EXPOSURES', action.options)
            break

        case 'GET_MANAGER_CATEGORIES':
            var url = '/api/managers/categories/' + action.id + '/'
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            getApi(url, 'GET_MANAGER_CATEGORIES', action.options)
            break

        default:
            break
    }
};

export default dataService
