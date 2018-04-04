import _ from 'underscore'
import { ActionGroup } from '../helpers'

export const Types = {
    list : new ActionGroup('MANAGER_LIST', 
        [
            { type : 'temp'},
            { type : 'clear'},
            { type : 'save'},
            { type : 'get'},
            { type : 'new'},
        ],
        [
            { type : 'manager', children : 
                [
                    { type : 'add'},
                    { type : 'remove'},
                ]
            },
            { type : 'returns', children : 
                [
                    { type : 'get'},
                ]
            },
        ]
    ),
    lists : new ActionGroup('MANAGER_LISTS', 
        [
            { type : 'get'},
        ],
    )
}

// Dont Need Update Manager List Action -> Updates Performed by Adding Manager or Removing Manager
export const Handler = {
    List : {
        Get : {
            // Returns Optionally Passed In to Include in Manager List Managers
            Success : function(list, returns){
                return { type: Types.list.get.success, list, returns };
            },
            Error : function(error){
                return { type: Types.list.get.error, error };
            }
        },
        Temp : {
            Success : function(list){
                return { type : Types.list.temp.success, list }
            },
            Error : function(error){
                return { type : Types.list.temp.error, error }
            }
        },
        Clear : {
             Success : function(){
                return { type: Types.list.clear.success };
            },
            Error : function(error){
                return { type: Types.list.clear.error, error };
            }
        },
        Save : {
            Success : function(list){
                return { type: Types.list.save.success, list };
            },
            Error : function(error){
                return { type: Types.list.save.error, error };
            }
        },
        New : {
            Success : function(list){
                return { type: Types.list.new.success, list };
            },
            Error : function(error){
                return { type: Types.list.new.error, error };
            }
        },
        Returns : {    
            Get : {
                Success : function(returns){
                    return { type: Types.list.returns.get.success, returns };
                },
                Error : function(error){
                    return { type: Types.list.returns.get.error, error };
                }
            },
        },  
        Manager : {
            Add : {
                Success : function(manager, returns){
                    return { type: Types.list.manager.add.success, manager, returns };
                },
                Error : function(error){
                    return { type: Types.list.manager.add.error, error };
                }
            },
            Remove : {
                Success : function(id){
                    return { type: Types.list.manager.remove.success, id };;
                },
                Error : function(error){
                    return { type: Types.list.manager.remove.error, error };
                }
            },
        }
    },
    Lists : {
        Get : {
            Success : function(lists){
                return { type: Types.lists.get.success, lists };
            },
            Error : function(error){
                return { type: Types.lists.get.error, error };
            }
        },
    }
}