import { combineReducers } from 'redux';
import _ from 'underscore'

import { UserQuery, Database, DatabaseTable } from './models'

export function database(state = null, action) {
    switch(action.type){
        case 'GET_DATABASES_RECEIVED':
            if(!state && action.data.length != 0){
                const datum = action.data[0]
                return new Database(datum)
            }
            return state 
        case 'GET_DATABASE_RECEIVED':
            return action.data 
        default:
            return state;
    }
};

export function databases(state = [], action) {
    switch(action.type){
        case 'GET_DATABASES_RECEIVED':
            return action.data.map((datum) => {
                return new Database(datum)
            })
        default:
            return state;
    }
};

export function queries(state = [], action) {
    switch(action.type){
        case 'GET_QUERIES_RECEIVED':
            return action.data.map((datum) => {
                return new UserQuery(datum)
            })
        case 'SAVE_NEW_QUERY_SUCCESS':
            return [
                ...state,
                new UserQuery(action.data)
            ]
        case 'REMOVE_QUERY_SUCCESS':
            if(!action.id){
                throw new Error('Delete Action Must Include ID')
            }
            var exists = _.findWhere(state, { id : action.id })
            if(!exists){
                throw new Error('Deleted Query Does Not Exist in Queries')
            }
            const index = state.findIndex(query => query.id === action.id)
            return [
                ...state.slice(0, index),
                ...state.slice(index + 1),
            ];
        case 'SAVE_NEW_QUERY_SUCCESS':
            var exists = _.findWhere(state, { id : action.id })
            if(exists){
                throw new Error('Created Query Already Exists in Queries')
            }
            return [...state, new UserQuery(action.data)] 

        default:
            return state;
    }
};

export function query(state = null, action) {
    switch(action.type){
        case 'CREATE_TEMP_QUERY_SUCCESS':
            return UserQuery.create_temp(action.user)

        case 'REMOVE_QUERY_SUCCESS':
            if(!action.id){
                throw new Error('Delete Action Must Include ID')
            }
            if(state && action.id == state.id){
                return null;
            }
            return state;

        // Only Allowing Direct Update of SQL For Now
        case 'UPDATE_QUERY_SUCCESS':
            if(state){
                return {
                    ...state, 
                    sql: action.update.sql || state.sql,
                }
            }
            return state;

        case 'SAVE_NEW_QUERY_SUCCESS':
            return {
                ...state,
                id : action.data.id,
                name : action.data.name,
                user : action.data.user,
                isNew : false,
                createdAt : action.data.createdAt,
            }

        case 'SAVE_QUERY_SUCCESS':
            return action.data

        case 'GET_QUERY_ERROR':
            return state 

        case 'GET_QUERY_RECEIVED':
            return new UserQuery(action.data)

        case 'RUN_QUERY_ERROR':
            if(state){
                return {
                    ...state, 
                    error: action.error
                }
            }
            return state;

        case 'RUN_QUERY_SUCCESS':
            if(state){
                return {
                    ...state, 
                    result: action.result,
                    table: action.result.table,
                    warning: action.result.warning,
                    error: action.result.error,
                    columns: action.result.columns
                }
            }
            return state;

        default:
            return state;
    }
};

export const dbReducer = combineReducers({  
    databases: databases,
    database: database,
    queries : queries,
    query : query,
});

export default dbReducer;

