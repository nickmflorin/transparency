import moment from 'moment'
import _ from 'underscore'

import { store, Api } from '../../store'
import { HttpRequest, StartRequest, StopRequest } from '../utility'

import { ManagerList } from './models'
import { Handler, Types } from './handler'

// To Do: Do We Want to Intermittently Save Manager List with API Each Time Manager Added
// (i.e. Add Manager in Backend of API to Maintain State?)
export const createTempManagerList = function() {
    return function(dispatch, getState) {
        const state = getState()
        if(!state.auth.user){
            throw new Error('User Must Exist to Create New Query')
        }
        var TempList = ManagerList.create_temp(state.auth.user)
        return dispatch(Handler.List.Temp.Success(TempList));
    };
}

export const getManagerList = function(id, options = { complete : false, start_date : null, end_date : null }) {
    return function(dispatch) {
        StartRequest()

        return Api.lists.GetManagerList(id).then(response => {
            if(response.error){
                StopRequest()
                dispatch(Handler.List.Get.Error(response.error));
            }
            else{
                if(options.complete){
                    const list = response 
                    const managers = _.pluck(list.managers, 'id')

                    Api.manager.GetManagersReturns(managers, options).then(response => {
                        StopRequest()
                        if(response.error){
                            dispatch(Handler.List.Get.Error(response.error));
                        }
                        else{
                            dispatch(Handler.List.Get.Success(list, response));
                        }
                    })
                }
                else{
                    StopRequest()
                    dispatch(Handler.List.Get.Success(response));
                }
            }
        }).catch(error => {
            throw (error);
        });
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
        StartRequest()

        var managers = _.pluck(list.managers, 'id')
        return Api.lists.CreateManagerList(name, managers).then(response => {
            StopRequest()
            if(response.error){
                return dispatch(Handler.List.New.Error(response.error))
            }
            else{
                return dispatch(Handler.List.New.Success(response))
            }
        }).catch(error => {
            throw (error);
        });
    };
}

// Currently Not Allowing Updates to Name
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
        StartRequest()
        var managers = _.pluck(list.managers, 'id')
        return Api.lists.UpdateManagerList(list.id, managers).then(response => {
            StopRequest()
            if(response.error){
                return dispatch(Handler.List.Save.Error(response.error))
            }
            else{
                return dispatch(Handler.List.Save.Success(response))
            }
        }).catch(error => {
            throw (error);
        });
    };
}

export const updateManagerListDates = function(dates = {start_date : null, end_date : null}){
    if(!dates.start_date && !dates.end_date){
        throw new Error('Invalid Dates Provided')
    }

    return function(dispatch, getState) {
        const state = getState()
        
        if(state.lists.list){
            const list = state.lists.list 
            const managers = _.pluck(list.managers, 'id')
            if(managers.length != 0){
                StartRequest()
                Api.manager.GetManagersReturns(managers, dates).then(response => {
                    StopRequest()
                    if(response.error){
                        dispatch(Handler.List.Returns.Get.Error(response.error));
                    }
                    else{
                        const returns = response 
                        console.log(returns)
                        for(var i = 0; i<returns.length; i++){
                            dispatch(Handler.List.Returns.Get.Success(returns[i]));
                        }
                    }
                })
            }
        }
    }
}

export const removeManagerFromList = function(id){
    return function(dispatch) {
        dispatch(Handler.List.Manager.Remove.Success(id));
    };
}

export const clearManagerList = function() {
    return function(dispatch) {
        dispatch(Handler.List.Clear.Success());
    };
}

// List Parameter Not Required => Uses Opened or Active List
// Dates Passed In for Returns Request
export const addManagerToList = function(id, options = { start_date : null, end_date : null }) {
    return function(dispatch) {
        StartRequest()

        return Api.manager.GetManager(id).then(response => {
            if(response.error){
                StopRequest()
                dispatch(Handler.List.Manager.Add.Error(response.error));
            }
            else{
                const manager = response 
                return Api.manager.GetManagerReturns(manager.id, options).then(response => {
                    StopRequest()
                    if(response.error){
                        dispatch(Handler.List.Manager.Add.Error(response.error));
                    }
                    else{
                        const returns = response 
                        dispatch(Handler.List.Manager.Add.Success(manager, returns));
                    }
                })
            }
        }).catch(error => {
            StopRequest()
            throw (error);
        });
    };
}

export const getManagerLists = function(){
    return function(dispatch) {
        StartRequest()

        return Api.lists.GetManagerLists().then(response => {
            StopRequest()
            if(response.error){
                dispatch(Handler.Lists.Get.Error(response.error));
            }
            else{
                dispatch(Handler.Lists.Get.Success(response));
            }
        }).catch(error => {
            StopRequest()
            throw (error);
        });
    };
}

