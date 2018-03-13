import _ from 'underscore'
import {Utilities} from '../utilities.js'

export const TypeAccessor = {
    accessor : function(manager){
        if (manager.peer) return 'Peer'
        else if (manager.benchmark) return 'Benchmark'
    },
    value : function(manager){
        if (manager.peer) return 'Peer'
        else if (manager.benchmark) return 'Benchmark'
    }
}

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
                    return Utilities.percentify(manager.returns.stats.cumulative[key])
                }
            }
        },
        value : function(manager){
            if (manager.returns && manager.returns.stats) {
                if (manager.returns.stats.cumulative) {
                    return manager.returns.stats.cumulative[key]
                }
            }
        }
    }
    return this 
}

export default { ReturnStatsAccessor, Accessor, StrategyAccessor, TypeAccessor}
