import {HttpTypes} from '../actions'

export function requesting(state = false, action) {
	switch(action.type){
	    case HttpTypes.HTTP_REQUEST:
	        return action.requesting;
	    default:
	        return state;
	}
}
