import moment from 'moment'
import _ from 'underscore'
import { getApiRequest, postApiRequest, putApiRequest, dispatchRequest } from '../services/api'
import { GetManagerPromise, GetManagerReturnsPromise } from './promises'

// To Do: Do We Want to Intermittently Save Manager List with API Each Time Manager Added
// (i.e. Add Manager in Backend of API to Maintain State?)

// Creates Initialized Empty Manager List for User if None Specified on Page Loads
export const createNewManagerList = function() {
    return function(dispatch, getState) {
        const state = getState()
        if(!state.auth.user){
            throw new Error('User Must Exist to Create New Query')
        }
        dispatch({
            type : 'CREATE_NEW_MANAGER_LIST_SUCCESS',
            user : state.auth.user,
        })
    };
}

export const removeManagerList = function(id){
    return function(dispatch) {
        dispatch({
            type : 'REMOVE_MANAGER_LIST',
            id : id,
        })
    };
}

export const getManagerLists = function(){
    return function(dispatch) {
        dispatch({
            type : 'GET_MANAGER_LISTS'
        })
    };
}

export const getManagerList = function(id, options = { complete : false, start_date : null, end_date : null }) {
    const listRequest = getApiRequest({
        type : 'GET_MANAGER_LIST',
        id : id,
    })

    return function(dispatch, getState) {
        dispatch({ type : 'GET_MANAGER_LIST_REQUEST' })

        // Manager List Includes Everything but Returns Are Complete Returns, Not Returns Over Correct Horizon with Stats
        listRequest(function(action){
            dispatch(action) // Notify That List was Retreived or Note Error in Reducer

            if(action.type == 'GET_MANAGER_LIST_RECEIVED'){
                var managers = action.data.managers 

                // Create Group of Promises to Get Returns for Each Manager in List
                var promises = []
                for(var i = 0; i<managers.length; i++){
                    var manager = managers[i]
                    promises.push(GetManagerReturnsPromise(
                        manager.id, 
                        {start_date : options.start_date, end_date : options.end_date },
                        dispatch,
                    ))
                }
                // Update Returns for Managers in List When Returns Received
                Promise.all(promises).then(function(actions){
                    _.each(actions, function(new_action){
                        var manager = _.findWhere(action.data.managers, { id : new_action.data.id })
                        if(manager){
                            manager.returns = new_action.data
                        }
                        else{
                            throw new Error('Retrieved Manager Returns for Extraneous Manager')
                        }
                    })
                    dispatch({
                        type : 'GET_MANAGER_LIST_RECEIVED_WITH_RETURNS',
                        data : action.data
                    })
                })
            }
            else{
                console.log('Error Retrieving Manager List')
                dispatch({
                    type : 'ERROR',
                    reference : 'GET_MANAGER_LIST',
                    error : action.error
                })
            }
        })
    }
}

// List Parameter Not Required => Uses Opened or Active List
// Dates Passed In for Returns Request
export const addManagerToList = function(id, options = { start_date : null, end_date : null }) {

    console.log('adding manager to list : ',id)
    return function(dispatch, getState) {
        // Clear Previous Errors
        dispatch({ type : 'CLEAR_ERRORS', reference : 'ADD_MANAGER_TO_LIST' })

        const list = getState().lists.list 
        if(!list){
            throw new Error('Cannot Add Manager to Missing List')
        }

        const exists = _.findWhere(list.managers, { id : id })
        if(exists){
            dispatch({
                type : 'ERROR',
                reference : 'ADD_MANAGER_TO_LIST',
                error : 'Manager already in list.'
            })
        }
        else{
            var promises = [
                GetManagerReturnsPromise(
                    id, 
                    {start_date : options.start_date, end_date : options.end_date },
                    dispatch,
                ),
                GetManagerPromise(id, dispatch)
            ]
            Promise.all(promises).then(function(actions){

                // Any Failures Will Cause One or Both of These Success Actions to Not Exist
                var returns_action = _.findWhere(actions, { type : "GET_MANAGER_RETURNS_RECEIVED" })
                var manager_action = _.findWhere(actions, { type : "GET_MANAGER_RECEIVED" })
                if(manager_action && returns_action){
                    var manager = manager_action.data 
                    manager.returns = returns_action.data 
                    dispatch({
                        type : 'ADD_MANAGER_TO_LIST_SUCCESS',
                        data : manager,
                    })
                }
                else{
                    dispatch({
                        type : 'ERROR',
                        reference : 'ADD_MANAGER_TO_LIST',
                        error : returns_action.error || manager_action.error,
                    })
                }
            })
        }
    };
}

