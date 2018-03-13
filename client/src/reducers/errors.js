import ManagerListTypes from '../actions'
import _ from 'underscore'

class Error{
    constructor(message, type){

    }
}
export function errors(state = [], action) {
  	switch(action.type){
		case ManagerListTypes.SAVE_MANAGER_LIST_ERROR:
            var error = new Error(action.error, ManagerListTypesManagerListTypes.SAVE_MANAGER_LIST_ERROR)
            return [... state, error] 
        default:
            return state;
	}
}
