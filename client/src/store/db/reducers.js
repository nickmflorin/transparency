import { Types } from './handler'
import { store } from '../../store'

// To Do: Will Need to Include More Types
const DBErrorTypes = {
    Update : 'update',
    Run : 'run',
    Save : 'save',
}

class DBError{
    constructor(type, description){
        this.type = type 
        this.desc = description
    }
}

// Currently Not Using These -> But Will be Useful in Future
export function errors(state = [], action) {
    switch(action.type){
        case Types.query.run.error:
            var err = new DBError(DBErrorTypes.Run, action.error)
            return err
        case Types.query.save.error:
            var err = new DBError(DBErrorTypes.Save, action.error)
            return err
        case Types.query.update.error:
            var err = new DBError(DBErrorTypes.Update, action.error)
            return err
        default:
            return state;
    }
};

export function databases(state = [], action) {
  	switch(action.type){
		case Types.databases.get.success:
            return action.databases
        default:
            return state;
	}
};

export function query(state = null, action) {
    switch(action.type){
        case Types.query.temp.success:
            return action.query;

        // Only Allowing Direct Update of SQL For Now
        case Types.query.update.success:
            if(state){
                return {
                    ...state, 
                    sql: action.update.sql || state.sql,
                }
            }

        case Types.query.save.success:
            return action.query

        case Types.query.open.success:
            return action.query

        case Types.query.run.error:
            if(state){
                return {
                    ...state, 
                    error: action.error
                }
            }

        case Types.query.run.success:
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

        default:
            return state;
    }
};

export function queries(state = [], action) {
  	switch(action.type){
		case Types.queries.get.success:
            return action.queries 
        default:
            return state;
	}
};


