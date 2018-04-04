import { Style } from '../Constants'
import { Colors } from '../../../utilities'

class AxisConfig {
    constructor(title = null){
        this.title = {text: title}

        this.startOnTick = true 
        this.endOnTick = true 

        this.showLastLabel = false
        this.minorTicks = true
        this.gridLineWidth = 1
        this.minorTickLength = 4
        this.minorTickPosition = 'outside'

        this.title = {
            align : 'high',
            style : Style.Label
        }

        this.labels = {
            step: 1, 
            overflow : 'justify',
            align: 'center',   
            style: Style.Label
        }
        this.maxPadding = 0.2
    }
    setTitle(title){
        this.title.text = title 
    }
    dated(){
        this.type = 'datetime'
        this.dateTimeLabelFormats =  {
           month: '%b-%Y', 
           year: '%Y'
        }
    }
}

export default AxisConfig;