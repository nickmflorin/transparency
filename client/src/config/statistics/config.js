import _ from 'underscore'
import { Utilities } from '../../utilities'
import { StatisticsLibrary } from './library'

export const Statistic = function(config, parent = null){
	this.id = config.id 
	this.label = config.label 
	this.type = config.type 

	this.enabled = false;

	this.group_id = null
	this.group_label = null
	if(parent){
		this.group_id = parent.id 
		this.group_label = parent.label
	}

	this.accessor = config.accessor 
	this.value = config.value 

	return this 
}

function add_config(config, statistics, enabled, parent = null){
	if(config.isParent){
		_.each(config.children, function(child){
			add_config(child, statistics, enabled, config)
		})
	}
	else{
		var stat = new Statistic(config, parent)
		if(_.contains(enabled, stat.id)){
			stat.enabled = true
		}
		statistics.push(stat)
	}
}

// Returns Flattened Group of Statistics Organized by Group ID if They Are Grouped Within Parent Stats
export const Statistics = function(enabled){
	var statistics = []
	_.each(StatisticsLibrary, function(config){
		add_config(config, statistics, enabled)
	})
	return statistics
}
