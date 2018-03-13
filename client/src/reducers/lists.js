import _ from 'underscore'
import { Manager } from './managers'
import { ManagerListTypes } from '../actions'

// Doesnt Serve Much Purpose Now but May in Future
export class ManagerList {
	constructor(data){
		this.id = data.id 
		this.name = data.name 
		this.managers = data.managers.map(function(manager){
			return new Manager(manager)
		}) 
		this.createdAt = new Date(data.createdAt)
		this.user_id = data.user_id
	}
}

export function list(state = null, action) {
  	switch(action.type){
		case ManagerListTypes.LOAD_MANAGER_LIST_SUCCESS:
			var newlist = new ManagerList(action.list)
            return newlist;

        // Add Manager to List if Selected When List Active
        case ManagerListTypes.SELECT_MANAGER_SUCCESS:
        	if(state){
        		var manager = new Manager(action.selected)
	            var exists = _.findWhere(state, { 'id': manager.id })
	            if (!exists){
	            	state.managers.push(manager)
	            }
        	}
            return state;

        default:
            return state;
	}
}

export function lists(state = [], action) {
  	switch(action.type){
		case ManagerListTypes.LOAD_MANAGER_LISTS_SUCCESS:
			return action.lists

		case ManagerListTypes.CLEAR_MANAGER_LISTS:
			return []

		case ManagerListTypes.ADD_MANAGER_LIST:
			console.log('in manger list reducer')
			var list = action.list 
        	list = new ManagerList(list)
			return [...state, action.list]

        case ManagerListTypes.SAVE_MANAGER_LIST_SUCCESS:
        	console.log('adding new list')
        	var list = action.list 
        	list = new ManagerList(list)
        	return [...state, list]

        default:
            return state;
	}
}
