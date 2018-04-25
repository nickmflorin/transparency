import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore'

import { BrowserRouter, Link, Route } from 'react-router-dom';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { MenuLink } from '../elements'
import { MenuDropdown } from '../dropdowns'

import { SearchBar } from './SearchBar'

import { AppConfig } from '../../config'

const path = require('path')
const classNames = require('classnames');

const MenuItem = (props) => {
	var className = classNames({
      'menu-item' : true,
      'active': props.active,
    });

	return (
		<div className={className}>
	    	<MenuLink 
	    		path={props.app.path} 
	    		onClick={props.closeAll}
	    		icon={props.app.icon}
	    		label={props.app.label} 
	    	/>
	    </div>
	)
}

const CreateMenuItem = ({ app: app, ...props }) => (
      app.location.menu.dropdown === true
      ? ( <MenuDropdown 
         	id={app.id}
			key={app.id} 
			app={app} 
			active={props.active}
		/>)
      : (<MenuItem 
         	id={app.id}
	    	key={app.id} 
	    	app={app} 
	    	active={props.active}
	    />)
)

export class MenuBar extends React.Component {
	static propTypes = {
		history: PropTypes.object, // Location Not Available Once Rendering
		selectManager: PropTypes.func.isRequired,
	    searchManager: PropTypes.func.isRequired,
		apps: PropTypes.array.isRequired,
	    search_results: PropTypes.array.isRequired,
	};
	isActive(app){
		const location = this.props.history.location
		if(location && location.pathname){
			const relative = path.relative(app.path, location.pathname);
			if(!relative){
				if(app.path == location.pathname){
					return true 
				}
				return false 
			}
			var child = !!relative && !relative.startsWith('..') && !path.isAbsolute(relative);
			return child 
		}
		return false 
	}
	render(){
		return (
		    <div className='menu-bar'>
		    	<div className='menu-navigation'>
		    		{this.props.apps.map((app) => (
		    			app.location.menu.enabled &&
		    			   <CreateMenuItem 
			    				key={app.id} 
			    				app={app}
				    			active={this.isActive(app)}
			    			/>
			    	))}
				</div>
		    	<div className='menu-search-navigation'>
		          <SearchBar 
		          	search_results={this.props.search_results}
		          	selectManager={this.props.selectManager}
		          	searchManager={this.props.searchManager}
		          />
		        </div>
			</div>
		)
	}
}









