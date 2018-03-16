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
        this.exposures = manager.exposures || [] 

		this.peer = peer;
		this.benchmark = benchmark;
		this.selected = selected;
        this.group = manager.group;
	}
}

function manager(state = null, action) {
    switch (action.type) {
        case ManagerTypes.SELECT_MANAGER:
            var manager = new Manager(action.selected)
            return manager

        case ManagerTypes.GET_MANAGER_EXPOSURES:
            return new Manager({...state, exposures: action.exposures })

        default:
            return state 
    }
}

// Keep Temporarily for Now but We Currently Are Updating Manager Object with Exposures Instead of Treating Exposures Separately
function exposures(state = [], action){
    switch (action.type) {
        case ManagerTypes.GET_MANAGER_EXPOSURES:
            return [...state, action.exposures];
        default:
            return state;
    }
};

function managers(state = [], action) {
    switch (action.type) {
        // Manager Set Should be Managers in List When List Loaded
        case ManagerListTypes.LOAD_MANAGER_LIST:
            return action.list.managers.map(function(manager){
                return new Manager(manager)
            })
        case ManagerTypes.ADD_MANAGER:
        	var manager = new Manager(action.added, false, false, true)

        	var exists = _.findWhere(state, { 'id': manager.id })
            if (exists){
                throw new Error('Manager Already Exists')
            }
            
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

        case ManagerTypes.GET_MANAGER_EXPOSURES:
            if(action.exposures.length != 0){
                var managerId = action.exposures[0].id
                const exposureIndex = state.findIndex(manager => manager.id === managerId)
                return [
                   ...state.slice(0, exposureIndex), // Everything Before Current Manager
                   {
                      ...state[exposureIndex],
                      exposures: action.exposures,
                   },
                   ...state.slice(exposureIndex + 1), // Everything After Current Manager
                ]
            }
            return state 
            
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

function search(state = [], action) {
    switch (action.type) {
        case ManagerTypes.SEARCH_MANAGER:
            return action.results;
        default:
            return state;
    }
}

function searches(state = [], action) {
    switch (action.type) {
        case ManagerTypes.SELECT_MANAGER:
            const exists = _.findWhere(state, { id : action.selected.id })
            if(!exists){
                return [...state, action.selected]
            }
            return state
        default:
            return state;
    }
}

export const mgrs = combineReducers({  
    search: search,
    searches : searches,
    managers: managers,
    manager: manager,
    exposures : exposures,
});
