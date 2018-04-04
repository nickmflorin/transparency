import _ from 'underscore'
import { ActionGroup } from '../helpers'

export const Types = {
    manager : new ActionGroup('MANAGER', 
        [
            { type : 'get'},
            { type : 'select'},
            { type : 'search'},
        ],
        [
            { type : 'exposure', children : 
                [
                    { type : 'get'},
                ]
            },
            { type : 'exposures', children : 
                [
                    { type : 'get'},
                ]
            },
            { type : 'returns', children : 
                [
                    { type : 'get'},
                ]
            },
            { type : 'categories', children : 
                [
                    { type : 'get'},
                ]
            },
            { type : 'betas', children : 
                [
                    { type : 'get'},
                ]
            },
        ]
    ),
}

export const Handler = {
    Manager : {
        Search : {
            Success : function(results){
                return { type: Types.manager.search.success, results};
            },
            Error : function(error){
                return { type: Types.manager.search.error, error};
            }
        },
        Get : {
            Success : function(manager){
                return { type: Types.manager.get.success, manager};
            },
            Error : function(error){
                return { type: Types.manager.get.error, error};
            }
        },
        Select : {
            Success : function(manager){
                return { type: Types.manager.select.success, manager};
            },
            Error : function(error){
                return { type: Types.manager.select.error, error};
            }
        },
        Returns : {
            Get : {
                Success : function(returns){
                    return { type: Types.manager.returns.get.success, returns};
                },
                Error : function(error){
                    return { type: Types.manager.returns.get.error, error};
                }
            }
        },
        Exposure : {
            Get : {
                Success : function(exposure){
                    return { type: Types.manager.exposure.get.success, exposure};
                },
                Error : function(error){
                    return { type: Types.manager.exposure.get.error, error};
                }
            }
        },
        Exposures : {
            Get : {
                Success : function(exposures){
                    return { type: Types.manager.exposures.get.success, exposures};
                },
                Error : function(error){
                    return { type: Types.manager.exposures.get.error, error};
                }
            }
        },
        Categories : {
            Get : {
                Success : function(categories){
                    return { type: Types.manager.categories.get.success, categories};
                },
                Error : function(error){
                    return { type: Types.manager.categories.get.error, error};
                }
            }
        },
        Betas : {
            Get : {
                Success : function(betas){
                    return { type: Types.manager.betas.get.success, betas};
                },
                Error : function(error){
                    return { type: Types.manager.betas.get.error, error};
                }
            }
        }
    },
}

