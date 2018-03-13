import _ from 'underscore'
import {Utilities} from '../utilities.js'
import { ReturnStatsAccessor, Accessor, StrategyAccessor, TypeAccessor } from './accessors'

function Config(id, header, AccessorObj, key = null, type = 'numeric'){
	this.id = id 
	this.Header = header 
	this.type = type 

	this.isChild = true
	this.isParent = false

	var accessorObj = AccessorObj
	if(key){
		accessorObj = new AccessorObj(key)
	}

	this.accessor = accessorObj.accessor
	this.value = accessorObj.value

	this.enabled = false // For Now, Assume All Parents Enabled
	this.setEnabled = function(enabled){
		var ind = enabled.indexOf(this.id)
		if(ind != -1){
			this.enabled = true
		}
	}
	this.toggle = function(){
		this.enabled = !this.enabled
	}
	return this 
}

function ParentConfig(id, header, children){
	this.id = id 
	this.Header = header 
	this.children = children

	this.isParent = true
	this.isChild = false

	this.enabled = true // For Now, Assume All Parents Enabled

	this.find = function(id){
		var pure = _.findWhere(this.children, { id : id, isChild : true })
		if(pure) return pure 
		
		var parents = _.where(this.children, {isParent : true })
		for(var i = 0; i<parents.length; i++){
			var found = parents[i].find(id)
			if(found){
				return found 
			}
		}
	}
	this.flatten = function(){
		var flattened = []
		for(var i = 0; i<this.children.length; i++){
			var child = this.children[i]
			if(child.isParent){
				var to_add = child.flatten()
				flattened = flattened.concat(to_add)
			}
			else{
				flattened.push(child)
			}
		}
		return flattened
	}
	this.setEnabled = function(enabled){
		for(var i = 0; i<this.children.length; i++){
			this.children[i].setEnabled(enabled)
		}
	}
	this.toggleChild = function(id){
		for(var i = 0; i<this.children.length; i++){
			var child = this.children[i]
			if(child.isParent){
				child.toggleChild(id)
			}
			else{
				var found = _.findWhere(this.children, { id : id})
				if(!found) throw new Error('Could Not Find Child Statistic ' + String(id) + ' in Parent ' + String(this.id))
				found.toggle()
			}
		}
	}
	return this
}

// Defines Layout of Statistics in Dropdown
export function ManagerStatisticsConfiguration(enabled){
	this.statistics = [
		new Config('name', 'Name', Accessor, 'name', 'string'),
		new Config('type', 'Type', TypeAccessor, null, 'string'),
		new Config('strategy', 'Strategy', StrategyAccessor, null, 'string'),
		new ParentConfig('returns', 'Returns', [
		    new ParentConfig('cumulative', 'Cumulative', [
		        new Config('month_3', '3 Month', new ReturnStatsAccessor('month_3').cumulative),
		        new Config('month_6', '6 Month', new ReturnStatsAccessor('month_6').cumulative),
		        new Config('month_9', '9 Month', new ReturnStatsAccessor('month_9').cumulative),
		        new Config('year_1', '1 Year', new ReturnStatsAccessor('year_1').cumulative),
		        new Config('year_2', '2 Year', new ReturnStatsAccessor('year_2').cumulative),
		        new Config('year_3', '3 Year', new ReturnStatsAccessor('year_3').cumulative),
		        new Config('year_5', '5 Year', new ReturnStatsAccessor('year_5').cumulative),
		    ]),
		    new Config('average', 'Average', ReturnStatsAccessor, 'average'),
		    new Config('minimum', 'Min', ReturnStatsAccessor, 'minimum'),
		    new Config('maximum', 'Max', ReturnStatsAccessor, 'maximum'),
		    new Config('std_dev_annual', 'Annual Std. Dev.', ReturnStatsAccessor, 'std_dev_annual'),
		    new Config('var', 'VAR 95%', ReturnStatsAccessor, 'var'),
		    new Config('max_drawdown', 'Max DD', ReturnStatsAccessor, 'max_drawdown'),
		    new Config('extreme_shortfall', 'Ex. Shortfall', ReturnStatsAccessor, 'extreme_shortfall'),
		    new Config('skew', 'Skew', ReturnStatsAccessor, 'skew'),
		])
	]

	this.find = function(id){
		for(var i = 0; i<this.statistics.length; i++){
			if(this.statistics[i].isParent){
				var found = this.statistics[i].find(id)
				if(found){
					return found 
				}
			}
			else{
				if(this.statistics[i].id == id){
					return this.statistics[i]
				}
			}
		}
	}
	this.toggle = function(id){
		var stat = this.find(id)
		if(!stat) throw new Error('Invalid Statistic : ' + String(id))
		
		if(stat.isParent){
			stat.toggleChild(id)
		}
		else{
			stat.toggle()
		}
	}

	this.filter = function(){
		var flattened = this.flatten()
	    var filtered = _.filter(flattened, function(stat){
	    	return stat.enabled && stat.type == 'numeric'
	    })
	    return filtered
	}
	
	this.create_array = function(managers, includeDisabled = false){
		var flattened = this.flatten()
		var grid = []

		_.each(managers, function(manager){
			var row = []
			_.each(flattened, function(stat){
				if(!includeDisabled){
					if(stat.enabled){
						var value = stat.value(manager)
						row.push(value)
					}
				}
				else{
					var value = stat.value(manager)
					row.push(value)
				}
			})
			grid.push(row)
		})
	  	return grid
	}

	this.flatten = function(){
		var flattened = []
		for(var i = 0; i<this.statistics.length; i++){
			if(this.statistics[i].isParent){
				var more = this.statistics[i].flatten()
				flattened = flattened.concat(more)
			}
			else{
				flattened.push(this.statistics[i])
			}
		}
		return flattened
	}

	for(var i = 0; i<enabled.length; i++){
		this.toggle(enabled[i])
	}
	return this 
}
