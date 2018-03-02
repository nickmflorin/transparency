import _ from 'underscore'
import { ChartConfig, AxisConfig } from '../config.js'

class Config extends ChartConfig{
    constructor(kwargs = {}) {
        const defaultKwargs = { title : 'Manager Cumulative Returns', type : 'column'}
        kwargs = _.extend(kwargs, defaultKwargs)
        super(kwargs)

        this.yAxis = new AxisConfig({ plotLines : [{ color: 'black', dashStyle: 'solid', width: 1, value: 0 }] })
        this.xAxis = new AxisConfig()

        this.yAxis.min = 0
        this.yAxis.title = {
            text: 'Return (%)',
            align: 'high'
        }
        this.yAxis.labels = {
            overflow: 'justify'
        }
    }
}
export default Config;