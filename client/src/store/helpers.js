import moment from 'moment'
import _ from 'underscore'

export const ActionMethod = function(parent, method){
    var text = parent.text + '_' + method.type.toUpperCase()
    this.success = text + '_SUCCESS'
    this.error = text + '_ERROR'
    return this 
}

export const SubActionGroup = function(group, sub){
    this.text = group.text + '_' + sub.type.toUpperCase()

    _.each(sub.children, (child) => {
        this[child.type] = new ActionMethod(this, child)
    })
    return this 
}

export const ActionGroup = function(base, methods, subs){
    this.text = base 
    _.each(methods, (method) => {
        this[method.type] = new ActionMethod(this, method)
    })
    _.each(subs, (sub) => {
        this[sub.type] = new SubActionGroup(this, sub)
    })
    return this 
}

export const parse_dates = function(dates = {start_date : null, end_date : null, date : null}){
    var query = {}
    // Date Specification Overrides Any Date Interval
    if(dates.date){
        var mmt = new moment(dates.date)
        if(!mmt.isValid()){
            throw new Error('Invalid Date in API Request')
        }
        mmt = mmt.format('YYYY-MM-DD')
        query['date'] = mmt
    }
    else{
        if(dates.start_date){
            var mmt = new moment(dates.start_date)
            if(!mmt.isValid()){
                throw new Error('Invalid Start Date in API Request')
            }
            mmt = mmt.format('YYYY-MM-DD')
            query['start_date'] = mmt
        }
        if(dates.end_date){
            var mmt = new moment(dates.end_date)
            if(!mmt.isValid()){
                throw new Error('Invalid End Date in API Request')
            }
            mmt = mmt.format('YYYY-MM-DD')
            query['end_date'] = mmt
        }
    }
    
    return query
}

