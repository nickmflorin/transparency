import $ from 'jquery'
import moment from 'moment'

const SearchLimit = 20
var _urls = {
    url: '/api/managers/',
    search_url: '/api/mgrsearch/',
    returns_url: '/api/returns/',
    list_url: '/api/managerlists/',
}

function parse_dates(start_date = null, end_date = null){
    var query = {}
    if(start_date){
        var mmt = new moment(start_date)
        if(!mmt.isValid()){
            throw new Error('Invalid Start Date in API Request')
        }
        mmt = mmt.format('YYYY-MM-DD')
        query['start_date'] = mmt
    }
    if(end_date){
        var mmt = new moment(end_date)
        if(!mmt.isValid()){
            throw new Error('Invalid End Date in API Request')
        }
        mmt = mmt.format('YYYY-MM-DD')
        query['end_date'] = mmt
    }
    return query
}


export const apiGetManager = function(id, start_date = null, end_date = null, extended = true) {
    var url = _urls.url + String(parseInt(id)) + '/'
    var query = parse_dates(start_date = start_date, end_date = end_date)
    if(extended){
        query['extended'] = true
    }

    return $.ajax({
        url: url,
        dataType: 'json',
        data: query,
        cache: true,
    }).then(response => {
        return response
    }).catch(error => {
        return error;
    });
}

export const apiGetManagers = function(ids, start_date = null, end_date = null, extended = true) {
    var url = _urls.url
    if(ids.length == 0){
        throw new Error('Must Provide Non Empty Array of IDs')
    }

    var query = parse_dates(start_date = start_date, end_date = end_date)
    query['ids'] = JSON.stringify(ids)
    if(extended){
        query['extended'] = true
    }

    
    return $.ajax({
        url: url,
        dataType: 'json',
        data: query,
        cache: true,
    }).then(response => {
        return response
    }).catch(error => {
        return error;
    });
}

export const apiGetManagerReturns = function(ids, start_date = null, end_date = null) {
    var url = _urls.returns_url
    if(ids.length == 0){
        throw new Error('Must Provide Non Empty Array of IDs')
    }

    var query = parse_dates(start_date = start_date, end_date = end_date)
    query['ids'] = JSON.stringify(ids)

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

export const apiSearchManager = function(search, limit=SearchLimit) {
    var url = _urls.search_url
    // url += '?search=' + String(search)
    // url += '?limit=' + parseInt(limit)

    return $.ajax({
        url: url,
        data : { search : search, limit : parseInt(limit)},
        dataType: 'json',
        cache: true,
    })
    .then(response => {
        return response
    })
    .catch(error => {
        return error;
    });
};
