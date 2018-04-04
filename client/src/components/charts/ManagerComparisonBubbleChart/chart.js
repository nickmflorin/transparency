import React from 'react';
import _ from 'underscore'
import PropTypes from 'prop-types';

import ReactHighcharts from 'react-highcharts';
import HighchartsMore from 'highcharts-more';
import { BubbleChartConfig } from '../Config'

HighchartsMore(ReactHighcharts.Highcharts);

export class ManagerComparisonBubbleChart extends React.Component {
    constructor(props, context) {
        super(props, context)

        var title = props.title || 'Manager Statistical Comparison' 
        var config = new BubbleChartConfig({ height: 400, title : title})
        config.series = [{ data : [], name : 'Managers'}]

        config.xAxis.setTitle(props.dimensions.x.label)
        config.yAxis.setTitle(props.dimensions.y.label)

        this.state = {
            config : config,
            dimensions : props.dimensions,
        }
    }
    static propTypes = {
        dimensions: PropTypes.object.isRequired,
        series: PropTypes.array.isRequired,
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
            config.series[0].data = this.props.series[0].data
            this.setState({ config : config })
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.series){
            var config = this.state.config 
            config.series[0].data = nextProps.series[0].data
            this.setState({ config : config })
        }
        if(nextProps.dimensions && this.chart){
            var config = this.state.config 
            config.xAxis.title.text = nextProps.dimensions.x.label
            config.yAxis.title.text = nextProps.dimensions.y.label
            this.setState({ config : config })
        }
    }
    afterRender(chart){
        this.chart = chart 
    }
    render() {
        return (
        <ReactHighcharts 
            config={this.state.config} 
            ref="chart"
            callback = {this.afterRender.bind(this)}
        >
        </ReactHighcharts>
        )
    }
}

export default ManagerComparisonBubbleChart;