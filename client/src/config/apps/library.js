import { App, ParentApp } from './models'

import faHome from '@fortawesome/fontawesome-free-solid/faHome'
import faCompress from '@fortawesome/fontawesome-free-solid/faCompress'
import faChartArea from '@fortawesome/fontawesome-free-solid/faChartArea'
import faDatabase from '@fortawesome/fontawesome-free-solid/faDatabase'

import faChartLine from '@fortawesome/fontawesome-free-solid/faChartLine'
import faChartPie from '@fortawesome/fontawesome-free-solid/faChartPie'
import faClipboard from '@fortawesome/fontawesome-free-regular/faClipboard'
import faBalanceScale from '@fortawesome/fontawesome-free-solid/faBalanceScale'

export const AppLibrary = [
	new App({id : 'managers', name : 'managers', label : 'Manager Overview', link : '/managers', icon : faHome}),
	new App({id : 'data', name : 'data', label : 'Data', link : '/data', icon : faDatabase}),
	new ParentApp({id : 'analysis', name : 'analysis', label : 'Analysis', link : '/analysis', icon : faChartArea, 
		'children' : [
			new App({id : 'manager_comparison','name' : 'manager_comparison', 'label' : 'Manager Comparison', 'link' : '/mgrcomp'}),
			new App({id : 'daily_metrics','name' : 'daily_metrics', 'label' : 'Daily Metrics', 'link' : '/dailymet'}),
			new App({id : 'daily_platform','name' : 'daily_platform', 'label' : 'Daily Platform', 'link' : '/dailyplat'}),
		]
	}),
	new ParentApp({id : 'benchmarks','name' : 'benchmarks', 'label' : 'Benchmarks', link : '/benchmarks', 'icon' : faCompress, 
		'children' : [
			new App({id : 'indices','name' : 'indices', 'label' : 'Indices', 'link' : '/indices'}),
			new App({id : 'index_screens','name' : 'index_screens', 'label' : 'Index Screens', 'link' : '/indscreen'}),
			new App({id : 'rcg_indices','name' : 'rcg_indices', 'label' : 'RCG Indices', 'link' : '/rcgind'}),
		]
	}),
	new ParentApp({id : 'aam','name' : 'aam', 'label' : 'Asset Alloc', link : '/asset', 'icon' : faChartPie, 
		'children' : [
			new App({id : 'aam','name' : 'aam', 'label' : 'AAM', 'link' : '/aam'}),
			new App({id : 'aam_dashboard','name' : 'aam_dashboard', 'label' : 'Asset Alloc. Dashboard', 'link' : '/aamdash'}),
		]
	}),
]

export const ManagerAppLibrary = [
    new ParentApp({'id' : 'perf', 'label' : 'Performance', 'link' : '/managers/perf', icon : faChartLine, children : [
    	new App({'id' : 'historical_perf', 'label' : 'Historical Returns', 'link' : '/hist'}),
    	new App({'id' : 'attribution_perf', 'label' : 'Performance Attr', 'link' : '/attr'}),
    ]}),
    new ParentApp({'id' : 'exp', 'label' : 'Exposures', 'link' : '/managers/exp', icon : faChartPie, children : [
    	new App({'id' : 'historical_exp', 'label' : 'Historical', 'link' : '/hist'}),
    	new App({'id' : 'snapshot_exp', 'label' : 'Snapshot', 'link' : '/snap'}),
    	new App({'id' : 'explorer_exp', 'label' : 'Explorer', 'link' : '/explore'}),
    ]}),
    new ParentApp({'id' : 'pos', 'label' : 'Positions', 'link' : '/managers/pos', icon : faClipboard, children : [
    	new App({'id' : 'historical_pos', 'label' : 'Historical', 'link' : '/hist'}),
    	new App({'id' : 'top_pos', 'label' : 'Top', 'link' : '/top/'}),
    	new App({'id' : 'proxy_pos', 'label' : 'Proxy', 'link' : '/proxy'}),
    ]}),
    new App({'id' : 'quant', 'label' : 'Quantitative', 'link' : '/managers/quant', icon : faBalanceScale}),
]
