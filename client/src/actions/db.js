import moment from 'moment'
import _ from 'underscore'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

import { UserQuery } from '../reducers/models'
import request from 'superagent'
import { getApiGenerator } from '../services/data-service'

export const createTempQuery = function() {
    return function(dispatch, getState) {
        const state = getState()
        if(!state.auth.user){
            throw new Error('User Must Exist to Create New Query')
        }
        dispatch({
            type : 'CREATE_TEMP_QUERY_SUCCESS',
            user : state.auth.user
        })
    };
}

export const getQueryAPI = function(id){
    var url = '/api/db/query/' + id + '/'
    const req = request.get(url)
    return req
}

export const getQuery = function(id){
    return function(dispatch){
        dispatch({
            type : 'GET_QUERY',
            id : id,
        })
    }
}

export const removeQuery = function(id){
    return function(dispatch) {
        dispatch({
            type : 'REMOVE_QUERY',
            id : id,
        })
    };
}

export const getQueries = function() {
    return function(dispatch) {
        dispatch({
            type : 'GET_QUERIES'
        })
    };
}

// API Call Not Necessary Since Tables Already Loaded with DB
export const openDatabase = function(database) {
    return function(dispatch) {
        dispatch({
            type : 'GET_DATABASE_RECEIVED',
            data : database,
        })
    };
}

export const getDatabases = function() {
    return function(dispatch) {
        dispatch({
            type : 'GET_DATABASES'
        })
    };
}

export const saveNewQuery = function(name){
    return function(dispatch, getState) {
        if(!getState().auth.user){
            throw new Error('User Must be Present to Update Queries')
        }
        dispatch({type : 'CLEAR_ERRORS', error_type : 'create'})
        dispatch({type : 'CLEAR_SUCCESSES', success_type : 'create'})

        const query = getState().db.query
        if(name == "" || name.trim() == ""){
            dispatch({
                type : 'SAVE_NEW_QUERY_ERROR',
                error : 'Must provide a valid query name.'
            })
        }
        else if(!query || !query.sql || query.sql.trim() == ""){
            dispatch({
                type : 'SAVE_NEW_QUERY_ERROR',
                error : 'Cannot save an empty or invalid query.'
            })
        }
        else{
            dispatch({
                type : 'SAVE_NEW_QUERY',
                data : {
                    sql : query.sql,
                    name : name,
                }
            })
        }
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
        dispatch({
            type : 'SAVE_QUERY',
            id : query.id,
            data : {
                sql : query.sql,
            }
        })
    };
}

export const runQuery = function(limit = null, query = null) {
    return function(dispatch, getState) {
        if(!query){
            query = getState().db.query 
            if(!query){
                throw new Error('Warning: Query Missing from Store... Cannot Run')
            }
        }
        if(!query.sql || query.sql.trim() == ""){
            dispatch({
                type : 'RUN_QUERY_ERROR',
                error : 'Cannot run empty query.'
            })
        }
        else{
            dispatch({
                type : 'RUN_QUERY',
                id : query.id,
                data : {
                    sql : query.sql,
                }
            })
        }
    }
}

export const exportQuery = function(limit = null, query = null) {
    return function(dispatch, getState) {
        if(!query){
            query = getState().db.query 
            if(!query){
                throw new Error('Warning: Query Missing from Store... Cannot Run')
            }
        }
        if(!query.sql || query.sql.trim() == ""){
            dispatch({
                type : 'EXPORT_QUERY_ERROR',
                error : 'Cannot export empty query.'
            })
        }
        else{
            dispatch({
                type : 'EXPORT_QUERY',
                id : query.id,
                data : {
                    sql : query.sql,
                }
            })
        }
    }
}

// Only Updates Locally - Keep Synchronous for Now
export const updateQuery = function( update, options = { save : false, run : false, export : false } ) {
    const __allowed__ = ['sql']
    Object.keys(update).forEach(function(key){
        if(!_.contains(__allowed__, key)){
            throw new Error('Invalid Update Key Provided')
        }
    })
    return function(dispatch, getState) {
        dispatch({
            type : 'UPDATE_QUERY_SUCCESS',
            update : update
        })
        if(options.save){
            dispatch(saveQuery())
        }
        else if(options.run){
            dispatch(runQuery())
        }
        else if(options.export){
            dispatch(exportQuery())
        }
    }
}

// Limit Defaults to 5 for Preview
export const openTableQuery = function(table, options = {run : false, limit : 5}) {
    const sql = 'Select Top ' + String(options.limit) + ' * from ' + table.lookup
    return function(dispatch, getState) {

        // To Do: Not Sure if This is Guaranteed to Have Updated SQL After Update
        dispatch(updateQuery( {sql : sql} ))
        const query = getState().db.query
        if(options.run){
            runQuery(options.limit, query)
        }
    }
}

// Limit Defaults to 200
export function openQuery(id, options = { run : false, limit : 200}){
    return function(dispatch){
        getQueryAPI(id).then( (response) => {
            const data = JSON.parse(response.text)

            if(!data.error){
                dispatch({
                    type : 'GET_QUERY_RECEIVED',
                    data : data,
                })
                if(options.run){
                    const query = new UserQuery(data)
                    runQuery(options.limit, query)
                }
            }
            else{
                dispatch({
                    type : 'GET_QUERY_ERROR',
                    data : data.error,
                })
            }
        })
    }
}



