import React from 'react';
import _ from 'underscore'
import PropTypes from 'prop-types';

import ReactHighcharts from 'react-highcharts';
import HighchartsMore from 'highcharts-more';

import { PieChartConfig, Colors, Formals } from '../Config'

HighchartsMore(ReactHighcharts.Highcharts);

export class SnapshotExposurePieChart extends React.Component{
    constructor(props, context) {
        super(props, context)    
            
        var title = props.title || 'Snapshot Exposures' 
        var height = props.height || 400
        var config = new PieChartConfig({ height: height, title : title})

        this.state = {
            config : config
        }
    }
    static propTypes = {
        series: PropTypes.object.isRequired,
    };
    // Hack to Make React Charts Animate
    componentDidUpdate() {
        const chart = this.refs.chart ? this.refs.chart.getChart() : {}
        const chartReflow = chart.reflow
        chart.reflow = () => {}
        setTimeout(() => (chart.reflow = chartReflow))
    }
    componentDidMount() {
        if(this.props.series){
            var config = this.state.config 
            config.series = [this.props.series] 
            this.setState({config : config})
        }
    }
    componentWillReceiveProps(props){
        if(props.series){
            var config = this.state.config 
            config.series = [this.props.series]
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
                callback = {this.afterRender.bind(this)}
                ref="chart"
            >
            </ReactHighcharts>
        )
    }
}

export default SnapshotExposurePieChart;