import colorbrewer from 'colorbrewer'

export const ChartColors = {
    long : 'rgba(208,29,27,0.65)',
    short : 'rgba(104,167,32,0.65)',
    total : 'rgba(115,115,115,0.85)',
    net : 'rgba(15,15,15,0.65)',
    peer : '#3DB987',
    benchmark : '#0e90f6',

    series : [
        '#ff6383','#50aded', '#fed36b', '#62c7c8', '#a579ff', 
        '#f44336', '#FFE761', '#3DB987', '#ff9800', '#3D5A80', 
        '#E0FBFC', '#293241', '#fccde5', '#d9d9d9', '#bc80bd', 
        '#ccebc5', '#ffed6f', '#195da1', "#F1684E", "#85C8DD", 
        "#D3E0E2", "#E9F6F5", "#EBCBAE", "#18587A", "#FCA7A7",
         "#359768", "#FF5252", "#B2EBF2", "#FFE495", "#FFC97B"
    ],
}

export const TitleStyle = {
	color: '#263238',
    fontSize: '11px',
    fontWeight: '400',
    fontFamily: 'Helvetica'
}

export const LabelStyle = {
	color: '#263238',
    fontSize: '10px',
    fontWeight: '300',
    fontFamily: 'Helvetica',
    whiteSpace: 'nowrap',
}

export const LegendStyle = {
	color: '#5e676c',
    fontSize: '10px',
    fontWeight: '300',
    fontFamily: 'Helvetica'
}

export const ChartFormals = {
    'long' : 'Long Exposure',
    'short' : 'Short Exposure',
    'gross' : 'Gross Exposure',
    'net' : 'Net Exposure',
}

export const Constants = {
	Formals : ChartFormals,
	Style : {
		Label : LabelStyle,
		Title : TitleStyle,
		Legend : LegendStyle,
	},
	Colors : ChartColors,
}

export default Constants;