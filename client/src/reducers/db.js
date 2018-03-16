import { DatabaseTypes } from '../actions/types'
import { combineReducers } from 'redux';

// Doesnt Serve Much Purpose Now but May in Future
class QueryResult {
	constructor(data){
		this.sql = data.sql 
		this.table = data.table 
		this.columns = data.columns 
		this.results = data.results
	}
}

function databases(state = [], action) {
  	switch(action.type){
		case DatabaseTypes.LOAD_DATABASES_SUCCESS:
            return action.databases
        default:
            return state;
	}
};

function query_result(state = null, action) {
  	switch(action.type){
		case DatabaseTypes.RUN_QUERY_SUCCESS:
			var result = new QueryResult(action.query_result)
            return result
        default:
            return state;
	}
};

export const db = combineReducers({  
    query_result: query_result,
    databases: databases,
});
