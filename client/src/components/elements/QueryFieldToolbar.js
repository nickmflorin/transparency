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

export class QueryFieldToolbar extends React.Component {
	constructor(props, context) {
    super(props, context)
  }
  static propTypes = {
    run: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired,
    to_download: PropTypes.array.isRequired,
  };
	render(){
	    return (
	        <div className="toolbar-container" style={{minHeight:"30px", maxHeight:"30px"}}>
	      		<ButtonToolbar>
	      			<div className="toolbar-button-container" style={{marginLeft:0}}>
						 <a className="btn btn-default toolbar-button" style={{marginRight: 5}} onClick={this.props.run}> 
					 			<span className='toolbar-button-icon'>
	                    			<FontAwesomeIcon icon={faPlay}/> 
	                  			</span>
					      Run 
					    </a>
					</div>

					<div className="toolbar-button-container">
						 <a className="btn btn-default toolbar-button" style={{marginRight: 5}} onClick={this.props.clear}> 
					 		<span className='toolbar-button-icon'>
			                    <FontAwesomeIcon icon={faEraser}/> 
			                 </span>
					      Clear 
					    </a>
					</div>

					{this.props.to_download && 
						<div className="toolbar-button-container">
							 <CSVLink data={this.props.to_download}
					              filename={"data.csv"}
					              className="btn btn-default toolbar-button"
					              target="_blank">
						 	<span className='toolbar-button-icon'>
			                  <FontAwesomeIcon icon={faDownload}/> 
			                </span>
						      Export 
						    </CSVLink>
						</div>
					}
				</ButtonToolbar>
			</div>
			)
	  }
	}


export default QueryFieldToolbar;