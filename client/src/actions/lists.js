import moment from 'moment'
import _ from 'underscore'

// To Do: Do We Want to Intermittently Save Manager List with API Each Time Manager Added
// (i.e. Add Manager in Backend of API to Maintain State?)
export const createTempManagerList = function() {
    return function(dispatch, getState) {
        const state = getState()
        if(!state.auth.user){
            throw new Error('User Must Exist to Create New Query')
        }
        dispatch({
            type : 'CREATE_TEMP_MANAGER_LIST',
            user : state.auth.user,
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
    return function(dispatch, getState) {
        dispatch({
            type : 'GET_MANAGER_LIST',
            id : id,
        })
        const list = getState().lists.list 
        if(list && list.managers){
            for(var i = 0; i<list.managers.length; i++){
                var manager = list.managers[i]

                dispatch({
                    type : 'GET_MANAGER_RETURNS',
                    id : manager.id,
                    options : {
                        start_date : options.start_date,
                        end_date : options.end_date
                    }
                })
            }
        }   
    };
}

export const clearManagerList = function() {
    return function(dispatch) {
        dispatch({
            type : 'CLEAR_MANAGER_LIST'
        })
    };
}

export const removeManagerFromList = function(id){
    return function(dispatch) {
        dispatch({
            type : 'REMOVE_MANAGER_FROM_LIST',
            id : id,
        })
    };
}

// List Parameter Not Required => Uses Opened or Active List
// Dates Passed In for Returns Request
export const addManagerToList = function(manager, options = { start_date : null, end_date : null }) {
    return function(dispatch, getState) {

        dispatch({
            type : 'GET_MANAGER_RETURNS',
            id : manager.id,
            options : {
                start_date : options.start_date,
                end_date : options.end_date
            }
        })
  
        dispatch({
            type : 'ADD_MANAGER_TO_LIST',
            data : manager,
        })  
    };
}

export const saveNewManagerList = function(name){
    return function(dispatch, getState) {

        const state = getState()
        if(!state.lists.list){
            throw new Error('List Missing from State')
        }
        const list = state.lists.list
        if(!list.managers || list.managers.length == 0){
            throw new Error('Cannot Save Empty List')
        }
        if(!name || name.trim() == ""){
            throw new Error('Must Provide Valid Name')
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

export const saveManagerList = function() {
    return function(dispatch, getState) {
        const state = getState()
        if(!state.lists.list){
            throw new Error('List Missing from State')
        }
        const list = state.lists.list
        if(!list.managers || list.managers.length == 0){
            throw new Error('Cannot Clear Previously Non Empty Manager List')
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