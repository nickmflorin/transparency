import moment from 'moment'
import { Types } from './actions'

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
	    case Types.dates.change:
	    	return {
	    		start : action.changes.start || state.start,
	    		end : action.changes.end || state.end,
	    		date : action.changes.date || state.date,
	    	}
	    default:
	        return state;
	}
}

export function requesting(state = true, action) {
	switch(action.type){
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

		case 'GET_MANAGER_CATEGORIES':
			return true 
		case 'GET_MANAGER_CATEGORIES_RECEIVED':
			return false
		case 'GET_MANAGER_CATEGORIES_ERROR':
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
	    case Types.sidebar.toggle:
	        return !state
	    default:
	        return state;
	}
}
