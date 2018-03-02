import React from 'react';
import _ from 'underscore'

import MenuConfiguration from './config.js'
import SearchBar from './search.js'
import { MenuItem, DropdownItem } from './items.js'
import './menu.css'

class MenuSearchNavigation extends React.Component {
  constructor(props){
    super(props)
    this.state = {'showResults' : false}
  }
  render(){
    return (
        <div className='menu-search-navigation'>
          <SearchBar 
            buttons={this.props.buttons}
            showResults={this.state.showResults} 
            onSelect={this.props.onSelect}
          />
        </div>
    )
  }
}

class MenuNavigation extends React.Component {
	constructor(props){
		super(props)

		var opened = {}
		_.each(props.menus, function(menu){
			if(menu.children){
				opened[menu.name] = false;
			}
		})

		this.state = {
			'opened' : opened
		}
	}
	createItem(menu, i){
		if(!menu.children){
			return <MenuItem key={menu.name} index={i} item={menu} closeOthers={this.closeOthers}/>
		}
		var show = this.props.dropdown_states[menu.name] == 'opened'
		return <DropdownItem key={menu.name} index={i} item={menu} show={show} closeOthers={this.closeOthers} />
	}
	// Called When Non Dropdown Item Clicked
	closeAll(e){
		var opened = this.state.opened
		Object.keys(opened).forEach(function(id){
			opened[id] = false;
		})
		this.setState({'opened' : opened})
	}
	toggle(e, item){
		var opened = this.state.opened
		if(opened[item.name]){
			this.close(e, item)
		}
		else{
			this.open(e, item)
		}
	}
	close(e, item){
		var opened = this.state.opened
		opened[item.name] = false;
		this.setState({'opened' : opened})
	}
	open(e, item){
		this.closeAll(e)

		var opened = this.state.opened
		opened[item.name] = true;
		this.setState({'opened' : opened})
	}
	render(){
		return (
	    	<div className='menu-navigation'>
	    		{this.props.menus.map((menu, i) => {
	    			if(!menu.children){
	    				return(
	    				    <MenuItem 
	    				    	key={menu.name} 
	    				    	index={i} 
	    				    	item={menu} 
	    				    	closeAll={this.closeAll.bind(this)}
	    				    />
	    				) 
	    			}
		    		return (
		    		    <DropdownItem 
			    			key={menu.name} 
			    			index={i} 
			    			item={menu} 
			    			opened={this.state.opened[menu.name]} 
			    			close={this.close.bind(this)} 
			    			toggle={this.toggle.bind(this)} 
			    		/>
		    		)
		    	})}
			</div>
		)
	}
}

// onSelect and Buttons Optionally Passed In Depending on Desired Use
class MenuBar extends React.Component {
	render(){
		return (
		    <div className='menu-bar'>
		    	<MenuNavigation 
		    		menus={MenuConfiguration} 
		    	/>
		    	<MenuSearchNavigation 
		    		onSelect={this.props.onSelect}
		    		buttons={this.props.buttons}
		    	/>
			</div>
		)
	}
}

export default MenuBar;