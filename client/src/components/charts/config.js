import _ from 'underscore'
import Constants from './constants'

export class AxisConfig {
    constructor(title = null){
        this.title = {text: title}

        this.startOnTick = true
        this.endOnTick = true
        this.showLastLabel = true
        this.minorTicks = true
        this.gridLineWidth = 1
        this.minorTickLength = 4
        this.minorTickPosition = 'outside'

        this.title = {
            align : 'high',
            style : Constants.Style.Label
        }

        this.labels = {
            step: 1, 
            overflow : 'justify',
            align: 'center',   
            style: Constants.Style.Label
        }
        this.maxPadding = 0.2
    }
}

export class ChartConfig{
    constructor(type, options = {}) {        
        this.series = []
        this.credits = {enabled: false}
        this.exporting = { enabled: false }

        this.chart = {
            height : options.height || 400,
            type : type,
            zoomType: 'xy', 
            backgroundColor: null
        }

        this.xAxis = new AxisConfig()
        this.yAxis = new AxisConfig()

        var pointFormat = '<tr class="tooltip-container">'
        pointFormat += '<td>'
        pointFormat += '<i style="color: {series.color}" class="fa fa-circle"></i>'
        pointFormat += '<span class="tooltip-name"> {series.name} </span>'
        pointFormat += '<span class="tooltip-value"> {point.y} </span>'
        pointFormat += '</td>'
        pointFormat += '</tr>'

        this.tooltip  = {
            shared: false,
            useHTML: true,
            padding: 6,
            distance: 10,
            borderRadius: 1,
            backgroundColor: 'rgba(257,257,257,0.35)',
            pointFormat: pointFormat,
            valueDecimals: 5
        }

        this.title = {
            text : options.title || "",
            style : Constants.Style.Title
        }
        this.legend = {
            itemStyle: Constants.Style.Legend
        }

        this.plotOptions = {
            series: {
               groupPadding: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                    style : Constants.Style.Legend
                }
            }
        }
    }
}
export default { ChartConfig, AxisConfig, Constants }