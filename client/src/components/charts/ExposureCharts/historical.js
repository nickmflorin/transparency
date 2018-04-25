import React from 'react';
import _ from 'underscore'
import PropTypes from 'prop-types';

import ReactHighcharts from 'react-highcharts';
import HighchartsMore from 'highcharts-more';

import { ColumnChartConfig, Colors, Formals } from '../Config'

HighchartsMore(ReactHighcharts.Highcharts);

const Series = (tier, exposures) => {
    var series = {'name' : Formals[tier], 'data' : [], 'color' : Colors[tier], 'id' : tier}
    _.each(exposures, function(exposure){
        if(exposure.value !== undefined && exposure.value != 0.0){
            series.data.push({'x' : new Date(exposure.date), 'y' : exposure.value})
        }
    })
    series.data.sort(function(a, b){
        return a.x - b.x;
    })
    return series
}

export class HistoricalExposureBarChart extends React.Component{
    constructor(props, context) {
        super(props, context)    
        // Title Shown in Chart Panel
        var config = new ColumnChartConfig()
        config.chart.marginTop = 10;
        config.chart.marginBottom = 60;

        config.xAxis.dated()

        config.yAxis.setTitle("Exposure")
        config.xAxis.setTitle("Time")

        config.series = []
        _.each(this.props.tiers, function(tier, i){
            var series ={'name' : Formals[tier], 'data' : [], 'color' : Colors[tier]}
            config.series.push(series)
        })

        this.state = {
            config : config
        }
    }
    static propTypes = {
        exposures: PropTypes.object,
        tiers : PropTypes.array.isRequired, // ID Used for Local Storage Persistence
    };
    drawExposures(exposures){
        if(exposures && this.chart){

            var serieses = []
            for(var i = 0; i<this.props.tiers.length; i++){
                var tier = this.props.tiers[i]

                var tiered = _.filter(exposures.exposures, function(exposure){
                    return exposure.tier == tier
                })
      
                var series = Series(tier, tiered)
                serieses.push(series)
            }

            var config = this.state.config 
            config.series = serieses 
            this.setState({config : config})
        }
    }
    // Hack to Make React Charts Animate
    componentDidUpdate() {
        const chart = this.refs.chart ? this.refs.chart.getChart() : {}
        const chartReflow = chart.reflow
        chart.reflow = () => {}
        setTimeout(() => (chart.reflow = chartReflow))
    }
    componentDidMount() {
        if(this.props.exposures){
            this.drawExposures(this.props.exposures )
        }
    }
    componentWillReceiveProps(props){
        if(props.exposures){
            this.drawExposures(props.exposures )
        }   
    }
    afterRender(chart){
        this.chart = chart 
    }
    render(){
        return (
             <ReactHighcharts 
                config={this.state.config} 
                callback = {this.afterRender.bind(this)}
                ref="chart"
            >
            </ReactHighcharts>
        )
    }
}

export default HistoricalExposureBarChart;