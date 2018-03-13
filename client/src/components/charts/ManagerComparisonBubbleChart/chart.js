import React from 'react';
import _ from 'underscore'
import PropTypes from 'prop-types';

import ManagerComparisonChartConfig from './config.js'

import ReactHighcharts from 'react-highcharts';
import HighchartsMore from 'highcharts-more';
import SelectToolbar from '../../../components/elements/SelectToolbar'

HighchartsMore(ReactHighcharts.Highcharts);
var config = new ManagerComparisonChartConfig({ height: 400 })

export class ManagerComparisonBubbleChart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            managers : [],
            stat_config : null,
            dimensions : {
                x : null,
                y : null, 
                z : null
            }
        }
    }
    static propTypes = {
        stat_config: PropTypes.object.isRequired,
    };
    // Destroying Chart Causing Errors
    // componentWillUnmount() {
    //     if(this.chart){
    //         this.chart.destroy();
    //     }
    // }
    generateSeries(managers, dimensions = null){
        var mgrSeries = []
        if(!dimensions) dimensions = this.state.dimensions 

        if(dimensions.x && dimensions.y && dimensions.z){
            for(var i = 0; i<managers.length; i++){
                var manager = managers[i]
                var point = { id : manager.id, name : manager.name }

                point['x'] = dimensions.x.value(manager)
                point['y'] = dimensions.y.value(manager)
                point['z'] = dimensions.z.value(manager)
  
                mgrSeries.push(point)
            }
        }
        return mgrSeries
    }
    // Updates Statistic in Chart
    handleChange(event, dim){
        var statId = event.target.value 

        var flattened = this.state.stat_config.flatten()
        var stat = _.findWhere(flattened, { id : statId })
        if(!stat){
            throw new Error('Invalid Statistics ID : ',statId)
        }
        var dimensions = this.state.dimensions
        dimensions[dim] = stat 
        this.setState({ dimensions : dimensions })
        this.updateAxes(null, dimensions, true)
    }
    updateLabels(dimensions = null){
        if(!dimensions) dimensions = this.state.dimensions 
        if(this.chart){

            var x_options = this.chart.axes[0].options['title']
            x_options['text'] = null
            if(dimensions.x){
                x_options['text'] = dimensions.x.Header
            }

            var y_options = this.chart.axes[1].options['title']
            y_options['text'] = null
            if(dimensions.y){
                y_options['text'] = dimensions.y.Header
            }
            
            this.chart.axes[0].setTitle(x_options, true)
            this.chart.axes[1].setTitle(y_options, true)
        }
    }
    updateAxes(managers = null, dimensions = null, redraw = false){
        if(!managers) managers = this.state.managers
        if(!dimensions) dimensions = this.state.dimensions
        this.updateLabels(dimensions)

        if(dimensions.x && dimensions.y && dimensions.z && managers.length != 0){
            var mgrSeries = this.generateSeries(managers, dimensions)
            if(this.chart){
                this.chart.series[0].remove()
                this.chart.addSeries({ data : mgrSeries, name : 'Managers'}, redraw)
            }
        }
    }
    updateManagers(managers, redraw = false){
        // Remove Unwanted Points
        if(this.chart){
            for(var i = 0; i<this.chart.series[0].data.length; i++){
                var point = this.chart.series[0].data[i]
                var exists = _.findWhere(managers, { id : point.id })
                if(!exists){
                    this.chart.series[0].removePoint(i, redraw)
                }
            }

            var mgrSeries = this.generateSeries(managers)
            for(var i = 0; i<mgrSeries.length; i++){
                var exists = _.findWhere(this.chart.series[0].data, { id : mgrSeries[i].id })
                if(!exists){
                    this.chart.series[0].addPoint(mgrSeries[i], redraw)
                }
            }
        }
    }
    // Sets Default Dimensions if Missing
    defaultDimensions(statistics = null, dimensions = null){
        if(!dimensions) dimensions = this.state.dimensions
        if(!statistics) statistics = this.state.stat_config.filter()

        if(statistics.length != 0){
            if(!dimensions.x) dimensions.x = statistics[0]
            if(!dimensions.y) dimensions.y = statistics[0]
            if(!dimensions.z) dimensions.z = statistics[0]

            if(statistics.length > 1){
                dimensions.y = statistics[1]
                dimensions.z = statistics[1]
            }
            if(statistics.length > 2){
                dimensions.z = statistics[2]
            }
            this.setState({ dimensions : dimensions })
            this.updateLabels(dimensions)
        }
    }
    // Need to Add Managers That Are Not Present and Remove Managers Present but Not in Props
    // If We Do Not Remove Managers, There Will be No way to Clear
    componentWillReceiveProps(nextProps){
        if(nextProps.stat_config){
            this.setState({ stat_config : nextProps.stat_config })

            if(nextProps.stat_config.length != 0){
                var statistics = nextProps.stat_config.filter()
                this.defaultDimensions(statistics)
            }
        }

        if (this.chart && nextProps.managers) {
            this.setState({ managers : nextProps.managers })
            this.updateManagers(nextProps.managers)
            this.chart.redraw()
        }
    }
    afterRender(chart){
        this.chart = chart 
    }
    render() {
        var filtered = []
        if(this.state.stat_config){
            filtered = this.state.stat_config.filter()
        }
        
        return (
            <div>
                <SelectToolbar
                    handleChange={this.handleChange.bind(this)}
                    items={[
                        {'id' : 'x', 'label' : 'X Axis', 'children' : filtered, active : this.state.dimensions.x},
                        {'id' : 'y', 'label' : 'Y Axis', 'children' : filtered, active : this.state.dimensions.y},
                        {'id' : 'z', 'label' : 'Z Axis', 'children' : filtered, active : this.state.dimensions.z}
                    ]}
                />
                <ReactHighcharts 
                    isPureConfig config={config} 
                    ref="chart"
                    callback = {this.afterRender.bind(this)}
                >
                </ReactHighcharts>
            </div>
        )
    }
}

export default ManagerComparisonBubbleChart;