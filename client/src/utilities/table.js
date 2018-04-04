import moment from 'moment' 
import _ from 'underscore'

export const Table = {
    convertResultToArray : function(columns, results) {
        var array = [columns]
        _.each(results, function(datum){
            var row = []
            _.each(columns, function(column){
                row.push(datum[column])
            })
            array.push(row)
        })
        return array
    },
    getData : function(table) {
        var data = table.state.data 
        var cols = table.state.columns 
        
        var array = []
        var header = []
        _.each(cols, function(col){
            header.push(col.Header)
        })
        array.push(header)

        _.each(data, function(datum){
            var row = []
            _.each(cols, function(col){
                row.push(col.accessor(datum))
            })
            array.push(row)
        })
        return array
    },
}
