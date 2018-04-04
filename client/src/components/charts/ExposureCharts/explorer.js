import React from 'react';
import _ from 'underscore'
import moment from 'moment'
import PropTypes from 'prop-types';

import { AreaChartConfig } from '../Config'

import ReactHighcharts from 'react-highcharts';
import HighchartsMore from 'highcharts-more';

HighchartsMore(ReactHighcharts.Highcharts);

export class ExposurChartExplorer extends React.Component{
    constructor(props, context) {
        super(props, context)    

        var title = props.title || 'Exposures' 
        var config = new AreaChartConfig({ height: 500, title : title})
        config.rangeSelector = {}
        config.rangeSelector.enabled = false;

        config.xAxis.dated()
        config.xAxis.setTitle('Time')
        config.yAxis.setTitle('Exposure')

        this.state = {
            config : config
        }
    }
    static propTypes = {
        series : PropTypes.array.isRequired,
    };
    draw(series){
        var config = this.state.config 
        config.series = series 

        var dates = []
        _.each(series, function(ser){
            var new_dates = _.pluck(ser.data, 0)
            dates = _.uniq(_.union(dates, new_dates))
        })
        
        dates.sort()

        var min = new moment(Math.min.apply(null, dates))
        min.subtract(1, 'months').endOf('month')

        var max = new moment(Math.max.apply(null, dates))
        max.add(1, 'months').endOf('month')

        config.xAxis.min = Date.UTC(min.year(), min.month(), min.day())
        config.xAxis.max = Date.UTC(max.year(), max.month(), max.day())
        
        this.setState({config : config})
    }
    // Hack to Make React Charts Animate
    componentDidUpdate() {
        const chart = this.refs.chart ? this.refs.chart.getChart() : {}
        const chartReflow = chart.reflow
        chart.reflow = () => {}
        setTimeout(() => (chart.reflow = chartReflow))
    }
    componentDidMount() {
        if(this.props.series){
            this.draw(this.props.series)
        }
    }
    componentWillReceiveProps(props){
        if(props.series){
            this.draw(props.series)
        }   
    }
    afterRender(chart){
        this.chart = chart 
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

export default ExposurChartExplorer;