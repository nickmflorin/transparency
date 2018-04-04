import _ from 'underscore'
import moment from 'moment'

export const Dates = {
  momify_tuple(date){
    var mmt =  moment({ 
        year : date.year, 
        month : date.month, 
        day : 1
    })
    if(!mmt.isValid()){
        throw new Error('Invalid Date Configuration')
    }
    return mmt 
  },
  // Dates Must Reducer Date Objects
  different(first_dates, second_dates, key){
    if(!_.contains(['date','start','end'], key)){
      throw new Error('Invalid Key')
    }
    if(first_dates[key].month == second_dates[key].month && first_dates[key].year == second_dates[key].year){
      return false 
    }
    return true 
  },
  stringify_tuple(date, format = 'YYYY-MM-DD'){
      var mmt = Dates.momify_tuple(date)

      mmt = mmt.endOf('month');
      mmt = mmt.format(format)
      return mmt 
  },  
  // Creates Start/End Date Moments from Month/Year Obj Pairs
  createMomentEOMonthRange : function(start, end, format = null){
    if(start.month == undefined || start.year == undefined){
      throw new Error('Invalid Start Format')
    }
    if(end.month == undefined || end.year == undefined){
      throw new Error('Invalid Start Format')
    }
    var dates = {}
    dates.start = Dates.momify_tuple(start)
    dates.end = Dates.momify_tuple(end)

    dates.start = dates.start.endOf('month');
    dates.end = dates.end.endOf('month');

    if(format){
      dates.start = dates.start.format(format)
      dates.end = dates.end.format(format)
    }
    return dates
  },
}