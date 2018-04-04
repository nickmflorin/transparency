import update from 'react-addons-update';
import _ from 'underscore'

import { Types } from './handler'
import { ManagerList } from './models'
import { Manager } from '../manager/models'

export function list(state = null, action) {
    switch(action.type){
        case Types.list.temp.success:
            return action.list;

        // To Make Faster, Keep Managers from Presaved List and Just Update All Other Components
        case Types.list.new.success:
            if(!state) throw new Error('List Must Exist in Store')
            return {
                ...state,
                id : action.list.id,
                name : action.list.name,
                user : action.list.user,
                isNew : false,
                createdAt : action.list.createdAt,
            }
            return action.list;

        case Types.list.manager.remove.success:
            if(!state) throw new Error('List Must Exist in Store')

            var manager = _.findWhere(state.managers, { id : action.id })
            if(!manager) throw new Error('Cannot Remove Manager Already Missing from List')
            
            const index = state.managers.findIndex(mgr => mgr.id === action.id)
            return {
                ...state, 
                managers: [
                    ...state.managers.slice(0, index),
                    ...state.managers.slice(index + 1),
                ]
            }
            
        case Types.list.manager.add.success:
            if(!state) throw new Error('List Must Exist in Store')
      
            const exists = _.findWhere(state.managers, { id : action.manager.id })
            if(!exists){
                const manager = new Manager(action.manager)
                if(action.returns){
                    manager.returns = action.returns
                }
                return {
                    ...state, 
                    managers: [...state.managers, manager]
                }
            }
            return state;

        case Types.list.clear.success:
            if(state){
                return {
                    ...state, 
                    managers: []
                }
            }
            return state 

        case Types.list.returns.get.success:
            if(!state) throw new Error('List Must Exist in Store')

            const manager = _.findWhere(state.managers, { id : action.returns.id })
            if(manager){
                const index = state.managers.findIndex(mgr => mgr.id === action.returns.id)
                return {
                    ...state, 
                    managers: [
                        ...state.managers.slice(0, index),
                        {
                            ...manager,
                            returns : action.returns
                        },
                        ...state.managers.slice(index + 1),
                    ]
                };
            };
            return state;

        case Types.list.get.success:
            var newlist = new ManagerList(action.list)
            if(action.returns){
                newlist.set_returns(action.returns)
            }
            return newlist;

        default:
            return state;
    }
}

// Dont Want to Mutate Any Lists in All State => Only Want to Mutate Open List and Allow Them to Save
export function lists(state = [], action) {
    switch(action.type){
        case Types.lists.get.success:
            return action.lists

        case Types.list.new.success:
            var list = action.list 
            list = new ManagerList(list)
            return [...state, list]

        default:
            return state;
    }
}


