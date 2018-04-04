import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore'

import { BrowserRouter, Link, Route } from 'react-router-dom';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { SearchBar } from './SearchBar'

const path = require('path')
const classNames = require('classnames');

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
			const relative = path.relative(app.link, location.pathname);
			if(!relative){
				if(app.link == location.pathname){
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
		    		{this.props.apps.map((app) => {
		    			return (
		    			   <MenuNavigationItem 
			    				key={app.id} 
			    				app={app}
				    			active={this.isActive(app)}
			    			/>
			    		)
			    	})}
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

const MenuNavigationItem = ({ app: app, ...props }) => (
      app.isParent === true
      ? ( <MenuDropdownItem 
         	id={app.id}
			key={app.id} 
			item={app} 
			active={props.active}
		/>)
      : (<MenuItem 
         	id={app.id}
	    	key={app.id} 
	    	item={app} 
	    	active={props.active}
	    />)
)


class MenuItem extends React.Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
	}
	render(){
		var className = classNames({
	      'menu-bar-item' : true,
	      'active': this.props.active,
	    });
		return (
		    <div className={className}>
	    		<Link className='menu-bar-link' to={this.props.item.link} onClick={this.props.closeAll}>
	    			<span className='menu-icon'>
	    				<FontAwesomeIcon icon={this.props.item.icon}/> 
	    			</span>
	    			{this.props.item.label} 
	    		</Link>
	    	</div>
		)
	}
}

class MenuDropdownChild extends React.Component {
	render(){
		return (
		     <li className='menu-dropdown-item'>
			    <Link className="menu-dropdown-item-link" 
			    	to={this.props.child.link}
			    >
				{this.props.child.label} 
			    </Link>
			</li>
		  )
	}
}

class MenuDropdownItem extends React.Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
	}
	render(){
		return (
		    <Dropdown id={this.props.id} className="menu-bar-item">
			    <Dropdown.Toggle className="menu-bar-link">
			      	<span className='menu-icon'>
	    				<FontAwesomeIcon icon={this.props.item.icon}/> 
	    			</span>
	    			{this.props.item.label}
			    </Dropdown.Toggle>

			    <Dropdown.Menu className="menu-bar-dropdown-menu">
		    		{this.props.item.children.map((child) => {
				    	return <MenuDropdownChild key={child.name} child={child} onClick={ (e) => this.props.close(e, this.props.item) }/>
				    })}
			    </Dropdown.Menu>
			</Dropdown>
		)
	}
}


