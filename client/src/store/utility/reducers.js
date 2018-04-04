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
	    case Types.http.request:
	        return action.requesting;
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
