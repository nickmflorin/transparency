import React from 'react';
import _ from 'underscore'
import moment from 'moment'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSave from '@fortawesome/fontawesome-free-solid/faSave'
import faEraser from '@fortawesome/fontawesome-free-solid/faEraser'
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload'

import { DropdownButton, ButtonToolbar, MenuItem, Checkbox } from 'react-bootstrap';
import { CSVLink, CSVDownload } from 'react-csv';

import './toolbar.css'

class QueryResultsColumnDropdownItem extends React.Component {
  render(){
    return (
        <li className="dropdown-item toolbar-dropdown-item">
           <a className="dropdown-item-link toolbar-dropdown-item-link flex" role="menuitem" tabIndex="-1">
              <Checkbox 
                defaultChecked={this.props.column.enabled} 
                id={this.props.column.id}
                onChange={(event) => this.props.toggle(event, this.props.column)} 
              >
              </Checkbox> 
              <p> {this.props.column.Header} </p>
           </a>
        </li>
    )
  }
}

class  QueryResultsColumnDropdown extends React.Component {
  render(){
      return(
        <DropdownButton
          className="toolbar-dropdown-button"
          bsStyle={this.props.style}
          title={this.props.title}
          key={this.props.id}
          id={`query-results-columns-dropdown-${this.props.id}`}
        >
        {this.props.columns && this.props.columns.map((column) => {
          return(
            <QueryResultsColumnDropdownItem 
              key={column.id} 
              column={column}
              toggle={this.props.toggle}
            />
          )
        })}
        </DropdownButton>
      )
  }
}

export class QueryResultsTableToolbar extends React.Component {
	constructor(props, context) {
    super(props, context)
  }
	render(){
	    return (
          <div className="toolbar-container">
  	      	<ButtonToolbar>
  	      			<div className="toolbar-dropdowns-container">
                  <div className="toolbar-dropdown-container">
                      <QueryResultsColumnDropdown 
                          id="columns" 
                          key='columns' 
                          title='Columns' 
                          style='primary' 
                          toggle={this.props.toggle}
                          columns={this.props.columns || []} 
                       />
                  </div>
                </div>
                <div className="toolbar-buttons-container" style={{marginRight:0}}>
                    <div className="toolbar-button-container" style={{marginRight:0}}>
                      <a className="btn btn-default toolbar-button" style={{marginLeft: 5}} onClick={this.props.download}> 
                        <span className='toolbar-button-icon'>
                                <FontAwesomeIcon icon={faDownload}/> 
                              </span>
                        Download 
                      </a>
                  </div>
                </div>
  					</ButtonToolbar>
          </div>
			)
	  }
}

export default QueryResultsTableToolbar;