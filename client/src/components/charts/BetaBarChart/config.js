import _ from 'underscore'
import { ChartConfig, AxisConfig } from '../config.js'
import Constants from '../constants'

class BetaBarChartConfig extends ChartConfig{
    constructor(type, options = {}) {
        super(type, options)
    }
}
export default BetaBarChartConfig;