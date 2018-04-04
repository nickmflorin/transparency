import _ from 'underscore'
import { Utilities } from '../../utilities'

export const StatisticConfig = function(id, label, AccessorObj, key = null, type = 'numeric'){
	var config = {
		id : id,
		label : label,
		type : type,
		isChild : true,
		isParent : false,
	}
	var accessorObj = AccessorObj
	if(key) accessorObj = new AccessorObj(key)
	
	config['accessor'] = accessorObj.accessor
	config['value'] = accessorObj.value
	return config 
}

export const ParentStatisticConfig = function(id, label, children){
	var config = {
		id : id,
		label : label,
		children : children,
		isChild : false,
		isParent : true,
	}
	return config
}
