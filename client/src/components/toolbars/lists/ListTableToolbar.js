import React from 'react';
import PropTypes from 'prop-types';

import { ButtonToolbar } from 'react-bootstrap';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay'
import faEraser from '@fortawesome/fontawesome-free-solid/faEraser'
import faSave from '@fortawesome/fontawesome-free-regular/faSave'
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload'

import { ToolbarDropdown } from '../../dropdowns'

export class ListTableToolbar extends React.Component {
	constructor(props, context) {
	    super(props, context)
	}
	static propTypes = {
		onListSelect: PropTypes.func.isRequired,
		list_options: PropTypes.array.isRequired,
		lists: PropTypes.array.isRequired,
		list: PropTypes.object,
	};
	render(){
	    return (
	      	<ButtonToolbar>
	      		<div className="toolbar-item-group">
	      			<div className="toolbar-item-group">
		              <ToolbarDropdown 
		                  id="saved" 
		                  label='Saved Lists' 
		                  style='primary' 
		                  flush={true}
		                  items={this.props.list_options}
		                  onSelect={this.props.onListSelect}
		               />
		            </div>
	          </div>
	          {this.props.list && 
		          <div className="toolbar-text-container">
		          	  <p className="toolbar-label"> List  </p>
		              <p className="toolbar-text">{this.props.list.name}</p>
		          </div>	
		       }       
		  </ButtonToolbar>
		)
  	}
}