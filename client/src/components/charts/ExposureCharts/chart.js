import React from 'react';
import _ from 'underscore'
import PropTypes from 'prop-types';

import { HistoricalExposureChartConfig } from './config.js'
import Constants from '../constants.js'

import ReactHighcharts from 'react-highcharts';
import HighchartsMore from 'highcharts-more';

HighchartsMore(ReactHighcharts.Highcharts);

export class HistoricalExposureBarChart extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            serieses : []
        }
    }
    static propTypes = {
        exposures: PropTypes.array.isRequired,
        tiers : PropTypes.array.isRequired, // ID Used for Local Storage Persistence
    };
    createSeries(tier, exposures){
        var series = {'name' : Constants.Formals[tier], 'data' : [], 'color' : Constants.Colors[tier]}
        for(var i = 0; i<exposures.length; i++){
            var exposure = exposures[i]
            if(exposure[tier] !== undefined){
                series.data.push({'x' : new Date(exposure.date), 'y' : exposure[tier]})
            }
        }
        series.data.sort(function(a, b){
            return a.x - b.x;
        })
        return series
    }
    componentWillReceiveProps(props){
        var serieses = []
        if(props.exposures){
            var self = this 
            _.each(this.props.tiers, function(tier){
                serieses.push(self.createSeries(tier, props.exposures))
            })
        }
        this.setState({ serieses : serieses })
    }
    getConfig(){
        var config = new HistoricalExposureChartConfig('column', { height: 400 })
        if(this.state.serieses.length != 0){
            config.series = this.state.serieses
        }
        return config 
    }
    afterRender(chart){
      this.chart = chart 
    }
    render(){
        const Config = this.getConfig()
        return (
             <ReactHighcharts 
                config={Config} 
                ref="chart"
                callback = {this.afterRender.bind(this)}
            >
            </ReactHighcharts>
        )
    }
}

export default HistoricalExposureBarChart;