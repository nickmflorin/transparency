import { store } from '../../store'

export const Types = {
	http : {
        request : 'HTTP_REQUEST',
    },
    dates : {
        change : 'CHANGE_DATE',
    },
    sidebar : {
        toggle : 'TOGGLE_MANAGER_SIDEBAR',
    }
}

export function toggleSidebar() {
    return { type: Types.sidebar.toggle };
}
export function HttpRequest(requesting) {
    return { type: Types.http.request, requesting };
}

export function StartRequest(){
	store.dispatch(HttpRequest(true))
}

export function StopRequest(){
	store.dispatch(HttpRequest(false))
}

export function changeDate(dates = { date : null, start : null, end : null }) {
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
    return { type: Types.dates.change , changes };
}

