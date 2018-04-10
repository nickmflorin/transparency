import request from 'superagent'

export const getApiRequestAction = next => (name) => {
    next({
        type: `${name}_REQUEST`, 
    })
}

export const getApiGenerator = next => (route, name, options = {}) => request
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
                error : data.error,
            })
        }
        else{
            next({
                type: `${name}_RECEIVED`,
                data : data,
            })
        }
	})


export const dataService = store => next => action => {
    next(action)
    const getApi = getApiGenerator(next)
    const requestAction = getApiRequestAction(next)

    switch (action.type) {
        case 'GET_MANAGER_LISTS':
            requestAction('GET_MANAGER_LISTS')

        	var url = '/api/managers/lists/'
            requestAction(url, 'GET_MANAGER_LISTS')
            getApi(url, 'GET_MANAGER_LISTS')
            break

        case 'GET_DATABASES':
            var url = '/api/db/databases/'
            requestAction(url, 'GET_DATABASES')
            getApi(url, 'GET_DATABASES')
            break

        case 'GET_QUERIES':
            var url = '/api/db/query/'
            requestAction(url, 'GET_QUERIES')
            getApi(url, 'GET_QUERIES')
            break

        case 'GET_QUERY':
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            var url = '/api/db/query/' + action.id + '/'
            requestAction(url, 'GET_QUERY')
            getApi(url, 'GET_QUERY')
            break

        case 'RUN_QUERY':
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            var url = '/api/db/query/' + action.id + '/run/'

            requestAction(url, 'RUN_QUERY')
            getApi(url, 'RUN_QUERY', action.data)
            break

        case 'GET_MANAGER_LIST':
        	var url = '/api/managers/lists/' + action.id + '/'
        	if(!action.id){
        		throw new Error('Must Provide ID')
        	}
            requestAction(url, 'GET_MANAGER_LIST')
            getApi(url, 'GET_MANAGER_LIST')
            break

        case 'GET_MANAGER':
            var url = '/api/managers/' + action.id + '/'
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            requestAction(url, 'GET_MANAGER')
            getApi(url, 'GET_MANAGER', action.options)
            break

        case 'SEARCH_MANAGER': 
             var url = '/api/managers/search/'
             requestAction(url, 'SEARCH_MANAGER')
             getApi(url, 'SEARCH_MANAGER', action.options)
             break

        case 'GET_MANAGER_RETURNS':
        	var url = '/api/managers/returns/' + action.id + '/'
        	if(!action.id){
        		throw new Error('Must Provide ID')
        	}
            requestAction(url, 'GET_MANAGER_RETURNS')
            getApi(url, 'GET_MANAGER_RETURNS', action.options)
            break

        case 'GET_MANAGER_BETAS':
            var url = '/api/managers/betas/' + action.id + '/'
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            requestAction(url, 'GET_MANAGER_BETAS')
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
            requestAction(url, 'GET_MANAGER_EXPOSURE')
            getApi(url, 'GET_MANAGER_EXPOSURE', action.options)
            break

        case 'GET_MANAGER_EXPOSURES':
            var url = '/api/managers/exposures/' + action.id + '/'
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            requestAction(url, 'GET_MANAGER_EXPOSURES')
            getApi(url, 'GET_MANAGER_EXPOSURES', action.options)
            break

        case 'GET_MANAGER_CATEGORY_EXPOSURE':
            var url = '/api/managers/categories/' + action.id + '/'
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            if(!action.options.date){
                throw new Error('Must Provide Date')
            }
            requestAction(url, 'GET_MANAGER_CATEGORY_EXPOSURE')
            getApi(url, 'GET_MANAGER_CATEGORY_EXPOSURE', action.options)
            break

        case 'GET_MANAGER_CATEGORY_EXPOSURES':
            var url = '/api/managers/categories/' + action.id + '/'
            if(!action.id){
                throw new Error('Must Provide ID')
            }
            requestAction(url, 'GET_MANAGER_CATEGORY_EXPOSURES')
            getApi(url, 'GET_MANAGER_CATEGORY_EXPOSURES', action.options)
            break

        default:
            break
    }
};

export default dataService
