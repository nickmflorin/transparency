import React from 'react';
import _ from 'underscore'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCaretRight from '@fortawesome/fontawesome-free-solid/faCaretRight'
import {Checkbox, DropdownButton} from 'react-bootstrap';

import ReactTable from "react-table";
import "react-table/react-table.css";
import { Utilities } from '../../utilities'
import './toolbar.css'

class StatisticToggleMenuItem extends React.Component {
	render(){
		return (
		   <li className="dropdown-item toolbar-dropdown-item">
			   <a className="dropdown-item-link flex" role="menuitem" tabIndex="-1">
			   		<Checkbox 
			   			defaultChecked={this.props.stat.enabled} 
			   			id={this.props.stat.id}
			   			onChange={(event) => this.props.toggleStat(event, this.props.stat)} 
			   		>
			   		</Checkbox> 
			   		<p> {this.props.stat.Header} </p>
			   </a>
			</li>
		)
	}
}

class StatisticGroupedMenuItem extends React.Component {
	render(){
		return (
	        <li className="dropdown-item toolbar-dropdown-submenu">
                <a className="dropdown-item-link dropdown-toggle" data-toggle="dropdown" style={{display:'flex'}}>
			   		<div style={{display:'flex', width : '100%'}}> 
			   			<p className="toolbar-dropdown-submenu-label"> {this.props.stat.Header} </p>
			   			<div className="toolbar-dropdown-submenu-icon-container">
		    				<FontAwesomeIcon icon={faCaretRight}/> 
		    			</div>
	    			</div>
			   </a>
                <ul className="dropdown-menu">
                	{this.props.stat.children.map((child) => {
                		return <StatisticMenuItem key={child.id} stat={child} toggleStat={this.props.toggleStat}/>
                	})}
                </ul>
            </li>
		)
	}
}

class StatisticMenuItem extends React.Component {
	render(){
		return (
		    <div>
			{this.props.stat && this.props.stat.isParent && 
				<StatisticGroupedMenuItem stat={this.props.stat} toggleStat={this.props.toggleStat}/>
			}
			{this.props.stat && this.props.stat.isChild && 
				<li className="dropdown-item toolbar-dropdown-item">
				   <a className="dropdown-item-link toolbar-dropdown-item-link flex" role="menuitem" tabIndex="-1">
				   		<Checkbox 
				   			defaultChecked={this.props.stat.enabled} 
				   			id={this.props.stat.id}
				   			onChange={(event) => this.props.toggleStat(event, this.props.stat)} 
				   		>
				   		</Checkbox> 
				   		<p> {this.props.stat.Header} </p>
				   </a>
				</li>
			}
			</div>
		)
	}
}

class StatisticsDropdown extends React.Component {
	render(){
	    return(
	      <DropdownButton
	        className="toolbar-dropdown-button"
	        bsStyle={this.props.style}
	        title={this.props.title}
	        key={this.props.id}
	        id={`database-dropdown-${this.props.id}`}
	      >
	      {this.props.stat_config && this.props.stat_config.statistics.map((stat) => {
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