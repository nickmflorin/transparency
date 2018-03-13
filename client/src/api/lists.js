import $ from 'jquery'
import accessToken from '../reducers'
import Cookies from 'js-cookie';
import { csrfSafeMethod } from '../actions'

var _props = {
    url: '/api/managerlists/',
}

export const apiSaveManagerList = function(ids, name){
    var csrftoken = Cookies.get('csrftoken');

	ids = JSON.stringify(ids)
	var query = { ids : ids, name : name }
    
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
export const apiGetManagerLists = function(query) {
    query = query || {}
    return $.ajax({
        url: _props.url,
        dataType: 'json',
        data: query,
    }).then(response => {
        console.log('Got Lists')
        console.log(response)
        return response
    }).catch(error => {
        return error;
    });
}
export const apiGetManagerList = function(id, query) {
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
