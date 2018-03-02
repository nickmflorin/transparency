import _ from 'underscore'
import { ChartConfig, AxisConfig, Constants } from '../config.js'

class Config extends ChartConfig{
    constructor(kwargs = {}) {
        const defaultKwargs = { title : null, type : 'bubble'}
        kwargs = _.extend(kwargs, defaultKwargs)
        super(kwargs)

        this.series = [
            { data : [], name : 'Managers'},
            { data : [], name : 'Peers', color : Constants.PeerColor },
            { data : [], name : 'Benchmarks', color : Constants.BenchmarkColor }
        ]

        this.yAxis = new AxisConfig({ plotLines : [{ color: 'black', dashStyle: 'solid', width: 1, value: 0 }] })
        this.yAxis.title = 'Y Axis Variable'
        this.yAxis.maxPadding = 0.2
        this.yAxis.title = {
            align : 'high',
            text : 'Y Axis Variable',
            style : {
                color: '#263238',
                fontSize: '11px',
                fontWeight: '300',
                fontFamily: 'Helvetica'
            }
        }
        this.yAxis.labels = {
            overflow: 'justify',
            style : {
                color: '#263238',
                fontSize: '11px',
                fontWeight: '300',
                fontFamily: 'Helvetica'
            }
        },

        this.xAxis = new AxisConfig()
        this.xAxis.maxPadding = 0.2
        this.xAxis.title = {
            align : 'high',
            text : 'X Axis Variable',
            style : {
                color: '#263238',
                fontSize: '11px',
                fontWeight: '300',
                fontFamily: 'Helvetica'
            }
        }
        this.xAxis.labels = {
            overflow: 'justify',
            style : {
                color: '#263238',
                fontSize: '11px',
                fontWeight: '300',
                fontFamily: 'Helvetica'
            }
        }

        this.tooltip = {
            enabled : false // Disabled or Now
        }

        this.plotOptions = {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                    style : {
                        color: '#263238',
                        fontSize: '10px',
                        fontWeight: '300',
                        fontFamily: 'Helvetica'
                    }
                }
            }
        }
    }
}
export default Config;