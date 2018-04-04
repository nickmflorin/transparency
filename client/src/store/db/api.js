import $ from 'jquery'
import Cookies from 'js-cookie';
import { HttpRequest } from '../utility'

var urls = {
    databases: '/api/db/databases/',
    query: '/api/db/query/',
}

export const GetDatabases = function(){
    return $.ajax({
        url: urls.databases,
        dataType: 'json',
        type : 'GET',
    }).then(response => {
        return response
    }).catch(error => {
        return error;
    });
}	

export const GetDatabase = function(id){
    return $.ajax({
        url: urls.databases,
        dataType: 'json',
        type : 'GET',
        data : { id : id }
    }).then(response => {
        return response
    }).catch(error => {
        return error;
    });
}   

// SQL Optionally Passed In, SQL Required if Not Running a Saved Query
export const RunQuery = function(query, limit : null){
    const id = query.id 
    var url = urls.query + id + '/run/'

    var options = {}
    if(query.sql) options.sql = query.sql 
    if(query.id == 'new' && !query.sql){
        throw new Error('Must Provide SQL for New Query')
    }

    return $.ajax({
        url: url,
        dataType: 'json',
        type : 'GET',
        data : options,
    }).then(response => {
        return response
    }).catch(error => {
        return error;
    });
}   

export const RemoveQuery = function(id){
    var csrftoken = Cookies.get('csrftoken');
    var headers = {'X-CSRFToken' : csrftoken}

    var url = urls.query + String(id) + '/'
    if(!id){
        throw new Error('Must Provide Query ID')
    }
    return $.ajax({
        url: url,
        dataType: 'json',
        type : 'DELETE',
        headers: headers,
    }).then(response => {
        return response
    }).catch(error => {
        return error;
    });
}


export const GetQuery = function(id){
    var url = urls.query + String(id) + '/'
    if(!id){
        throw new Error('Must Provide Query ID')
    }
    return $.ajax({
        url: url,
        dataType: 'json',
        type : 'GET',
    }).then(response => {
        return response
    }).catch(error => {
        return error;
    });
}

export const GetQueries = function(){
    return $.ajax({
        url: urls.query,
        dataType: 'json',
        type : 'GET',
    }).then(response => {
        return response
    }).catch(error => {
        return error;
    });
}

export const UpdateQuery = function(id, sql){
    var csrftoken = Cookies.get('csrftoken');
    var url = urls.query + String(id) + '/'

    if(!id) throw new Error('Must Provide Manager List ID to Update')
    if(sql.trim() == ""){
        throw new Error('SQL Invalid for Update')
    }

    var query = { sql : sql }
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


export const SaveQuery = function(query, name){
    var csrftoken = Cookies.get('csrftoken');
    var headers = {'X-CSRFToken' : csrftoken}

    var query = { sql : query, name : name }
    return $.ajax({
        url: urls.query,
        dataType: 'json',
        type : 'POST',
        headers: headers,
        data : query,
    }).then(response => {
        return response
    }).catch(error => {
        return error;
    });
}   


