import _ from 'underscore'
import { Manager } from './managers'
import { DatabaseTypes } from '../actions'

// Doesnt Serve Much Purpose Now but May in Future
export class QueryResult {
	constructor(data){
		this.sql = data.sql 
		this.table = data.table 
		this.columns = data.columns 
		this.results = data.results
	}
}

export function databases(state = [], action) {
  	switch(action.type){
		case DatabaseTypes.LOAD_DATABASES_SUCCESS:
            return action.databases
        default:
            return state;
	}
}

export function result(state = null, action) {
  	switch(action.type){
		case DatabaseTypes.RUN_QUERY_SUCCESS:
			var result = new QueryResult(action.result)
			console.log(result)
            return result
        default:
            return state;
	}
}
