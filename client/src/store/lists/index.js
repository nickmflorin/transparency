import { combineReducers } from 'redux';
import * as api from './api'
import * as reducers from './reducers'
import * as actions from './actions'

export * from './actions'
export * from './handler'

export const listsApi = {
    CreateManagerList : api.CreateManagerList,
    GetManagerList : api.GetManagerList,
    UpdateManagerList : api.UpdateManagerList,
    GetManagerLists : api.GetManagerLists,
};

export const listsReducer = combineReducers({  
    list: reducers.list,
    lists : reducers.lists,
});


// Dont Need Update Manager List Action -> Updates Performed by Adding Manager or Removing Manager
export const listsActions = {
    list : {
        createTemp : actions.createTempManagerList,
        save : actions.saveManagerList,
        saveNew : actions.saveNewManagerList,
        clear : actions.clearManagerList,
        get : actions.getManagerList,
        save : actions.saveManagerList, 
        updateDates : actions.updateManagerListDates,
        managers : {
            remove : actions.removeManagerFromList,
            add : actions.addManagerToList,
        }
    },
	lists : {
        get : actions.getManagerLists, 
    }
};


