import _ from 'underscore'

export class App {
	constructor(kwargs){
		this.id = kwargs.id
		this.name = kwargs.name 
		this.label = kwargs.label 
		this.link = kwargs.link 
		this.icon = kwargs.icon 

		this.isParent = false;
		this.isChild = true 
	}
	isDisabled(disabled){
		return _.contains(disabled, this.id)
	}
}

export class ParentApp {
	constructor(kwargs){
		this.id = kwargs.id
		this.name = kwargs.name 
		this.label = kwargs.label 
		this.link = kwargs.link 
		this.icon = kwargs.icon 

		this.children = kwargs.children || []

		var self = this 
		_.each(this.children, function(child){
			child.parent = self 
			child.link = self.link + child.link
		})

		this.isParent = true;
		this.isChild = false 
	}
	isDisabled(disabled){
		return _.contains(disabled, this.id)
	}
	filter(disabled){
		this.children = _.filter(this.children, function(child){
			return !child.isDisabled(disabled)
		})
	}
}
