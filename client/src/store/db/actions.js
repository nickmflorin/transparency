import moment from 'moment'
import _ from 'underscore'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

import { store, Api } from '../../store'
import { HttpRequest, StartRequest, StopRequest } from '../utility'

import { UserQuery, Database, DatabaseTable } from './models'
import { Handler, Types } from './handler'

export const createTempQuery = function() {
    return function(dispatch, getState) {
        const state = getState()
        if(!state.auth.user){
            throw new Error('User Must Exist to Create New Query')
        }
        var TempQuery = UserQuery.create_temp(state.auth.user)
        return dispatch(Handler.Query.Temp.Success(TempQuery));
    };
}

export const saveNewQuery = function(name){
    return function(dispatch, getState) {
        
        const state = getState()
        const query = state.db.query

        if(!state.auth.user){
            throw new Error('User Must be Present to Update Queries')
        }
        if(!query || !query.sql || query.sql.trim() == ""){
            throw new Error('Query Must be Valid to Save')
        }

        StartRequest()
        return Api.db.SaveQuery(query.sql, name).then(response => {
            StopRequest()
            if(response.error){
                return dispatch(Handler.Query.Save.Error(response.error))
            }
            else{
                return dispatch(Handler.Query.Save.Success(response))
            }
        }).catch(error => {
            throw (error);
        });
    };
}

export const saveQuery = function(){
    return function(dispatch, getState) {
        
        const state = getState()
        const query = state.db.query

        if(!state.auth.user){
            throw new Error('User Must be Present to Update Queries')
        }
        if(!query || !query.sql || query.sql.trim() == ""){
            throw new Error('Query Must be Valid to Save')
        }
        if(state.auth.user.id != query.user.id){
            throw new Error('Can Only Update Queries Belonging to Logged In User')
        }

        StartRequest()
        return Api.db.UpdateQuery(query.id, query.sql).then(response => {
            StopRequest()
            if(response.error){
                return dispatch(Handler.Query.Save.Error(response.error))
            }
            else{
                return dispatch(Handler.Query.Save.Success(response))
            }
        }).catch(error => {
            throw (error);
        });
    };
}


export const removeQuery = function(id){
    return function(dispatch) {
        StartRequest()
        return Api.db.RemoveQuery(id).then(response => {
            StopRequest()
            
            return dispatch(getQueries())
        }).catch(error => {
            throw (error);
        });
    };
}
// Only Updates Locally
export const updateQuery = function( update ) {
    const __allowed__ = ['sql']
    return function(dispatch, getState) {
        Object.keys(update).forEach(function(key){
            if(!_.contains(__allowed__, key)){
                throw new Error('Invalid Update Key Provided')
            }
        })
        return dispatch(Handler.Query.Update.Success(update))
    };
}

export const getQuery = function(id){
    return function(dispatch) {
        StartRequest()
        return Api.db.GetQuery(id).then(response => {
            StopRequest()

            if(response.error){
                return dispatch(Handler.Query.Get.Error(response.error))
            }
            else{
                return dispatch(Handler.Query.Get.Success(response))
            }
        }).catch(error => {
            throw (error);
        });
    };
}

export const runQuery = function(limit = null) {
    return function(dispatch, getState) {
        StartRequest()
        var query = getState().db.query 
        if(query){
            return Api.db.RunQuery(query, limit ).then( (response) => {
                StopRequest()
                if(response.error){
                    return dispatch(Handler.Query.Run.Error(response.error))
                }
                else{
                    return dispatch(Handler.Query.Run.Success(response))
                }
            }).catch(error => {
                throw (error);
            });
        }
        else{
            console.log('Warning: Query Missing from Store... Cannot Run')
            return dispatch(Handler.Query.Run.Error('Query Missing from Store'))
        }
    }
}

// Limit Defaults to 5 for Preview
export const openTableQuery = function(table, options = {run : false, limit : 5}) {
    const sql = 'Select Top ' + String(options.limit) + ' * from ' + table.lookup

    return function(dispatch, getState) {
        return dispatch(updateQuery( {sql : sql} )).then( (action) => {
            if(action.type == Types.query.update.success){

                // If Run Specified, Also Run Query to Get Results
                if(options.run){
                    dispatch(runQuery(options.limit))
                }
            }
            else{
                console.log('Error Updating Query...  Cannot Open Table Query')
                throw action.error;
            }
        })
    }
}

// Limit Defaults to 200
export const openQuery = function(id, options = { run : false, limit : 200}){
    return function(dispatch, getState) {

        return dispatch(getQuery(id)).then(action => {
            if(action.type == Types.query.get.success){

                // After Query Received... Open
                dispatch(Handler.Query.Open.Success(action.query)).then( (action) => {
                    if(action.type == Types.query.open.success && options.run === true){
                        dispatch(runQuery(options.limit))
                    }
                })
            }
            else{
                console.log('Error Retrieving Query')
                dispatch(Handler.Query.Open.Error(action.error))
            }
        }).catch(error => {
            throw (error);
        });
    };
}

export const getQueries = function() {
    return function(dispatch) {
        StartRequest()

        return Api.db.GetQueries().then(response => {
            StopRequest()
            if(response.error){
                return dispatch(Handler.Queries.Get.Error(response.error))
            }
            else{
                return dispatch(Handler.Queries.Get.Success(response))
            }
        }).catch(error => {
            throw (error);
        });
    };
}

export const getDatabases = function() {
    return function(dispatch) {
        StartRequest()

        return Api.db.GetDatabases().then(response => {
            StopRequest()

            if(response.error){
                dispatch(Handler.Databases.Get.Error(response.error))
            }   
            else{
                var databases = response.map((db) => {
                    return new Database(db)
                })
                dispatch(Handler.Databases.Get.Success(databases))
            }
        }).catch(error => {
            throw (error);
        });
    };
}



