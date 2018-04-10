import moment from 'moment'

const default_dates = function(){
	var dates = {}

	var end = new moment()
	var start = new moment().subtract(60, 'months')

	dates['start'] = { month : start.month(), year : start.year() }
	dates['end'] = { month : end.month(), year : end.year() }
	dates['date'] = { month : end.month(), year : end.year() }

	return dates 
}

var initialState = default_dates()

export function dates(state = initialState, action) {
	switch(action.type){
	    case 'CHANGE_DATE_SUCCESS':
	    	return {
	    		start : action.changes.start || state.start,
	    		end : action.changes.end || state.end,
	    		date : action.changes.date || state.date,
	    	}
	    default:
	        return state;
	}
}

export function requesting(state = false, action) {
	switch(action.type){
		case 'LOGIN':
			return true
		case 'LOGIN_SUCCESS':
			return false
		case 'LOGIN_ERROR':
			return false

		case 'RUN_QUERY':
			return true
		case 'RUN_QUERY_RECEIVED':
			return false
		case 'RUN_QUERY_ERROR':
			return false

		case 'GET_QUERY':
			return true
		case 'GET_QUERY_RECEIVED':
			return false
		case 'GET_QUERY_ERROR':
			return false

		case 'GET_QUERIES':
			return true
		case 'GET_QUERIES_RECEIVED':
			return false
		case 'GET_QUERIES_ERROR':
			return false

		case 'GET_DATABASES':
			return true
		case 'GET_DATABASES_RECEIVED':
			return false
		case 'GET_DATABASES_ERROR':
			return false

		case 'LOGOUT':
			return true
		case 'LOGOUT_RECEIVED':
			return false
		case 'LOGOUT_ERROR':
			return false

		case 'GET_MANAGER_LISTS':
			return true
		case 'GET_MANAGER_LISTS_RECEIVED':
			return false
		case 'GET_MANAGER_LISTS_ERROR':
			return false

		case 'GET_MANAGER':
			return true
		case 'GET_MANAGER_RECEIVED':
			return false
		case 'GET_MANAGER_ERROR':
			return false

		case 'GET_MANAGER_EXPOSURE':
			return true 
		case 'GET_MANAGER_EXPOSURE_RECEIVED':
			return false
		case 'GET_MANAGER_EXPOSURE_ERROR':
			return false

		case 'GET_MANAGER_EXPOSURES':
			return true 
		case 'GET_MANAGER_EXPOSURES_RECEIVED':
			return false
		case 'GET_MANAGER_EXPOSURES_ERROR':
			return false

		case 'GET_MANAGER_CATEGORY_EXPOSURE':
			return true 
		case 'GET_MANAGER_CATEGORY_EXPOSURE_RECEIVED':
			return false
		case 'GET_MANAGER_CATEGORY_EXPOSURE_ERROR':
			return false

		case 'GET_MANAGER_CATEGORY_EXPOSURES':
			return true 
		case 'GET_MANAGER_CATEGORY_EXPOSURES_RECEIVED':
			return false
		case 'GET_MANAGER_CATEGORY_EXPOSURES_ERROR':
			return false

		case 'GET_MANAGER_BETAS':
			return true 
		case 'GET_MANAGER_BETAS_RECEIVED':
			return false
		case 'GET_MANAGER_BETAS_ERROR':
			return false

		case 'GET_MANAGER_LIST':
			return true
		case 'GET_MANAGER_LIST_RECEIVED':
			return false
		case 'GET_MANAGER_LIST_ERROR':
			return false

		case 'GET_MANAGER_RETURNS':
			return true
		case 'GET_MANAGER_RETURNS_RECEIVED':
			return false
		case 'GET_MANAGER_RETURNS_ERROR':
			return false

		case 'SAVE_MANAGER_LIST':
			return true
		case 'SAVE_MANAGER_LIST_SUCCESS':
			return false 
		case 'SAVE_MANAGER_LIST_ERROR':
			return false 

		case 'SAVE_NEW_MANAGER_LIST':
			return true
		case 'SAVE_NEW_MANAGER_LIST_SUCCESS':
			return false 
		case 'SAVE_NEW_MANAGER_LIST_ERROR':
			return false 

	    default:
	        return state;
	}
}

export function sidebarShowing(state = true, action) {
	switch(action.type){
	    case 'TOGGLE_MANAGER_SIDEBAR_SUCCESS':
	        return !state
	    default:
	        return state;
	}
}
