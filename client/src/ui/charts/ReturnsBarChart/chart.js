import React from 'react';
import axios from 'axios';
import $ from 'jquery'
import _ from 'underscore'

import Config from './config.js'

const ReactHighcharts = require('react-highcharts'); // Expects that Highcharts was loaded in the code.
const config = new Config({height : 400})

const PeerColor = 'rgba(255, 87, 34, 0.65)'
const BenchmarkColor = 'rgba(255, 87, 34, 0.65)'

// Can Chose from Multiple Statistics
class ReturnsBarChartChart extends React.Component {
	constructor(props){
		super(props)
	}
	// Gets Stringified Time Horizons as List of String Categories
	componentDidMount() {
		var categories = this.getCategories(this.props.horizons)
    	let chart = this.refs.chart.getChart();
    	chart.xAxis[0].setCategories(categories)
  	}
  	componentWillReceiveProps(nextProps){
        var self = this 

        var managers = nextProps.managers
        if(this.refs.chart && this.refs.chart.getChart() && managers){
            _.each(managers, function(manager){
                self.addManager(manager)
            })
        }
    }
    nameExists(name){
    	if(this.refs.chart && this.refs.chart.getChart()){
    		let chart = this.refs.chart && this.refs.chart.getChart()
    		var serieses = chart.series

    		for(var i = 0; i<serieses.length; i++){
    			if(serieses[i].name == name){
    				return true
    			}
    		}
    	}
    	return false 
    }
  	addBenchmark(benchmark){
        if(this.refs.chart && this.refs.chart.getChart()){
            let chart = this.refs.chart && this.refs.chart.getChart()

            var exists = this.nameExists(benchmark.name)
            if(!exists){
	            var data = this.getReturnStream(benchmark)
	            chart.addSeries({name : benchmark.name, data : data, color : BenchmarkColor})
	        }
        }
    }
    // Note: When We Are Handling Betas, We Do Not Want to Exclude Peers or Benchmarks When Name Already Present
    // Since Multiple Might be Present
    addPeer(peer){
        if(this.refs.chart && this.refs.chart.getChart()){
            let chart = this.refs.chart && this.refs.chart.getChart()

            var exists = this.nameExists(peer.name)
            if(!exists){
	            var data = this.getReturnStream(peer)
	            chart.addSeries({name : peer.name, data : data, color : PeerColor})
	        }
        }
    }
    // Adds Either Manager or Manager's Bencmmark/Peer
    addManager(manager){
        if(this.refs.chart && this.refs.chart.getChart()){
            let chart = this.refs.chart && this.refs.chart.getChart()

            var exists = this.nameExists(manager.name)
            if(!exists){
            	var data = this.getReturnStream(manager)
	            chart.addSeries({id : manager.id, name : manager.name, data : data})

	            var self = this 
	            _.each(manager.peers, function(peer){
	                self.addPeer(peer)
	            })
	            _.each(manager.benchmarks, function(benchmark){
	                self.addPeer(benchmark)
	            })
            }
        }
    }
  	getCategories(horizons) {
	    var categories = []
	    _.each(horizons, function(horizon) {
	    	var flt = parseFloat(horizon)

	    	var category;
	    	if(flt < 12.0){
	    		category = String(parseInt(horizon)) + ' Months'
	    	}
	    	else{
	    		category = String(parseInt(horizon / 12.0)) + ' Years'
	    	}
	        categories.push(category)
	    })
	    return categories
	}

  	// Removes Returns from Manager Stats in Same Format as Horizons
  	getReturnStream(manager){
  		var stream = []
  		var horizons = this.props.horizons 
  		if(manager.returns && manager.returns.stats && manager.returns.stats.cumulative && manager.returns.stats.cumulative.lookback){
  			_.each(horizons, function(horizon){
  				var value = manager.returns.stats.cumulative.lookback[horizon] || 0.0
  				stream.push(value)
  			})
  		}
  		return stream
  	}
  	
	render() {
	    return <ReactHighcharts isPureConfig config={config} ref="chart"></ReactHighcharts>;
	}
}

export default ReturnsBarChartChart;