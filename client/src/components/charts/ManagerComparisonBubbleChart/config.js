import _ from 'underscore'
import { ChartConfig, AxisConfig, Constants } from '../config.js'

class ManagerComparisonChartConfig extends ChartConfig{
    constructor(type, options = {}) {
        super(type, options)
        this.series = [{ data : [], name : 'Managers'}]
        this.tooltip.enabled = false
        this.plotLines = [{ color: 'black', dashStyle: 'solid', width: 1, value: 0 }]
    }
}
export default ManagerComparisonChartConfig;