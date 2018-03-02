import Utilities from '../../../../utilities.js'
import _ from 'underscore'

var DefaultManagerComparisonStats = [
	{ header: "Name", id : "name",
      accessor: function(manager){
        return manager.name
      }
    },
    { header: "Type", id: "type", 
      accessor: function(manager){
        if(manager.peer){
          return 'Peer'
        }
        else if(manager.benchmark){
          return 'Benchmark'
        }
      }
    },
    { header: "Strategy", id: "strategy",
      accessor: function(manager){
      	if(manager.strategy){
      		return manager.strategy.name
      	}
      }
    },
    { header: "Returns", 
      id: "returns", 
      children : [
    	{ header: "YTD", 
    	  id: "ytd",
    	  parent : 'returns',
	      accessor: function(manager){
	        if(manager.returns && manager.returns.stats && manager.returns.stats.cumulative){
		        var cumulative = manager.returns.stats.cumulative
		        if(cumulative){
		        	return Utilities.percentify(cumulative.ytd)
		        }
		      }
	      }
	    },
	    { header: "3 Month", 
	      id: "3_month",
	      parent : 'returns',
	      accessor: function(manager){
	        if(manager.returns && manager.returns.stats && manager.returns.stats.cumulative){
		        var cumulative = manager.returns.stats.cumulative
		        if(cumulative && cumulative.lookback){
		        	return Utilities.percentify(cumulative.lookback[3])
		        }
		      }
	      }
	    },
	    { header: "6 Month", 
	      id: "6_month",
	      parent : 'returns',
	      accessor: function(manager){
	        if(manager.returns && manager.returns.stats && manager.returns.stats.cumulative){
		        var cumulative = manager.returns.stats.cumulative
		        if(cumulative && cumulative.lookback){
		        	return Utilities.percentify(cumulative.lookback[6])
		        }
		      }
	      }
	    },
	    { header: "1 Year", 
	      id: "1_year",
	      parent : 'returns',
	      accessor: function(manager){
	        if(manager.returns && manager.returns.stats && manager.returns.stats.cumulative){
		        var cumulative = manager.returns.stats.cumulative
		        if(cumulative && cumulative.lookback){
		        	return Utilities.percentify(cumulative.lookback[12])
		        }
		      }
	      }
	    },
	    { header: "2 Year", 
	      id: "2_year",
	      parent : 'returns',
	      accessor: function(manager){
	        if(manager.returns && manager.returns.stats && manager.returns.stats.cumulative){
		        var cumulative = manager.returns.stats.cumulative
		        if(cumulative && cumulative.lookback){
		        	return Utilities.percentify(cumulative.lookback[24])
		        }
		      }
	      }
	    },
	    { header: "3 Year", 
	      id: "3_year",
	      parent : 'returns',
	      accessor: function(manager){
	        if(manager.returns && manager.returns.stats && manager.returns.stats.cumulative){
		        var cumulative = manager.returns.stats.cumulative
		        if(cumulative && cumulative.lookback){
		        	return Utilities.percentify(cumulative.lookback[36])
		        }
		      }
	      }
	    },
	    { header: "5 Year", 
	      id: "5_year",
	      parent : 'returns',
	      accessor: function(manager){
	        if(manager.returns && manager.returns.stats && manager.returns.stats.cumulative){
		        var cumulative = manager.returns.stats.cumulative
		        if(cumulative && cumulative.lookback){
		        	return Utilities.percentify(cumulative.lookback[60])
		        }
		      }
	      }
	    },
	    { header: "Max", 
	      id: "max",
	      parent : 'returns',
	      accessor: function(manager){
	        if(manager.returns && manager.returns.stats){
		        return Utilities.percentify(manager.returns.stats.maximum)
		    }
	      }
	    },
	    { header: "Min", 
	      id: "min",
	      parent : 'returns',
	      accessor: function(manager){
	        if(manager.returns && manager.returns.stats){
		        return Utilities.percentify(manager.returns.stats.minimum)
		    }
	      }
	    },
	    { header: "Average", 
	      id: "avg",
	      parent : 'returns',
	      accessor: function(manager){
	        if(manager.returns && manager.returns.stats){
		        return Utilities.percentify(manager.returns.stats.average)
		    }
	      }
	    },
    	]
    }
]

// To Do: Allow Entire Parent Object to be Enabled/Disabled
class ManagerComparisonStats extends Array{
	constructor(enabled){
		super()

		var self = this 

		// Initialize List with Default Stats
		var defaultStats = _.clone(DefaultManagerComparisonStats)
		_.each(defaultStats, function(stat){
			stat.enabled = false; // Default Case

			self.push(stat)
		})

		// Update List for Enabled Cases
		_.each(enabled, function(spec){
			if(spec instanceof Object){
				var parentID = Object.keys(spec)[0]

				var parent = _.findWhere(self, {'id' : parentID})
				if(!parent) throw new Error('Invalid Parent Stat ID : ' + parentID)
				
				if(spec[parentID] == 'all'){
					_.each(parent.children, function(child){
						child.enabled = true;
					})
				}
				else{
					if(!(spec[parentID]) instanceof Array){
						throw new Error('Must Specify Enabled Children as Array')
					}
					_.each(spec[parentID], function(id){
						var obj = _.findWhere(parent.children, {'id' : id})
						if(!obj) throw new Error('Invalid Sub Stat ID : ' + id)
						
						obj.enabled = true;
					})
				}
			}
			else{
				var obj = _.findWhere(self, {'id' : spec})
				if(!obj) throw new Error('Invalid Stat ID : ' + spec)
				
				obj.enabled = true;
			}
		})
	}
	// // Recover Used to Reinitialize With Existing Stats
	// static regenerate(stats){
	// 	var obj = new ManagerComparisonStats([])
	// 	_.each(stats, function(stat){
	// 		obj.push(stat)
	// 	})
	// 	return obj
	// }
}

export default ManagerComparisonStats;