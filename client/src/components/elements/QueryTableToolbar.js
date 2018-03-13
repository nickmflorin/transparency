import React from 'react';
import _ from 'underscore'
import moment from 'moment'

import { DropdownButton, ButtonToolbar, MenuItem } from 'react-bootstrap';
import { CSVLink, CSVDownload } from 'react-csv';

import './toolbar.css'

class SavedQueryDropdown extends React.Component {
  render(){
    return(
      <DropdownButton
      	className="toolbar-dropdown-button"
        bsStyle={this.props.style}
        title={this.props.title}
        key={this.props.id}
        id={`database-dropdown-${this.props.id}`}
      >
      {this.props.saved && this.props.saved.map((savedQuery) => {
          return(
            <MenuItem 
            	key={savedQuery.id} 
            	eventKey="1">savedQuery.name
            </MenuItem>
          )
      })}
      </DropdownButton>
    )
  }
}
class QueryTableDropdown extends React.Component {
  render(){
    return(
      <DropdownButton
      	className="toolbar-dropdown-button"
        bsStyle={this.props.style}
        title={this.props.title}
        key={this.props.id}
        bsStyle='default' 
        id={`database-dropdown-${this.props.id}`}
      >
      {this.props.databases && this.props.databases.map((database) => {
          return(
            <MenuItem 
            	key={database.id} 
            	eventKey="1" 
            	onSelect={ (e) => this.props.databaseSelected(e, database) }>{database.name}
            </MenuItem>
           )
      })}
      </DropdownButton>
    )
  }
}

class ToolbarDropdowns extends React.Component {
	render(){
	    return (
	        <div className="toolbar-dropdowns-container">
	      		<div className="toolbar-dropdown-container">
		      		<SavedQueryDropdown 
		          		id="saved" 
		          		key='saved' 
		          		title='Saved Queries' 
		          		style='primary' 
		          		saved={this.props.saved || []}
			         />
			     </div>
			     <div className="toolbar-dropdown-container">
			         <QueryTableDropdown 
		          		id="structure" 
		          		key='structure' 
		          		title='Database Structure' 
		          		style='default' 
		          		databases={this.props.databases || []} 
		          		databaseSelected={this.props.databaseSelected}
			         />
			    </div>
			</div>
	    )
	}
}

export class QueryTableToolbar extends React.Component {
	constructor(props, context) {
    super(props, context)
  }
	render(){
	    return (
          <div className="toolbar-container" style={{minHeight:"30px", maxHeight:"30px"}}>
  	      	<ButtonToolbar>
  	      			<ToolbarDropdowns 
  	      				{...this.props}
  	      			/>
  					</ButtonToolbar>
          </div>
			)
	  }
	}

export default QueryTableToolbar;