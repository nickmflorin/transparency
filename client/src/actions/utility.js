export function toggleSidebar() {
    return { type: 'TOGGLE_MANAGER_SIDEBAR_SUCCESS' };
}
export function HttpRequest(requesting) {
    return { type: 'HTTP_REQUEST', requesting };
}

export function StartRequest(){
	return function(dispatch, getState){
		dispatch(HttpRequest(false))
	}
}

export function StopRequest(){
	return function(dispatch, getState){
		dispatch(HttpRequest(true))
	}
}

export function changeDate(dates = { date : null, start : null, end : null }) {
	console.log('changing date')
	var changes = {}
	if(dates.date){
		changes['date'] = dates.date
	}
	if(dates.start){
		changes['start'] = dates.start
	}
	if(dates.end){
		changes['end'] = dates.end
	}
    return { type: 'CHANGE_DATE_SUCCESS' , changes };
}

