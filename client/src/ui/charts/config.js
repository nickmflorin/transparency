import _ from 'underscore'

export var Constants = {
    PeerColor : '#3DB987',
    BenchmarkColor : '#0e90f6'
}

export class AxisConfig extends Object{
    constructor(kwargs = {}){
        super()
        // this.categories = []

        this.startOnTick = true
        this.endOnTick = true

        this.showLastLabel = true
        this.minorTicks = true

        this.gridLineWidth = 1
        this.minorTickLength = 4
        this.minorTickPosition = 'outside'

        this.plotLines = kwargs.plotLines || []
        this.labels = {
            step: 1,
            style: {
                color: '#696969',
                fontSize: '10px',
                fontWeight: '300',
                fontFamily: 'Helvetica'
            },
        }
        this.title = {
            text: null
        }
    }
}

export class ChartConfig{
    constructor(kwargs) {        
        this.series = []
        
        this.chart = {
            type : kwargs.type
        }
        if(!this.chart.type) throw new Error('Must Specify Chart Type')
        
        if(kwargs.height){
            this.chart.height = kwargs.height
        }

        this.credits = {'enabled': false}
        this.colors = [
            '#ff6383','#50aded', '#fed36b', '#62c7c8', '#a579ff', '#f44336', '#FFE761', '#3DB987', '#ff9800', '#3D5A80', '#E0FBFC', '#293241', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f', '#195da1', "#F1684E", "#85C8DD", "#D3E0E2", "#E9F6F5", "#EBCBAE", "#18587A", "#FCA7A7", "#359768", "#FF5252", "#B2EBF2", "#FFE495", "#FFC97B"
        ]
        var text = kwargs.title || null
        this.title = {
            text : text,
            style : {
                color: '#696969',
                fontSize: '12px',
                fontWeight: '300',
                fontFamily: 'Helvetica'
            }
        }
        
        this.legend = {
            itemStyle: {
                color: '#696969',
                fontSize: '10px',
                fontWeight: '300',
                fontFamily: 'Helvetica'
            }
        }
    }
}
export default { ChartConfig, AxisConfig, Constants }