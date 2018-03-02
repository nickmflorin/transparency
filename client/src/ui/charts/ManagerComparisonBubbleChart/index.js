import React from 'react';
import _ from 'underscore'

import Config from './config.js'

import ReactHighcharts from 'react-highcharts';
import HighchartsMore from 'highcharts-more';
HighchartsMore(ReactHighcharts.Highcharts);

var config = new Config({ height: 400 })

class ChartManager{
    constructor(manager, kwargs){
        this.id = manager.id 
        this.name = manager.name
        this.model = manager 

        this.primary = kwargs.primary || false
        this.benchmark = kwargs.benchmark || false
        this.peer = kwargs.peer || false
    }
}

function FindManagerInProps(props, id){
    if(props.manager && props.manager.id == id){
        return true
    }

    var peers = props.peers
    if(peers){
        var manager = _.findWhere(peers, {'id' : id})
        if(manager){
            return true
        }
    }
    var benchmarks = props.benchmarks
    if(benchmarks){
        var manager = _.findWhere(benchmarks, {'id' : id})
        if(manager){
            return true
        }
    }
    var managers = props.managers
    if(managers){
        var manager = _.findWhere(managers, {'id' : id})
        if(manager){
            return true
        }
    }
    return false
}

// Can Chose from Multiple Statistics
class ManagerComparisonBubbleChart extends React.Component {
    constructor(props) {
        super(props)
    }
    // Gets Stringified Time Horizons as List of String Categories
    componentDidMount() {
        let chart = this.refs.chart.getChart();
    }
    allPoints(){
        var points = []
        if (this.refs.chart && this.refs.chart.getChart()) {
            let chart = this.refs.chart.getChart()

            var series = _.findWhere(chart.series, {'name' : 'Managers'})
            points = points.concat(series.data)

            var series = _.findWhere(chart.series, {'name' : 'Benchmarks'})
            points = points.concat(series.data)

            var series = _.findWhere(chart.series, {'name' : 'Peers'})
            points = points.concat(series.data)
        }
        return points
    }
    managerExists(manager){
        var points = this.allPoints()
        var mgr = _.findWhere(points, {'id' : manager.id})
        if(mgr){
            return true 
        }
        return false 
    }
    // Need to Add Managers That Are Not Present and Remove Managers Present but Not in Props
    // If We Do Not Remove Managers, There Will be No way to Clear
    componentWillReceiveProps(nextProps){
        var self = this 

        // Find Managers to Remove First -> Check for Current Peers Not in New
        _.each(['managers','benchmarks','peers'], function(type){
            if(nextProps[type]){
                _.each(self.props[type], function(manager){
                    var exists = _.findWhere(nextProps[type], {'id' : manager.id})
                    if(!exists){
                        self.removeManager(manager)
                    }
                })
            }
        })

        var points = this.allPoints()

        // Primary Manager
        var manager = nextProps.manager
        if(manager){
            var mgr = new ChartManager(manager, {primary:true})
            var exists = _.findWhere(points, {'id' : mgr.id})
            if(!exists){
                this.addManager(mgr)
            }
        }   

        // Managers Explicitly Passed In
        var points = this.allPoints()

        var managers = nextProps.managers
        if(managers){
            _.each(managers, function(manager){
                var mgr = new ChartManager(manager)
                var exists = _.findWhere(points, {'id' : mgr.id})
                if(!exists){
                    self.addManager(mgr)
                }
            })
        }

        // Peers Explicitly Passed In
        var points = this.allPoints()

        var peers = nextProps.peers
        if(peers){
            _.each(peers, function(peer){
                var mgr = new ChartManager(peer, {peer:true})
                var exists = _.findWhere(points, {'id' : mgr.id})
                if(!exists){
                    self.addManager(mgr)
                }
            })
        }

        // Benchmarks Explicitly Passed In
        var benchmarks = nextProps.benchmarks
        if(benchmarks){
            _.each(benchmarks, function(benchmark){
                var mgr = new ChartManager(benchmark, {benchmark:true})
                var exists = _.findWhere(points, {'id' : mgr.id})
                if(!exists){
                    self.addManager(mgr)
                }
            })
        }
    }
    removeManager(point){
        if (this.refs.chart && this.refs.chart.getChart()) {
            let chart = this.refs.chart && this.refs.chart.getChart()

            var self = this 
            _.each(['Managers','Benchmarks','Peers'], function(type){
                var series = _.findWhere(chart.series, {'name' : type})
                var index = _.findIndex(series, function(datum) { return datum.id == point.id })
                if(index){
                    series.removePoint(index)
                }
            })
        }
    }
    // Adds Either Manager or Manager's Bencmmark/Peer
    addManager(manager) {
        if (this.refs.chart && this.refs.chart.getChart()) {
            let chart = this.refs.chart && this.refs.chart.getChart()

            if(manager.model.returns){
                var x = manager.model.returns.stats.maximum 
                var y = manager.model.returns.stats.minimum
                var z = manager.model.returns.stats.average

                var point = { x: x, y: y, z: z, id : manager.id, name : manager.model.name }
                var exists = this.managerExists(manager)
                if(!exists){
                    if(manager.benchmark){
                        var series = _.findWhere(chart.series, {'name' : 'Benchmarks'})
                        series.addPoint(point)
                    }
                    else if(manager.peer){
                        var series = _.findWhere(chart.series, {'name' : 'Peers'})
                        series.addPoint(point)
                    }
                    else{
                        var series = _.findWhere(chart.series, {'name' : 'Managers'})
                        series.addPoint(point)
                    }
                }
            }
            else{
                console.log('Warning: Manager',manager.id,'Missing Returns')
            }
            
        }
    }
    render() {
        return (
            <ReactHighcharts isPureConfig config={config} ref="chart"></ReactHighcharts>
        )
    }
}

export default ManagerComparisonBubbleChart;