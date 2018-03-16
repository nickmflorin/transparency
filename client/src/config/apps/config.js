import _ from 'underscore'
import { Disabled } from './disabled'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import faHome from '@fortawesome/fontawesome-free-solid/faHome'
import faCompress from '@fortawesome/fontawesome-free-solid/faCompress'
import faChartArea from '@fortawesome/fontawesome-free-solid/faChartArea'
import faChartPie from '@fortawesome/fontawesome-free-solid/faChartPie'
import faDatabase from '@fortawesome/fontawesome-free-solid/faDatabase'

class App {
	constructor(kwargs){
		this.id = kwargs.id
		this.name = kwargs.name 
		this.label = kwargs.label 
		this.link = kwargs.link 
		this.icon = kwargs.icon 

		this.isParent = false;
		this.isChild = true 
	}
	isDisabled(Disabled){
		return _.contains(Disabled, this.id)
	}
}

class ParentApp {
	constructor(kwargs){
		this.id = kwargs.id
		this.name = kwargs.name 
		this.label = kwargs.label 
		this.link = kwargs.link 
		this.icon = kwargs.icon 

		this.children = kwargs.children || []
		this.isParent = true;
		this.isChild = false 
	}
	isDisabled(Disabled){
		return _.contains(Disabled, this.id)
	}
	filter(disabled){
		var children = []
		for(var i = 0; i<this.children.length; i++){
			var disabled = this.children[i].isDisabled(Disabled)
			if(!disabled){
				children.push(this.children[i])
			}
		}
		this.children = children
	}
}

const AppLibrary = [
	new App({id : 'home', name : 'home', label : 'Manager Overview', link : '/managers', icon : faHome}),
	new App({id : 'data', name : 'data', label : 'Data', link : '/data', icon : faDatabase}),
	new ParentApp({id : 'analysis', name : 'analysis', label : 'Analysis', icon : faChartArea, 
		'children' : [
			new App({id : 'manager_comparison','name' : 'manager_comparison', 'label' : 'Manager Comparison', 'link' : '/mgrcomp'}),
			new App({id : 'daily_metrics','name' : 'daily_metrics', 'label' : 'Daily Metrics', 'link' : '/dailymet'}),
			new App({id : 'daily_platform','name' : 'daily_platform', 'label' : 'Daily Platform', 'link' : '/dailyplat'}),
		]
	}),
	new ParentApp({id : 'benchmarks','name' : 'benchmarks', 'label' : 'Benchmarks', 'icon' : faCompress, 
		'children' : [
			new App({id : 'indices','name' : 'indices', 'label' : 'Indices', 'link' : '/indices'}),
			new App({id : 'index_screens','name' : 'index_screens', 'label' : 'Index Screens', 'link' : '/indscreen'}),
			new App({id : 'rcg_indices','name' : 'rcg_indices', 'label' : 'RCG Indices', 'link' : '/rcgind'}),
		]
	}),
	new ParentApp({id : 'aam','name' : 'aam', 'label' : 'Asset Alloc', 'icon' : faChartPie, 
		'children' : [
			new App({id : 'aam','name' : 'aam', 'label' : 'AAM', 'link' : '/aam'}),
			new App({id : 'aam_dashboard','name' : 'aam_dashboard', 'label' : 'Asset Alloc. Dashboard', 'link' : '/aamdash'}),
		]
	}),
]

const AppsConfiguration_ = function(Disabled){
    var config = []
    for(var i = 0; i<AppLibrary.length; i++){
    	var app = AppLibrary[i]
    	if(app.isParent){
    		if(!app.isDisabled(Disabled)){
    			app.filter(Disabled)
    			config.push(app)
    		}
    	}
    	else{
    		if(!app.isDisabled(Disabled)){
    			config.push(app)
    		}
    	}
    }
    return config 
}

export const AppsConfiguration = AppsConfiguration_(Disabled)
