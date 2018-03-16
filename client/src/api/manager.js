import $ from 'jquery'
import moment from 'moment'

const SearchLimit = 20
var _urls = {
    url: '/managers/',
    search_url: '/managers/search/',
    returns_url: '/managers/returns/',
    exposures_url: '/managers/exposures/',
}

function parse_dates(start_date = null, end_date = null, date = null){
    var query = {}
    // Date Specification Overrides Any Date Interval
    if(date){
        var mmt = new moment(date)
        if(!mmt.isValid()){
            throw new Error('Invalid Date in API Request')
        }
        mmt = mmt.format('YYYY-MM-DD')
        query['date'] = mmt
    }
    else{
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
    }
    
    return query
}

export const apiGetManager = function(id, options = { start_date : null, end_date : null, date : null, group : null}) {
    var url = _urls.url + String(parseInt(id)) + '/'
    var query = parse_dates(options.start_date, options.end_date, options.date)
    if(options.group){
        query['group'] = JSON.stringify(options.group)
    }

    return $.ajax({
        url: url,
        dataType: 'json',
        data: query,
        cache: true,
    }).then(response => {
        console.log(response)
        return response
    }).catch(error => {
        return error;
    });
}

export const apiGetManagers = function(ids, options = { start_date : null, end_date : null, date : null, group : null}) {
    var url = _urls.url
    if(ids.length == 0) throw new Error('Must Provide Non Empty Array of IDs')
    
    var query = parse_dates(options.start_date, options.end_date, options.date)
    query['ids'] = JSON.stringify(ids)
    
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

export const apiGetManagerExposures = function(id, options = { start_date : null, end_date : null, date : null, group : null}) {

    var query = parse_dates(options.start_date, options.end_date, options.date)
    query['id'] = id

    return $.ajax({
        url: _urls.exposures_url,
        dataType: 'json',
        data: query,
    }).then(response => {
        return response
    }).catch(error => {
        return error;
    });
}

export const apiGetManagerReturns = function(ids, options = { start_date : null, end_date : null, date : null, group : null}) {

    var url = _urls.returns_url
    if(ids.length == 0) throw new Error('Must Provide Non Empty Array of IDs')
    
    var query = parse_dates(options.start_date, options.end_date, options.date)
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
