import React from 'react';
import PropTypes from 'prop-types';

import { ButtonToolbar } from 'react-bootstrap';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay'
import faEraser from '@fortawesome/fontawesome-free-solid/faEraser'
import faSave from '@fortawesome/fontawesome-free-regular/faSave'
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload'

import { ToolbarDropdown } from '../dropdowns'

const SelectionTableToolbarDropdown = function(props){
	return (
	    <div className="toolbar-item-group">
          <ToolbarDropdown 
              id={props.id} 
              label={props.dropdown.label}
              style={props.dropdown.style || 'default'} 
              flush={true}
              items={props.dropdown.items}
              onSelect={props.onSelect}
           />
        </div>
    )
}

export class SelectionTableToolbar extends React.Component {
	static propTypes = {
		selections: PropTypes.array.isRequired,
		selected: PropTypes.object,
	};
	render(){
	    return (
	      	<ButtonToolbar>
	      		<div className="toolbar-item-group">
	      			{this.props.selections.map( (selection) => {
	      				return <SelectionTableToolbarDropdown key={selection.id} onSelect={this.props.onSelect} {...selection} />
	      			})}
	            </div>
	            {this.props.selected && 
		          <div className="toolbar-text-container">
		          	  <p className="toolbar-label">{this.props.selectedLabel}</p>
		              <p className="toolbar-text">{this.props.selected.name}</p>
		          </div>	
		        }       
		    </ButtonToolbar>
		)
  	}
}