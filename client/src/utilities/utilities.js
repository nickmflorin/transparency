import moment from 'moment' 
import _ from 'underscore'

export const Utilities = {
    guid : function() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },
    toTitleCase : function(str){
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    },
    percentify : function(value) {
        if (!value && value !== 0.0) {
            return value
        }

        value = parseFloat(value)
        if (value) {
            value = value.toFixed(2)
            value = String(value) + ' %'
            return value
        }
    },
    round : function(value, num) {
        if (!value && value !== 0.0) {
            return value
        }
        value = parseFloat(value)
        if (value) {
            value = value.toFixed(num)
            return value
        }
    },
    generateMonthSeries : function(startDate, endDate, format) {
        var values = [];

        var start = new moment(startDate)
        var end = new moment(endDate)

        if (!start.isValid() || !end.isValid()) {
            throw new Error('Start and/or End Dates Invalid')
        }
        start = start.startOf('month')
        end = end.startOf('month')

        var current = start;
        while (end >= current) {
            var append = new moment(current)
            if (format == 'parsed') {
                append = { 'month': append.month(), 'year': append.year() }
            } else if (format) {
                append = append.format(format)
            }
            values.push(append)
            current = moment(current).add(1, 'month');
        }
        return values
    }
}
