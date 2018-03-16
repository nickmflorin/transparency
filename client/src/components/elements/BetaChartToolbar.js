import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore'
import moment from 'moment'

import { ButtonToolbar } from 'react-bootstrap';
import { CSVLink, CSVDownload } from 'react-csv';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay'
import faEraser from '@fortawesome/fontawesome-free-solid/faEraser'
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload'

import './toolbar.css'

class BetaChartToolbarToggle extends React.Component {	
	render(){
		const className = "btn btn-default toolbar-button chart-toolbar-button"
		const active = this.props.active == this.props.id

		const class_ = (active ? (className + " " + 'active') : className)
		return (
		   <div className="toolbar-button-container" style={{marginRight:0}}>
				 <a className={class_} onClick={(event) => this.props.toggle(event, this.props.id)}> 
			      {this.props.label} 
			    </a>
			</div>
		)
	}
}

class BetaChartToolbar extends React.Component {
	constructor(props, context) {
    	super(props, context)
    }
	render(){
	    return (
	        <div className="toolbar-container">
	      		<ButtonToolbar>
					<div className="toolbar-buttons-container" style={{marginRight: 10, width : '100%'}}>
						<div className="flex-grow"></div>
						<div style={{display:'flex'}}>
							<BetaChartToolbarToggle active={this.props.active} toggle={this.props.toggle} id="general" label="General" />
							<BetaChartToolbarToggle active={this.props.active} toggle={this.props.toggle} id="benchmark" label="Benchmarks" />
							<BetaChartToolbarToggle active={this.props.active} toggle={this.props.toggle} id="peer" label="Peers" />
						</div>
					</div>
				</ButtonToolbar>
			</div>
		)
	  }
}

export default BetaChartToolbar;