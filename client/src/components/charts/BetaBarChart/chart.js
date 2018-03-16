import React from 'react';
import _ from 'underscore'
import PropTypes from 'prop-types';

import BetaBarChartConfig from './config.js'
import Constants from '../constants.js'
import BetaChartToolbar from '../../elements/BetaChartToolbar'

import ReactHighcharts from 'react-highcharts';
import HighchartsMore from 'highcharts-more';
HighchartsMore(ReactHighcharts.Highcharts);

const Conversion = {
    'year_1' : '1 Year',
    'year_3' : '3 Years',
    'year_5' : '5 Years',
    'total' : 'All'
}

var config = new BetaBarChartConfig('column', { height: 400 })
const horizons = ['year_1','year_3','year_5','total']
config.xAxis.categories = _.map(horizons, function(horizon){
    return Conversion[horizon]
})

export class BetaBarChart extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            active : 'peer',
            serieses : {
                peer : [],
                benchmark : [],
                general : []
            },
        }
    }
    updateChart(manager, serieses){
        if(this.chart){
            for(var i = 0; i<this.chart.series.length; i++){
                if(this.chart.series[i].ref != manager.id){
                    this.chart.series[i].remove(false)
                }
            }
            for(var i = 0; i<serieses.length; i++){
                this.chart.addSeries(serieses[i], false)
            }
            this.chart.redraw()
        }
    }
    removeAll(){
        if(this.chart){
            for(var i = 0; i<this.chart.series.length; i++){
                this.chart.series[i].remove(false)
            }
        }
    }
    componentWillReceiveProps(nextProps){
        var serieses = {peer : [], benchmark : [], general : []}
        var test = []
        
        if(!nextProps.manager || !nextProps.manager.group || (nextProps.manager.group.references && nextProps.manager.group.length == 0)){
            this.removeAll()
            this.setState({ manager : nextProps.manager })
            return
        }

        if(nextProps.manager && nextProps.manager.group && nextProps.manager.group.references){
            this.setState({ manager : nextProps.manager })

            const references = nextProps.manager.group.references.slice()
            for(var i = 0; i<references.length; i++){
 
                var name = references[i].manager.name 
                var desc = references[i].desc 
                if(desc === undefined){
                    desc = 'general'
                }

                var ser = {'name' : name, 'data' : [], 'ref' : nextProps.manager.id}
                if(references[i].betas){
                    for(var k = 0; k<horizons.length; k++){
                        var point = references[i].betas[horizons[k]]
                        ser.data.push(point)
                    }
                    serieses[desc].push(ser)
                    test.push(ser)
                }
            }
            this.updateChart(nextProps.manager, test)
        }
    }
    afterRender(chart){
      this.chart = chart 
    }
    toggle(e, id){
        this.setState({'active' : id})
    }
    render(){
        return (
            <div>
                <BetaChartToolbar 
                    active={this.state.active}
                    toggle={this.toggle.bind(this)}
                />
                <ReactHighcharts 
                    isPureConfig config={config} 
                    ref="chart"
                    callback={this.afterRender.bind(this)}
                >
                </ReactHighcharts>
            </div>
        )
    }
}

export default BetaBarChart;