import React from 'react';
import _ from 'underscore'
import PropTypes from 'prop-types';

import ReactHighcharts from 'react-highcharts';
import HighchartsMore from 'highcharts-more';

import { BarChartConfig } from '../Config'
HighchartsMore(ReactHighcharts.Highcharts);

const series = (beta, horizons) => {
    var ser = {'name' : 'Missing', 'data' : []}
    ser.desc = beta.desc 

    if(beta.to){
        ser.name = beta.to.name 
        if(beta.cumulative){
            _.each(horizons, function(horizon){
                var cum = _.findWhere(beta.cumulative, { months : horizon })
                if(cum){
                    ser.data.push(cum.value)
                }
                else{
                    console.log('Warning: Missing Beta to Manager',beta.to.id,'at Horizon',horizon)
                    ser.data.push(0.0)
                }
            })
        }
    }
    return ser
}

const Serieses = (betas, horizons) => {
    var Serieses = []
    _.each(betas, function(beta){
        var Series = series(beta, horizons)
        Serieses.push(Series)
    })
    return Serieses
}

export class BetaBarChart extends React.Component {
    constructor(props){
        super(props)
        this.Horizons = [24,36,48,60]
        this.Conversion = {
            24 : '2 Years',
            36 : '3 Years',
            48 : '4 Years',
            60 : '5 Years',
        }
        var config = new BarChartConfig({ height: 400 })

        var self = this 
        config.xAxis.categories = _.map(this.Horizons, function(horizon){
            return self.Conversion[horizon]
        })

        this.state = {
            config : config
        }
    }
    componentDidMount() {
        if(this.props.betas && this.props.betas.betas){
            var series = Serieses(this.props.betas.betas, this.Horizons)
            var chart = this.refs.chart 
            var config = this.state.config 
            config.series = series 
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
    componentWillReceiveProps(props){
        if(props.betas && props.betas.betas){
   
            var series = Serieses(props.betas.betas, this.Horizons)
            var chart = this.refs.chart 
            var config = this.state.config 
            config.series = series 
            this.setState({config : config})
        }
    }
    afterRender(chart){
        this.chart = chart 
    }
    render(){
        return (
            <ReactHighcharts 
                config={this.state.config} 
                ref="chart"
                callback={this.afterRender.bind(this)}
            >
            </ReactHighcharts>
        )
    }
}

export default BetaBarChart;