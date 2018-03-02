import React from 'react';
import axios from 'axios';
import _ from 'underscore'

import { DropdownButton, ButtonToolbar, MenuItem } from 'react-bootstrap';
import {FormGroup, FormControl, ControlLabel, Input, Checkbox} from 'react-bootstrap';

import ManagerComparisonStats from './stats'
import StatisticsDropdown from './dropdown.js'
import Utilities from '../../../../utilities.js'

class ManagerComparisonToolbar extends React.Component {
	render(){
	    return (
	      	<ButtonToolbar>
	      		<StatisticsDropdown 
	          		id="stats" 
	          		key='stats' 
	          		title='Table Statistics' 
	          		style='primary' 
	          		toggleStat={this.props.toggleStat}
	          		stats={this.props.stats || []} 
		         />
		        <div className="flex-grow">
		        	<div className="float-r" style={{marginRight: 20}}>
				        <FormGroup className="checkbox-toolbar-group">
					      <Checkbox defaultChecked id='peers' onChange={(event) => this.props.peersBenchmarksToggled(event)} inline>Peers</Checkbox> 
					      <Checkbox defaultChecked id='benchmarks' onChange={(event) => this.props.peersBenchmarksToggled(event)} inline>Benchmarks</Checkbox>
					    </FormGroup>
				    </div>
				</div>
	        </ButtonToolbar>
	    )
	}
}

export default ManagerComparisonToolbar;