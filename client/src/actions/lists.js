import { apiGetManagerLists, apiGetManagerList, apiSaveManagerList } from '../api'
import { HttpRequest } from './http'
import { ManagerListTypes } from './types'

export function loadManagerListSuccess(list) {
    return { type: ManagerListTypes.LOAD_MANAGER_LIST_SUCCESS, list };
}
export function loadManagerListsSuccess(lists) {
    return { type: ManagerListTypes.LOAD_MANAGER_LISTS_SUCCESS, lists };
}
export function saveManagerListSuccess(list) {
    return { type: ManagerListTypes.SAVE_MANAGER_LIST_SUCCESS, list };
}
export function saveManagerListError(error) {
    return { type: ManagerListTypes.SAVE_MANAGER_LIST_ERROR, error };
}

export function AddManagerListSuccess(list) {
    return { type: ManagerListTypes.ADD_MANAGER_LIST, list };
}


export const saveManagerList = function(ids, name){
    return function(dispatch) {
        dispatch(HttpRequest(true))

        return apiSaveManagerList(ids, name).then(response => {
            dispatch(HttpRequest(false))
            if(response.error){
                dispatch(saveManagerListError(response.error))
            }
            else{
                console.log('Manager List Successfully Saved')
                dispatch(saveManagerListSuccess(response))
            }
        }).catch(error => {
            dispatch(HttpRequest(false))
            throw (error);
        });
    };
}
export const addManagerList = function(list){
    console.log('Manually Adding Manager List')
    return function(dispatch) {
        dispatch(AddManagerListSuccess(list));
    };
}
export const clearManagerLists = function(lists){
    return function(dispatch) {
        dispatch({ type: ManagerListTypes.CLEAR_MANAGER_LISTS, lists });
    };
}
export const getManagerLists = function(){
    return function(dispatch) {
        dispatch(HttpRequest(true))

        return apiGetManagerLists().then(lists => {
            console.log('Loaded', lists.length, 'Manager Lists')
            dispatch(HttpRequest(false))

            dispatch(loadManagerListsSuccess(lists));
        }).catch(error => {
            dispatch(HttpRequest(false))
            throw (error);
        });
    };
}
export const getManagerList = function(id) {
    return function(dispatch) {
        dispatch(HttpRequest(true))

        return apiGetManagerList(id).then(list => {
            dispatch(HttpRequest(false))
            dispatch(loadManagerListSuccess(list));

        }).catch(error => {
            dispatch(HttpRequest(false))
            throw (error);
        });
    };
}


