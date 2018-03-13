import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore'
import moment from 'moment'

import { DropdownButton, ButtonToolbar, MenuItem, Button } from 'react-bootstrap';
import { FormGroup, FormControl, ControlLabel, Input, Checkbox } from 'react-bootstrap';
import { CSVLink, CSVDownload } from 'react-csv';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSave from '@fortawesome/fontawesome-free-solid/faSave'
import faEraser from '@fortawesome/fontawesome-free-solid/faEraser'
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload'

import StatisticsDropdown from './StatDropdown'
import ListsDropdown from './ListDropdown'
import ToolbarDateRange from './DateRange'

import './toolbar.css'

class ToolbarDropdowns extends React.Component {
	render(){
	    return (
	        <div className="toolbar-dropdowns-container">
	      		<div className="toolbar-dropdown-container">
		      		<StatisticsDropdown 
		          		id="stats" 
		          		key='stats' 
		          		title='Table Statistics' 
		          		style='primary' 
		          		toggleStat={this.props.toggleStat}
		          		stat_config={this.props.stat_config || []} 
			         />
			     </div>
			     <div className="toolbar-dropdown-container">
			         <ListsDropdown 
		          		id="lists" 
		          		key='lists' 
		          		title='Saved Lists' 
		          		style='default' 
		          		onLoad={this.props.onLoad}
		          		lists={this.props.lists || []} 
			         />
			    </div>
			</div>
	    )
	}
}

class ManagerComparisonToolbar extends React.Component {
	constructor(props, context) {
        super(props, context)
    }
    static propTypes = {
      stat_config: PropTypes.object.isRequired,
      onLoad: PropTypes.func.isRequired,
      dates: PropTypes.object.isRequired,
      handleDateChange: PropTypes.func.isRequired,
      toggleStat: PropTypes.func.isRequired,
      lists: PropTypes.array.isRequired,
  	};
	render(){
	    return (
	      	<ButtonToolbar>
	      		<div className="toolbar-container">
	      			<ToolbarDropdowns 
	      				toggleStat={this.props.toggleStat}
	      				onLoad={this.props.onLoad}
	      				stat_config={this.props.stat_config} 
	      				lists={this.props.lists}
	      			/>

	      			<div className="toolbar-buttons-container">
					    <div className="toolbar-button-container">
						    <a className="btn btn-default toolbar-button" style={{marginRight: 5}} onClick={this.props.onSave}> 
						      <span className='toolbar-button-icon'>
			                    <FontAwesomeIcon icon={faSave}/> 
			                  </span>
						      Save 
						    </a>
						</div>
					</div>

	      			<div style={{paddingTop:10, marginLeft: 25}}>
	      				{this.props.list && 
		      				<p style={{lineHeight:'26px'}}> 
		      					Opened : <span className="emphasis" style={{marginLeft: 8}}> {this.props.list.name} </span>
		      				</p>
		      			}
	      			</div>

	      			<div className="flex-grow">
				        <div className="toolbar-controls-container">
				        	<ToolbarDateRange 
				        		dates={this.props.dates}
								handleDateChange={this.props.handleDateChange}
				        	/>
				        	<div className="flex-grow">
					        	<div className="float-r">
							        <FormGroup className="checkbox-toolbar-group">
								      <Checkbox defaultChecked id='peers' onChange={(event) => this.props.togglePeers(event)} inline>Peers</Checkbox> 
								      <Checkbox defaultChecked id='benchmarks' onChange={(event) => this.props.toggleBenchmarks(event)} inline>Benchmarks</Checkbox>
								    </FormGroup>
								</div>
							</div>
				        </div>
				    </div>

					<div className="toolbar-buttons-container" style={{marginRight:0}}>
						<div className="toolbar-button-container">
							<CSVLink data={this.props.to_download}
			                    filename={"manager_comparison.csv"}
			                    className="btn btn-default toolbar-button"
			                    target="_blank">
			                    <span className='toolbar-button-icon'>
			                       <FontAwesomeIcon icon={faDownload}/> 
			                    </span>
			                    CSV 
		                  	</CSVLink>
						</div>
					    <div className="toolbar-button-container" style={{marginRight:0}}>
						    <a className="btn btn-default toolbar-button" style={{marginLeft: 5}} onClick={this.props.onClear}> 
						      <span className='toolbar-button-icon'>
			                    <FontAwesomeIcon icon={faEraser}/> 
			                  </span>
						      Clear 
						    </a>
						</div>
					</div>
				</div>
	        </ButtonToolbar>
	    )
	}
}

export default ManagerComparisonToolbar;