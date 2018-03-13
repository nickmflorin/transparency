import $ from 'jquery'

var urls = {
    databases: '/api/databases/',
    query: '/api/query/',
}

export const apiGetDatabases = function(){
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

export const apiGetDatabase = function(id){
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

// If No SQL Passed In, Show Top 5 Used
export const apiQuery = function(tableId, query = null){
    var data = { id : tableId }
    if(query){
        data['query'] = query 
    }
    return $.ajax({
        url: urls.query,
        dataType: 'json',
        type : 'GET',
        data : data,
    }).then(response => {
        console.log(response)
        return response
    }).catch(error => {
        return error;
    });
}   
