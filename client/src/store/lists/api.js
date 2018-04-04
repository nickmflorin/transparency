import $ from 'jquery'
import accessToken from './reducers'
import Cookies from 'js-cookie';
import { csrfSafeMethod } from '../auth'

import { HttpRequest } from '../utility'

var _props = {
    url: '/api/managers/lists/',
}

export const CreateManagerList = function(name, managers){
    var csrftoken = Cookies.get('csrftoken');

    if(!name || name.trim() == ""){
        throw new Error('Cannot Call API Without Valid List Name')
    }
    if(managers.length == 0){
        throw new Error('Cannot Call API Without Non-Empty List of Managers')
    }

	managers = JSON.stringify(managers)
	var query = { managers : managers, name : name }
    var headers = {'X-CSRFToken' : csrftoken}

    return $.ajax({
        url: _props.url,
        dataType: 'json',
        type : 'POST',
        data: query,
        headers: headers,
    }).then(response => {
        return response
    }).catch(error => {
        return error;
    });
}	

export const UpdateManagerList = function(id, managers){
    var csrftoken = Cookies.get('csrftoken');
    var url = _props.url + String(id) + '/'

    if(!id){
        throw new Error('Must Provide Manager List ID to Update')
    }

    if(managers.length == 0){
        throw new Error('Cannot Call API Without Non-Empty List of Managers')
    }

    managers = JSON.stringify(managers)
    var query = { managers : managers }
    var headers = {'X-CSRFToken' : csrftoken}

    return $.ajax({
        url: url,
        dataType: 'json',
        type : 'PUT',
        data: query,
        headers: headers,
    }).then(response => {
        return response
    }).catch(error => {
        return error;
    });
}   

export const GetManagerLists = function(query) {
    query = query || {}

    return $.ajax({
        url: _props.url,
        dataType: 'json',
        data: query,
    }).then(response => {
        return response
    }).catch(error => {
        return error;
    });
}
export const GetManagerList = function(id, query) {
    var url = _props.url + String(id) + '/'
    query = query || {}

    return $.ajax({
        url: url,
        dataType: 'json',
        data: query,
    }).then(response => {
        return response
    }).catch(error => {
        return error;
    });
}
