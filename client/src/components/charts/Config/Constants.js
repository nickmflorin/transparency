import colorbrewer from 'colorbrewer'

export const Colors = {
    long : 'rgba(208,29,27,0.65)',
    short : 'rgba(104,167,32,0.65)',
    gross : 'rgba(76, 131, 193, 0.8)',
    net : 'rgba(255, 152, 0, 0.8)',
    peer : '#3DB987',
    benchmark : '#0e90f6',
}

export const Formals = {
    'long' : 'Long Exposure',
    'short' : 'Short Exposure',
    'gross' : 'Gross Exposure',
    'net' : 'Net Exposure',
}

export const Style = {
    Title : {
        color: '#454545',
        fontSize: '11px',
        fontWeight: '300',
        fontFamily: 'Helvetica'
    },
    Tooltip : {
        padding: 6,
        distance: 10,
        borderRadius: 1,
        backgroundColor: 'rgba(257,257,257,0.35)',
    },
	AreaChart : {
        lineColor: '#EFEFEF',
        lineWidth: 0.5,
        fillOpacity : 0.5,
        marker : {
            symbol : 'circle',
            radius: 2,
            lineWidth: 1,
            lineColor: '#FFF'
        }
    },
    Label : {
        color: '#263238',
        fontSize: '10px',
        fontWeight: '300',
        fontFamily: 'Helvetica',
        whiteSpace: 'nowrap',
    },
    Legend : {
        color: '#5e676c',
        fontSize: '10px',
        fontWeight: '300',
        fontFamily: 'Helvetica'
    }
}

