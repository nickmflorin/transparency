import _ from 'underscore'
import { ChartConfig, AxisConfig } from '../config.js'
import Constants from '../constants'

export class HistoricalExposureChartConfig extends ChartConfig{
    constructor(type, options = {}) {
        super(type, options)

        this.xAxis['type'] = 'datetime'
        this.xAxis['dateTimeLabelFormats'] =  {
           second: '%H:%M:%S',
           minute: '%H:%M',
           hour: '%H:%M',
           day: '%e. %b',
           week: '%e. %b',
           month: '%b-%Y', //month formatted as month only
           year: '%Y'
        }

        this.yAxis['stackLabels'] = {enabled: false}

        this.plotOptions['column'] = {
            borderWidth:0,
            stacking: 'normal',
            dataLabels: {enabled: false}
        }
    }
}
