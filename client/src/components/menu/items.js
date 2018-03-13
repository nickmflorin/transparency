import React from 'react';
import _ from 'underscore'

import { BrowserRouter, Link, Route } from 'react-router-dom';
import { DropdownButton, ButtonToolbar, Navbar, Nav, NavItem, FormGroup, NavDropdown, FormControl, Button } from 'react-bootstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import './menu.css'

export class MenuItem extends React.Component {
	render(){
		return (
    	<div className='menu-bar-item'>
    		<Link className='menu-bar-link' to={this.props.item.link} onClick={this.props.closeAll} >
    			<span className='menu-icon'>
    				<FontAwesomeIcon icon={this.props.item.icon}/> 
    			</span>
    			{this.props.item.label} 
    		</Link>
		</div>
		)
	}
}

export class DropdownChild extends React.Component {
	render(){
		return (
		     <li className='dropdown-item menu-dropdown-item'>
			    <Link className="dropdown-item-link menu-dropdown-item-link" 
			    	to={this.props.child.link}
			    	onClick={this.props.onClick}
			    >
				{this.props.child.label} 
			    </Link>
			</li>
		  )
	}
}

export class DropdownItem extends React.Component {
	constructor(){
		super()
		this.state = {'show' : false}
	}
	render(){
		return (
		    <div className='menu-bar-dropdown'>
		     	<a onClick={ (e) => this.props.toggle(e, this.props.item) } className='menu-bar-link'>
		     		<span className='menu-icon'>
	    				<FontAwesomeIcon icon={this.props.item.icon}/> 
	    			</span>
			     	{this.props.item.label} 
			     	<span className="caret"></span>
			    </a>
			    {this.props.opened && 
			     	<ul role="menu" className="dropdown-menu menu-bar-dropdown-menu">
				     	{this.props.item.children.map((child) => {
					    	return <DropdownChild key={child.name} child={child} onClick={ (e) => this.props.close(e, this.props.item) }/>
					    })}
					</ul>
				}
			</div>
		)
	}
}

export default {MenuItem, DropdownItem}
         