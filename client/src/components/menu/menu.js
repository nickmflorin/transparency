import React from 'react';
import { connect } from 'react-redux'
import _ from 'underscore'
import PropTypes from 'prop-types';

import { AppsConfiguration } from '../../config'

import SearchBar from '../search/search.js'
import { MenuItem, DropdownItem } from './items.js'
import './menu.css'

const MenuNavigationItem = ({ app: app, ...props }) => (
      app.isParent === true
      ? (<DropdownItem 
			key={app.id} 
			item={app} 
			opened={props.opened} 
			close={props.close} 
			toggle={props.toggle} 
		/>)
      : (<MenuItem 
	    	key={app.id} 
	    	item={app} 
	    	closeAll={props.closeAll}
	    />)
)

class MenuNavigation extends React.Component {
	constructor(props){
		super(props)
		this.state = {'opened' : {}}
	}
	static propTypes = {
	    config: PropTypes.array.isRequired,
	};
	componentWillReceiveProps(props){
		if(props.config){
			var opened = this.state.opened 
			for(var i = 0; i<props.config.length; i++){
				var app = props.config[i]
				if(this.state.opened[app.id] === undefined){
					this.state.opened[app.id] = false;
				}
			}
		}
	}
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
	    		{this.props.config.map((app) => {
	    			return (
	    			   <MenuNavigationItem 
		    				key={app.id} 
		    				app={app}
		    				opened={this.state.opened[app.id]} 
			    			close={this.close.bind(this)} 
			    			toggle={this.toggle.bind(this)} 
			    			closeAll={this.closeAll.bind(this)}
		    			/>
		    		)
		    	})}
			</div>
		)
	}
}

class MenuBar extends React.Component {
	constructor(props){
		super(props)
	}
	render(){
		return (
		    <div className='menu-bar'>
		    	<MenuNavigation config={AppsConfiguration} />
		    	<div className='menu-search-navigation'>
		          <SearchBar 
		            onSelect={this.props.onSelect}
		            {...this.props}
		          />
		        </div>
			</div>
		)
	}
}
const mapStateToProps = (state, ownProps) => {  
  return {
  	managers: state.mgrs.managers,
  };
};

export default connect(mapStateToProps)(MenuBar);  