export const saveNewManagerList_Async = function(name){
    return function(dispatch, getState) {
        return new Promise(function(resolve, reject) {
            const state = getState()
            if(!state.lists.list){
                throw new Error('List Missing from State')
            }
            
            const list = state.lists.list
            if(!list.managers || list.managers.length == 0){
                resolve({
                    type : 'ERROR',
                    reference : 'SAVE_NEW_MANAGER_LIST',
                    error : 'Cannot Save Empty List',
                })
            }

            if(!name || name.trim() == ""){
                resolve({
                    type : 'ERROR',
                    reference : 'SAVE_NEW_MANAGER_LIST',
                    error : 'Must Provide a Valid Name',
                })
            }
            var managers = _.pluck(list.managers, 'id')
            const saveRequest = postApiRequest({
                type : 'SAVE_NEW_MANAGER_LIST',
                data : {
                    name : name,
                    managers : managers,
                }
            })
            // Have to Dispatch Action Result as Well So Reducers Can Properly Handle
            saveRequest(function(action){
                dispatch(action)
                resolve(action)
            })
        })
    };
}

export const saveNewManagerList = function(name){
    return function(dispatch, getState) {
        const state = getState()
        if(!state.lists.list) throw new Error('List Missing from State')
        
        const list = state.lists.list
        if(!list.managers || list.managers.length == 0){
            dispatch({
                type : 'ERROR',
                reference : 'SAVE_NEW_MANAGER_LIST',
                error : 'Cannot Save Empty List',
            })
            return
        }

        if(!name || name.trim() == ""){
            dispatch({
                type : 'ERROR',
                reference : 'SAVE_NEW_MANAGER_LIST',
                error : 'Must Provide a Valid Name',
            })
            return
        }

        var managers = _.pluck(list.managers, 'id')
        dispatch({
            type : 'SAVE_NEW_MANAGER_LIST',
            data : {
                name : name,
                managers : managers,
            }
        })
    };
}

export const saveManagerList_Async = function() {
    return function(dispatch, getState) {
        return new Promise(function(resolve, reject) {
            const state = getState()
            if(!state.lists.list){
                throw new Error('List Missing from State')
            }
            
            const list = state.lists.list
            if(!list.managers || list.managers.length == 0){
                resolve({
                    type : 'ERROR',
                    reference : 'SAVE_MANAGER_LIST',
                    error : 'Cannot Save Empty List',
                })
            }

            var managers = _.pluck(list.managers, 'id')
            const saveRequest = putApiRequest({
                type : 'SAVE_MANAGER_LIST',
                id : list.id,
                data : {
                    managers : managers,
                }
            })
            // Have to Dispatch Action Result as Well So Reducers Can Properly Handle
            saveRequest(function(action){
                dispatch(action)
                resolve(action)
            })
        })
    };
}

export const saveManagerList = function() {
    return function(dispatch, getState) {
        const state = getState()
        if(!state.lists.list) throw new Error('List Missing from State')
        
        const list = state.lists.list
        if(!list.managers || list.managers.length == 0){
            dispatch({
                type : 'ERROR',
                reference : 'SAVE_MANAGER_LIST',
                error : 'Cannot Save Empty List',
            })
            return
        }

        var managers = _.pluck(list.managers, 'id')
        dispatch({
            type : 'SAVE_MANAGER_LIST',
            id : list.id,
            data : {
                managers : managers,
            }
        })
    };
}

export const clearManagerList = function() {
    return function(dispatch) {
        dispatch({
            type : 'CLEAR_MANAGER_LIST_SUCCESS'
        })
    };
}

export const removeManagerFromList = function(id){
    return function(dispatch) {
        dispatch({
            type : 'REMOVE_MANAGER_FROM_LIST_SUCCESS',
            id : id,
        })
    };
}


export const updateManagerListDates = function(dates = {start_date : null, end_date : null}){
    return function(dispatch, getState){
        if(!dates.start_date && !dates.end_date){
            throw new Error('Invalid Dates Provided')
        }
        const list = getState().lists.list 
        if(list && list.managers){
            for(var i = 0; i<list.managers.length; i++){
                var manager = list.managers[i]

                dispatch({
                    type : 'GET_MANAGER_RETURNS',
                    id : manager.id,
                    options : {
                        start_date : dates.start_date,
                        end_date : dates.end_date
                    }
                })
            }
        }   
    }
}