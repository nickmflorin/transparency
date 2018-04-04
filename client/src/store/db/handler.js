import _ from 'underscore'
import { ActionGroup } from '../helpers'

export const Types = {
    databases : new ActionGroup('DATABASES', 
        [
            { type : 'get'},
        ],
    ),
    queries : new ActionGroup('QUERIES', 
        [
            { type : 'get'},
        ],
    ),
    query : new ActionGroup('QUERY', 
        [
            { type : 'get'},
            { type : 'save'},
            { type : 'temp'},
            { type : 'open'},
            { type : 'update'},
            { type : 'run'},
        ],
    ),
}

export const Handler = {
    Query : {
        Temp :  {
            Error : function(error){
                return { type: Types.query.temp.error, error }; 
            },
            Success : function(query){
                return { type: Types.query.temp.success, query };
            }
        },
        Run : {
            Error : function(error){
                return { type: Types.query.run.error, error }; 
            },
            Success : function(result){
                return { type: Types.query.run.success, result };
            }
        },
        Save : {
            Error : function(error){
                return { type: Types.query.save.error, error }; 
            },
            Success : function(query){
                return { type: Types.query.save.success, query };
            }
        },
        Update : {
            Error : function(error){
                return { type: Types.query.update.error, error }; 
            },
            Success : function(update){
                return { type: Types.query.update.success, update };
            }
        },
        Open : {
            Error : function(error){
                return { type: Types.query.open.error, error }; 
            },
            Success : function(query){
                return { type: Types.query.open.success, query }
            }
        },
        Get : {
            Error : function(error){
                return { type: Types.query.get.error, error }; 
            },
            Success : function(query){
                return { type: Types.query.get.success, query }
            }
        },
    },
    Queries : {
        Get : {
            Error : function(error){
                return { type: Types.queries.get.error, error };
            },
            Success : function(queries){
                return { type: Types.queries.get.success, queries };
            }
        }
    },
    Databases : {
        Get : {
            Error : function(error){
                return { type: Types.databases.get.error, error };
            },
            Success : function(databases){
                return { type: Types.databases.get.success, databases };
            }
        }
    }
}
