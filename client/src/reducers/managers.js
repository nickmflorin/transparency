import { ManagerTypes, ManagerListTypes } from '../actions'

import { combineReducers } from 'redux';
import update from 'react-addons-update';
import _ from 'underscore'
import store from './index'

export class Manager {
	constructor(manager, peer = false, benchmark = false, selected = false){
		this.id = manager.id 
		this.name = manager.name 

		this.peers = manager.peers
		this.benchmarks = manager.benchmarks

		this.strategy = manager.strategy
		this.substrategy = manager.substrategy
		this.returns = manager.returns 

		this.peer = peer;
		this.benchmark = benchmark;
		this.selected = selected;
	}
}

export function managers(state = [], action) {
    switch (action.type) {
        case ManagerTypes.LOAD_MANAGER_SUCCESS:
        	var manager = new Manager(action.manager)

            var exists = _.findWhere(state, { 'id': manager.id })
            if (exists) throw new Error('Manager Already Exists')
            
            state.push(manager)
            return state;

        // Manager Set Should be Managers in List When List Loaded
        case ManagerListTypes.LOAD_MANAGER_LIST_SUCCESS:
            return action.list.managers.map(function(manager){
                return new Manager(manager)
            })
  
        case ManagerTypes.SELECT_MANAGER_SUCCESS:
        	var manager = new Manager(action.selected, false, false, true)

        	var exists = _.findWhere(state, { 'id': manager.id })
            if (exists) throw new Error('Manager Already Exists')
            
            var selected = _.findWhere(state, { selected : true })
            if(selected){
            	selected.selected = false;
            }
        	return [ ...state, manager ]

        // Use Spread Operator to Update Object in Array for Immutability
        case ManagerTypes.UPDATE_MANAGER_RETURNS:
            const index = state.findIndex(manager => manager.id === action.id)
            return [
               ...state.slice(0, index), // Everything Before Current Manager
               {
                  ...state[index],
                  returns: action.returns,
               },
               ...state.slice(index + 1), // Everything After Current Manager
            ]

        case ManagerTypes.CLEAR_MANAGERS:
        	return []

        // To Do: Might Have to Test if Manager is Selected and Select Another Manager in That Case
        case ManagerTypes.REMOVE_MANAGER:
            const prunedManagers = state.filter(manager => {
                return manager.id !== action.id
            })
            return prunedManagers;
        default:
            return state;
    }
}

export function search(state = [], action) {
    switch (action.type) {
        case ManagerTypes.SEARCH_MANAGER_SUCCESS:
            return action.results;
        default:
            return state;
    }
}