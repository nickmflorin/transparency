import update from 'react-addons-update';
import _ from 'underscore'

import { ManagerList } from './models'
import { Manager } from '../manager/models'

const default_errors = {
    'save' : null,
}

export function errors(state = default_errors, action){
    switch(action.type){
        default:
            return state;
    }
}

export function list(state = null, action) {
    switch(action.type){
        case 'GET_MANAGER_LIST_RECEIVED':
            return action.data

        case 'GET_MANAGER_RETURNS_RECEIVED':
            var manager = _.findWhere(state.managers, { id : action.data.id })
            if(manager){
                const index = state.managers.findIndex(mgr => mgr.id === action.data.id)
                return {
                    ...state, 
                    managers: [
                        ...state.managers.slice(0, index),
                        {
                            ...state.managers[index],
                            returns : action.data,
                        },
                        ...state.managers.slice(index + 1),
                    ]
                }
            }
            return state

        case 'ADD_MANAGER_TO_LIST':
            if(state){
                var exists = _.findWhere(state.managers, { id : action.data.id })
                if(!exists){
                    const index = state.managers.findIndex(mgr => mgr.id === action.data.id)
                    return {
                        ...state, 
                        managers: [
                            ...state.managers.slice(0, index),
                            action.data,
                            ...state.managers.slice(index + 1),
                        ]
                    }
                }
            }
            return state 

        case 'CLEAR_MANAGER_LIST':
            if(state){
                return {
                    ...state, 
                    managers: []
                }
            }
            return state 

        case 'CREATE_TEMP_MANAGER_LIST':
            return ManagerList.create_temp(action.user)

        case 'SAVE_NEW_MANAGER_LIST_SUCCESS':
            return {
                ...state,
                id : action.list.id,
                name : action.list.name,
                user : action.list.user,
                isNew : false,
                createdAt : action.list.createdAt,
            }

        case 'REMOVE_MANAGER_FROM_LIST':
            if(state){
                var manager = _.findWhere(state.managers, { id : action.id })
                if(manager){
                    const index = state.managers.findIndex(mgr => mgr.id === action.id)
                    return {
                        ...state, 
                        managers: [
                            ...state.managers.slice(0, index),
                            ...state.managers.slice(index + 1),
                        ]
                    }
                }
            }
            return state
            
        default:
            return state;
    }
}

// Dont Want to Mutate Any Lists in All State => Only Want to Mutate Open List and Allow Them to Save
export function lists(state = [], action) {
    switch(action.type){
        case 'GET_MANAGER_LISTS_RECEIVED':
            return action.data

        // case Types.list.new.success:
        //     var list = action.list 
        //     list = new ManagerList(list)
        //     return [...state, list]

        default:
            return state;
    }
}


