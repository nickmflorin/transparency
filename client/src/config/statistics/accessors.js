import _ from 'underscore'
import moment from 'moment'
import {Utilities} from '../../utilities'

export const StrategyAccessor = {
    accessor : function(manager){
        if (manager.strategy){
            return manager.strategy.name
        }
    },
    value : function(manager){
        if (manager.strategy){
            return manager.strategy.name
        }
    }
}

export const RangeAccessor = {
    accessor : function(manager){
        if (manager.returns) {
            var start = "", end = ""
            if(manager.returns.range && manager.returns.range.start){
                start = new moment(manager.returns.range.start)
                if(start.isValid()){
                    start = start.format('YYYY-MM-DD')
                }
                else{
                    start = ""
                }
            }
            if(manager.returns.range && manager.returns.range.end){
                end = new moment(manager.returns.range.end)
                if(end.isValid()){
                    end = end.format('YYYY-MM-DD')
                }
                else{
                    end = ""
                }
            }
        }
        return start + ' - ' + end
    },
    value : function(manager){
        if (manager.returns) {
            var start = "", end = ""
            if(manager.returns.range && manager.returns.range.start){
                start = new moment(manager.returns.range.start)
                if(start.isValid()){
                    start = moment.format('YYYY-MM-DD')
                }
                else{
                    start = ""
                }
            }
            if(manager.returns.range && manager.returns.range.end){
                end = new moment(manager.returns.range.end)
                if(end.isValid()){
                    end = moment.format('YYYY-MM-DD')
                }
                else{
                    end = ""
                }
            }
        }
        return start + ' - ' + end
    }
}

export function Accessor(key) {
    this.accessor = function(manager) {
        return manager[key]
    }
    this.value = function(manager) {
        return manager[key]
    }
    return this 
}

export function ReturnStatsAccessor(key) {

    this.accessor = function(manager) {
        if (manager.returns && manager.returns.stats) {
            return Utilities.percentify(manager.returns.stats[key])
        }
    }
    this.value = function(manager) {
        if (manager.returns && manager.returns.stats) {
            return manager.returns.stats[key]
        }
    },
    this.cumulative = {
        accessor : function(manager){
            if (manager.returns && manager.returns.stats) {
                if (manager.returns.stats.cumulative) {
                    var cum = _.findWhere(manager.returns.stats.cumulative, { months : key })
                    if(cum){
                        return Utilities.percentify(cum.value)
                    }
                }
            }
        },
        value : function(manager){
            if (manager.returns && manager.returns.stats) {
                if (manager.returns.stats.cumulative) {
                    var cum = _.findWhere(manager.returns.stats.cumulative, { months : key })
                    if(cum){
                        return cum.value
                    }
                }
            }
        }
    }
    return this 
}

export default { ReturnStatsAccessor, Accessor, StrategyAccessor, RangeAccessor }
