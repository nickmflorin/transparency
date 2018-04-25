import { Style } from './Constants'
import AxisConfig from './Axis'
import Tooltip from './Tooltip'

import { Colors } from '../../../utilities'

class ChartConfig{
    // Options: title, zoomType, alpha, height
    constructor(type, options = {}) {        
        this.series = []
        this.credits = {enabled: false}
        this.exporting = { enabled: false }

        const alpha = options.alpha || 0.6
        this.colors = Colors.fadedSeries(alpha)

        this.xAxis = new AxisConfig()
        this.yAxis = new AxisConfig()
        this.tooltip = Tooltip

        const zoomType = options.zoomType || 'xy'
        this.chart = {
            height : options.height || undefined,
            type : type,
            zoomType: zoomType, 
            backgroundColor: null
        }

        this.title = {
            text : options.title || "",
            style : Style.Title
        }
        this.legend = {
            itemStyle: Style.Legend
        }

        this.plotOptions = {
            series: {
               groupPadding: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                    style : Style.Legend
                },
                animation: true
            }
        }
    }
}

export class BubbleChartConfig extends ChartConfig{
    constructor(options = {}) {        
        super('bubble', options)
        this.tooltip.enabled = false
    }
}

export class BarChartConfig extends ChartConfig{
    constructor(options = {}) {        
        super('bar', options)

        this.plotOptions['column'] = {
            borderWidth : 0,
            stacking: 'normal',
            dataLabels: {enabled: false}
        }
    }
}

export class ColumnChartConfig extends ChartConfig{
    constructor(options = {}) {        
        super('column', options)

        this.plotOptions['column'] = {
            borderWidth : 0,
            stacking: 'normal',
            dataLabels: {enabled: false}
        }
    }
}

export class PieChartConfig extends ChartConfig{
    constructor(options = {}) {        
        super('pie', options)
        this.plotOptions['pie'] = {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            }
        }
    }
}

export class AreaChartConfig extends ChartConfig{
    constructor(options = {}) {        
        super('area', options)

        this.plotOptions['area'] = {
            fillOpacity : Style.AreaChart.fillOpacity,
            stacking: 'area',
            lineColor: Style.AreaChart.lineColor,
            lineWidth: Style.AreaChart.lineWidth,
            marker: Style.AreaChart.marker,
        }
    }
}




