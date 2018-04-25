import { toggleSidebar, StartRequest, StopRequest, changeDate, HttpRequest } from './utility'
import * as managerActions_ from './managers'
import *  as dbActions_ from './db'
import * as listsActions_ from './lists'
import { login, logout } from './auth'

export const managerActions = {
    manager : {
        select : managerActions_.selectManager,
        search : managerActions_.searchManager,
        get : managerActions_.getManager,
        exposure : {
            get : managerActions_.getManagerExposure,
            getCategory : managerActions_.getManagerCategoryExposure,
        },
        exposures : {
            get : managerActions_.getManagerExposures,
            getCategories : managerActions_.getManagerCategoryExposures,
        },
        returns : {
            get : managerActions_.getManagerReturns, 
            getBetas : managerActions_.getManagerBetas, 
        }
    }
}

// Dont Need Update Manager List Action -> Updates Performed by Adding Manager or Removing Manager
export const listsActions = {
    list : {
        new : listsActions_.createNewManagerList,
        save : listsActions_.saveManagerList,
        save_Async : listsActions_.saveManagerList_Async,
        saveNew : listsActions_.saveNewManagerList,
        saveNew_Async : listsActions_.saveNewManagerList_Async,
        clear : listsActions_.clearManagerList,
        get : listsActions_.getManagerList,
        remove : listsActions_.removeManagerList,
        updateDates : listsActions_.updateManagerListDates,
        managers : {
            remove : listsActions_.removeManagerFromList,
            add : listsActions_.addManagerToList,
        }
    },
    lists : {
        get : listsActions_.getManagerLists, 
    }
};


export const authActions = {
    login : login,
    logout : logout,
}

export const dbActions = {
    query : {
        get : dbActions_.getQuery,
        temp : dbActions_.createTempQuery,
        saveNew : dbActions_.saveNewQuery,
        saveNew_Async : dbActions_.saveNewQuery_Async,
        save : dbActions_.saveQuery,
        save_Async : dbActions_.saveQuery_Async,
        remove : dbActions_.removeQuery,
        update : dbActions_.updateQuery,
        run : dbActions_.runQuery,
        open : dbActions_.openQuery,
        openTable : dbActions_.openTableQuery,
    },
    queries : {
        get : dbActions_.getQueries,
    },
    database : {
        open : dbActions_.openDatabase,
    },
    databases : {
        get : dbActions_.getDatabases
    }
}

export const Actions = {
    toggleSidebar : toggleSidebar,
    StartRequest : StartRequest,
    StopRequest : StopRequest,
    changeDate : changeDate,
    HttpRequest : HttpRequest,
    ...authActions,
    ...listsActions,
    ...dbActions,
    ...managerActions
}

export default Actions;