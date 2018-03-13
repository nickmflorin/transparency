import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import faHome from '@fortawesome/fontawesome-free-solid/faHome'
import faCompress from '@fortawesome/fontawesome-free-solid/faCompress'
import faChartArea from '@fortawesome/fontawesome-free-solid/faChartArea'
import faChartPie from '@fortawesome/fontawesome-free-solid/faChartPie'
import faDatabase from '@fortawesome/fontawesome-free-solid/faDatabase'

export const MenuConfiguration = [
	{'name' : 'manager', 'label' : 'Manager Overview', 'link' : '/', 'icon' : faHome},
	{'name' : 'data', 'label' : 'Data', 'link' : '/data', 'icon' : faDatabase},
	{'name' : 'analysis', 'label' : 'Analysis', 'icon' : faChartArea, 
		'children' : [
			{'name' : 'manager_comparison', 'label' : 'Manager Comparison', 'link' : '/mgrcomp'},
			{'name' : 'daily_metrics', 'label' : 'Daily Metrics', 'link' : '/dailymet'},
			{'name' : 'daily_platform', 'label' : 'Daily Platform', 'link' : '/dailyplat'},
		]
	},
	{'name' : 'benchmarks', 'label' : 'Benchmarks', 'icon' : faCompress, 
		'children' : [
			{'name' : 'indices', 'label' : 'Indices', 'link' : '/indices'},
			{'name' : 'index_screens', 'label' : 'Index Screens', 'link' : '/indscreen'},
			{'name' : 'rcg_indices', 'label' : 'RCG Indices', 'link' : '/rcgind'},
		]
	},
	{'name' : 'aam', 'label' : 'Asset Alloc', 'icon' : faChartPie, 
		'children' : [
			{'name' : 'aam', 'label' : 'AAM', 'link' : '/aam'},
			{'name' : 'aam_dashboard', 'label' : 'Asset Alloc. Dashboard', 'link' : '/aamdash'},
		]
	},
]

export default MenuConfiguration