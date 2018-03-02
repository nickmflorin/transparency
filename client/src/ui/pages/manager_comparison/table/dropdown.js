import React from 'react';
import axios from 'axios';
import _ from 'underscore'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCaretRight from '@fortawesome/fontawesome-free-solid/faCaretRight'

import {Checkbox, DropdownButton} from 'react-bootstrap';

import ReactTable from "react-table";
import "react-table/react-table.css";

import Utilities from '../../../../utilities.js'
import './dropdown.css'

class StatisticSubMenuItem extends React.Component {
	render(){
		return(
		   <li className="statistic-dropdown-menu-item">
			   <a className="statistic-dropdown-menu-link flex" role="menuitem" tabIndex="-1">
			   		<Checkbox 
			   			defaultChecked={this.props.child.enabled} 
			   			onChange={(event) => this.props.toggleStat(event, this.props.child)} 
			   			id={this.props.child.id}>
			   		</Checkbox> 
			   		<p> {this.props.child.header} </p>
			   </a>
			</li>
		)
	}
}

class StatisticGroupedMenuItem extends React.Component {
	render(){
		return (
	        <li className="statistic-dropdown-menu-item statistic-dropdown-submenu">
                <a className="statistic-dropdown-menu-link dropdown-toggle" data-toggle="dropdown" style={{display:'flex'}}>
			   		<p> {this.props.stat.header} 
		    			<span style={{flexGrow:100, marginLeft: 90}}>
		    				<FontAwesomeIcon icon={faCaretRight}/> 
		    			</span>
	    			</p>
			   </a>

                <ul className="dropdown-menu">
                	{this.props.stat && this.props.stat.children && this.props.stat.children.map((child) => {
                		return(
                		    <StatisticSubMenuItem 
                		    	key={child.id} 
                		    	stat={this.props.stat} 
                		    	child={child} 
                		    	toggleStat={this.props.toggleStat}
                		    />
                		)
                	})}
                </ul>
            </li>
		)
	}
}

class StatisticToggleMenuItem extends React.Component {
	render(){
		return (
		   <li className="statistic-dropdown-menu-item">
			   <a className="statistic-dropdown-menu-link flex" role="menuitem" tabIndex="-1">
			   		<Checkbox 
			   			defaultChecked={this.props.stat.enabled} 
			   			id={this.props.stat.id}
			   			onChange={(event) => this.props.toggleStat(event, this.props.stat)} 
			   		>
			   		</Checkbox> 
			   		<p> {this.props.stat.header} </p>
			   </a>
			</li>
		)
	}
}

class StatisticMenuItem extends React.Component {
	generateItem(stat){
		if(stat.children){
			return(
			   <StatisticGroupedMenuItem 
			   		stat={stat} 
			   		toggleStat={this.props.toggleStat}
			   	/>
			)
		}
		return(
		   <StatisticToggleMenuItem 
		   		stat={stat} 
		   		toggleStat={this.props.toggleStat}
		   	/>
		)
	}
	render(){
		var item = this.generateItem(this.props.stat)
		return item
	}
}


class StatisticsDropdown extends React.Component {
	render(){
	    return(
	      <DropdownButton
	        className="query-table-dropdown-button"
	        bsStyle={this.props.style}
	        title={this.props.title}
	        key={this.props.id}
	        id={`database-dropdown-${this.props.id}`}
	      >
	      {this.props.stats.map((stat) => {
			return(
	            <StatisticMenuItem 
	            	key={stat.id} 
	            	stat={stat}
	            	toggleStat={this.props.toggleStat}
				/>
	        )
		  })}
	      </DropdownButton>
	    )
	}
}

export default StatisticsDropdown;