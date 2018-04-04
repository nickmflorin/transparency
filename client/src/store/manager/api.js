import $ from 'jquery'
import _ from 'underscore'
import moment from 'moment'

import { parse_dates } from '../helpers'

const SearchLimit = 20

var _urls = {
    manager: '/api/managers/',
    search_url: '/api/managers/search/',
    returns_url: '/api/managers/returns/',
    exposures_url: '/api/managers/exposures/',
    categories_url : '/api/managers/categories/',
    betas_url: '/api/managers/betas/',
}

const validation = {
    level : [1,2,3,4],
    tier : ['long','short','gross','net','pct_gross'],
    validate : function(key, value) {
        const valids = validation[key]
        if(valids !== undefined){
            var valid = _.contains(valids, value)
            if(!valid){
                throw new Error('Invalid Option ' + key)
            }
        }
        return;
    }
};

const parse_category_params = function(query = {}, options){
    if(options.level){
        query.level = parseInt(options.level)
        validation.validate('level', query.level)
    }
    if(options.tier){
        query.tier = String(options.tier)
        validation.validate('tier', query.tier)
    }
    if(options.category){
        query.category = String(options.category)
    }
    return query
};



export const GetManager = function(id) {
    var url = _urls.manager + String(parseInt(id)) + '/'

    return $.ajax({
        url: url,
        dataType: 'json',
        cache: true,
    }).then(response => {
        return response
    }).catch(error => {
        return error;
    });
}

export const SearchManager = function(search, limit=SearchLimit) {
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

export const GetManagerBetas = function(id, options = { start_date : null, end_date : null,  managers : null, groups : null}) {
    var url = _urls.betas_url + String(parseInt(id)) + '/'

    var query = parse_dates({start_date : options.start_date, end_date : options.end_date})
    query['managers'] = options.managers || []
    query['groups'] = options.groups || []

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

export const GetManagerCategoryExposures = function(id, options = { category : null, tier : null, level : null, start_date : null, end_date : null, date : null}) {
    var url = _urls.categories_url + String(parseInt(id)) + '/'
        
    var query = parse_dates({start_date : options.start_date, end_date : options.end_date, date : options.date })
    query = parse_category_params(query, options)

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

export const GetManagerExposure = function(id, date) {
    var url = _urls.exposures_url + String(parseInt(id)) + '/'
    var query = parse_dates({date : date})

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

export const GetManagerExposures = function(id, options = { start_date : null, end_date : null}) {
    var url = _urls.exposures_url + String(parseInt(id)) + '/'
    var query = parse_dates({start_date : options.start_date, end_date : options.end_date})

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

export const GetManagersReturns = function(ids, options = { start_date : null, end_date : null, date : null}) {
    var url = _urls.returns_url 
    if(ids.length == 0){
        throw new Error('Cannot Provide Empty List of Manager IDs')
    }
    var query = parse_dates({start_date : options.start_date, end_date : options.end_date, date : options.date})
    query['managers'] = JSON.stringify(ids)

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

export const GetManagerReturns = function(id, options = { start_date : null, end_date : null, date : null}) {
    var url = _urls.returns_url + String(parseInt(id)) + '/'
    var query = parse_dates({start_date : options.start_date, end_date : options.end_date, date : options.date})
        
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


