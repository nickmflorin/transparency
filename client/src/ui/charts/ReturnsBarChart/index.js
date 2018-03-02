import React from 'react';
import _ from 'underscore'

import ReturnsBarChartChart from './chart'
import ReturnsBarChartHeader from './header'

// Can Chose from Multiple Statistics
class ReturnsBarChart extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            horizons : [6, 12, 24, 36, 60],
            managers : [],
            peers : [],
            benchmarks : [],
        }
    }
    addBenchmark(benchmark){
        var current = _.findWhere(this.state.benchmarks, {'id' : benchmark.id})
        if(!current){
            this.setState({ benchmarks: [...this.state.benchmarks, benchmark]})
        }
    }
    addPeer(peer){
        var current = _.findWhere(this.state.peers, {'id' : peer.id})
        if(!current){
            this.setState({ peers: [...this.state.peers, peer]})
        }
    }
    removeBenchmark(benchmark){
        var exists = _.findWhere(this.state.benchmarks, {'id' : benchmark.id})
        if(exists){
            var benchmarks = _.without(this.state.benchmarks, benchmark)
            this.setState({ benchmarks: benchmarks})
        }
    }
    removePeer(peer){
        var exists = _.findWhere(this.state.peers, {'id' : peer.id})
        if(exists){
            var peers = _.without(this.state.peers, peer)
            this.setState({ peers: peers})
        }
    }
    // Adds Either Manager or Manager's Bencmmark/Peer
    addManager(manager){
        var current = _.findWhere(this.state.managers, {'id' : manager.id})
        if(!current){
            this.setState({ managers: [...this.state.managers, manager]})

            var self = this 
            _.each(manager.peers, function(peer){
                self.addPeer(peer)
            })
            _.each(manager.benchmarks, function(benchmark){
                self.addPeer(benchmark)
            })
        }
    }
    removeManager(manager){
        var exists = _.findWhere(this.state.managers, {'id' : manager.id})
        if(exists){
            var managers = _.without(this.state,managers, manager)
            this.setState({ managers: managers})

            var self = this 
            _.each(manager.peers, function(peer){
                self.removePeer(peer)
            })
            _.each(manager.benchmarks, function(benchmark){
                self.removeBenchmark(benchmark)
            })
        }
    }
    // Need to Add Managers That Are Not Present and Remove Managers Present but Not in Props
    // If We Do Not Remove Managers, There Will be No way to Clear
    componentWillReceiveProps(nextProps){
        var self = this 
        var managers = nextProps.managers
        if(managers){
            _.each(managers, function(manager){
                self.addManager(manager)
            })
        }
        // If We Do Not Remove Managers, There Will be No way to Clear
        _.each(this.state.managers, function(manager){
            var exists = _.findWhere(managers , {'id' : manager.id})
            if(!exists){
                self.removeManager(manager)
            }
        })
    }
    render() {
        return (
            <div className="chart-container">
                <ReturnsBarChartHeader managers={this.state.managers} peers={this.state.peers} benchmarks={this.state.benchmarks} horizons={this.state.horizons} />
                <ReturnsBarChartChart managers={this.state.managers} peers={this.state.peers} benchmarks={this.state.benchmarks} horizons={this.state.horizons} />
            </div>
        )
    }
}

export default ReturnsBarChart;