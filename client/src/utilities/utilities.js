import moment from 'moment' 
import _ from 'underscore'

export const Utilities = {
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