import React from 'react';
import axios from 'axios';
import _ from 'underscore'

import {Checkbox, DropdownButton} from 'react-bootstrap';
import ReactTable from "react-table";
import "react-table/react-table.css";

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCaretRight from '@fortawesome/fontawesome-free-solid/faCaretRight'

import { Utilities } from '../../utilities'
import './toolbar.css'

class ListMenuItem extends React.Component {
	selected(event){
		this.props.onToggle()
		this.props.onLoad(event, this.props.list)
	}
	render(){
		return (
		   <li className="dropdown-item toolbar-dropdown-item">
			   <a className="dropdown-item-link flex" role="menuitem" tabIndex="-1" onClick={this.selected.bind(this)} >
			   		<p> {this.props.list.name} </p>
			   </a>
			</li>
		)
	}
}

class ListsDropdown extends React.Component {
	constructor(props){
		super(props)
		this.state = { opened : false }
	}
	toggle(){
		var state = this.state.opened
		this.setState({ opened : !state })
	}
	render(){
	    return(
	      <DropdownButton
	      	onToggle={this.toggle.bind(this)}
        	open={this.state.opened}
	        className="toolbar-dropdown-button"
	        bsStyle={this.props.style}
	        title={this.props.title}
	        key={this.props.id}
	        id={`database-dropdown-${this.props.id}`}
	      >
	      {this.props.lists && this.props.lists.map((list, i) => {
			return(
	            <ListMenuItem 
	            	key={list.id} 
	            	list={list}
	            	onToggle={this.toggle.bind(this)}
	            	onLoad={this.props.onLoad}
				/>
	        )
		  })}
	      </DropdownButton>
	    )
	}
}

export default ListsDropdown;