import update from 'react-addons-update';
import { combineReducers } from 'redux';
import _ from 'underscore'

import { ManagerList, Manager } from './models'

export function list(state = null, action) {

    switch(action.type){
        // This Action Type is Referenced After Returns Received for All Managers in List
        case 'GET_MANAGER_LIST_RECEIVED_WITH_RETURNS':
            return action.data

        case 'CREATE_NEW_MANAGER_LIST_SUCCESS':
            return ManagerList.create_temp(action.user)

        case 'REMOVE_MANAGER_LIST_SUCCESS':
            if(!action.id){
                throw new Error('Delete Action Must Include ID')
            }
            if(state && action.id == state.id){
                return null;
            }
            return state;

        case 'ADD_MANAGER_TO_LIST_SUCCESS':
            if(!state) throw new Error('Cannot Add Managers to Missing List')
            
            var exists = _.findWhere(state.managers, { id : action.data.id })
            if(exists) throw new Error('Cannot Add Duplicate Managers to List')

            return {
                ...state, 
                managers: [
                    ...state.managers,
                    new Manager(action.data),
                ]
            }
        
        case 'CLEAR_MANAGER_LIST_SUCCESS':
            if(!state){
                throw new Error('Cannot Clear Missing List')
            }
            return {
                ...state, 
                managers: []
            }

        case 'SAVE_MANAGER_LIST_SUCCESS':
            return {
                ...state,
                isNew : false,
                updatedAt : action.data.updatedAt,
            }

        case 'SAVE_NEW_MANAGER_LIST_SUCCESS':
            return {
                ...state,
                id : action.data.id,
                name : action.data.name,
                user : action.data.user,
                isNew : false,
                createdAt : action.data.createdAt,
                updatedAt : action.data.updatedAt,
            }

        case 'REMOVE_MANAGER_FROM_LIST_SUCCESS':
            if(!state){
                throw new Error('Cannot Remove Manager from Missing List')
            }
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
            return state
            
        default:
            return state;
    }
}

// Dont Want to Mutate Any Lists in All State => Only Want to Mutate Open List and Allow Them to Save
export function lists(state = [], action) {
    switch(action.type){
        case 'GET_MANAGER_LISTS_RECEIVED':
            return action.data.map((datum) => {
                return new ManagerList(datum)
            })

        case 'REMOVE_MANAGER_LIST_SUCCESS':
            if(!action.id){
                throw new Error('Delete Action Must Include ID')
            }
            var exists = _.findWhere(state, { id : action.id })
            if(!exists){
                throw new Error('Deleted List Does Not Exist in Lists')
            }
            const index = state.findIndex(list => list.id === action.id)
            return [
                ...state.slice(0, index),
                ...state.slice(index + 1),
            ];

        default:
            return state;
    }
}

export const listsReducer = combineReducers({  
    list: list,
    lists : lists,
});

export default listsReducer;
