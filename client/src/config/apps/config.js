import _ from 'underscore'
import { AppLibrary, ManagerAppLibrary } from './library'

function AppsConfiguration(library, disabled){
    var config = []
    for(var i = 0; i<library.length; i++){
    	var app = library[i]

    	if(app.isParent){
    		if(!app.isDisabled(disabled)){
    			app.filter(disabled)
    			config.push(app)
    		}
    	}
    	else{
    		if(!app.isDisabled(disabled)){
    			config.push(app)
    		}
    	}
    }
    return config 
}

export const Configuration = function(disabled = { manager : [], app : []}){
	disabled.app = disabled.app || []
	disabled.manager = disabled.manager || []

	return {
		app : new AppsConfiguration(AppLibrary, disabled.app),
		manager : new AppsConfiguration(ManagerAppLibrary, disabled.manager)
	}
}
