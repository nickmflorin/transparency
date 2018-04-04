import React from 'react';
import PropTypes from 'prop-types';

import { ButtonToolbar } from 'react-bootstrap';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay'
import faEraser from '@fortawesome/fontawesome-free-solid/faEraser'
import faSave from '@fortawesome/fontawesome-free-regular/faSave'
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload'

import { ToolbarDropdown } from '../dropdowns'

export class QueryTableToolbar extends React.Component {
	constructor(props, context) {
	    super(props, context)
	}
	static propTypes = {
		onDatabaseSelect: PropTypes.func.isRequired,
		onQuerySelect: PropTypes.func.isRequired,
		query_options: PropTypes.array.isRequired,
		databases: PropTypes.array.isRequired,
		database: PropTypes.object,
	};
	render(){
	    return (
	      	<ButtonToolbar>
	      		<div className="toolbar-item-group">
	      			<div className="toolbar-item-group">
		              <ToolbarDropdown 
		                  id="saved" 
		                  label='Saved Queries' 
		                  style='primary' 
		                  flush={true}
		                  items={this.props.query_options}
		                  onSelect={this.props.onQuerySelect}
		               />
		            </div>
		            <div className="toolbar-item-group">
		               <ToolbarDropdown 
		                  id="tables" 
		                  label='Database Structure' 
		                  style='default' 
		                  flush={true}
		                  active={this.props.database}
		                  items={this.props.databases} 
		                  onSelect={this.props.onDatabaseSelect}
		               />
		            </div>
	          </div>
	          {this.props.database && 
		          <div className="toolbar-text-container">
		          	  <p className="toolbar-label"> Database  </p>
		              <p className="toolbar-text">{this.props.database.name}</p>
		          </div>	
		       }       
		  </ButtonToolbar>
		)
  	}
}