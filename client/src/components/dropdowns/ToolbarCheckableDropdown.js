import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCaretRight from '@fortawesome/fontawesome-free-solid/faCaretRight'
import {Checkbox, Dropdown, DropdownButton, MenuItem} from 'react-bootstrap';

var classNames = require('classnames');

const CreateItem = function(props){
  if(props.item.children){
    return (
      <CheckBoxDropdownGroupedItem 
        id={props.id}
        children={props.item.children}
        label={props.item.label}
        onClick={props.onClick}
      />
    )
  }
  else{
    return (
      <CheckBoxDropdownItem 
        id={props.id}
        label={props.item.label}
        item={props.item}
        checked={props.item.enabled}
        onClick={props.onClick}
      />
    )
  }
}

class CheckBoxDropdownGroupedItem extends React.Component {
  static propTypes = {
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]).isRequired,
      label: PropTypes.string.isRequired,
      children: PropTypes.array.isRequired,
      onClick: PropTypes.func.isRequired,
  };
  render(){
    return (
        <li className="toolbar-sub-dropdown-item">
          <a className="dropdown-item-link" data-toggle="dropdown" style={{display:'flex'}}>
              <div style={{display:'flex', width : '100%'}}> 
                <p className="dropdown-item-label"> {this.props.label} </p>
                <div className="dropdown-item-caret">
                  <FontAwesomeIcon icon={faCaretRight}/> 
                </div>
              </div>
           </a>

           <Dropdown.Menu className="toolbar-dropdown-menu">
              {this.props.children.map((child) => {
                  return(
                    <CreateItem 
                      key={child.id}
                      id={child.id}
                      item={child}
                      onClick={this.props.onClick}                
                    />
                  )
              })}
            </Dropdown.Menu>
        </li>
    )
  }
}

class CheckBoxDropdownItem extends React.Component {
  static propTypes = {
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]).isRequired,
      label: PropTypes.string.isRequired,
      checked: PropTypes.bool,
      onClick: PropTypes.func.isRequired,
  };
  onClick(id){
    this.props.onClick(id)
  }
  render(){
    return (
      <MenuItem 
        id={this.props.id}
        key={this.props.id} 
        eventKey={this.props.id}
        onSelect={(e) => {
          this.onClick(this.props.id)
        }}
      >
      <div className="flex">
        <Checkbox 
          id={this.props.id + '-' + 'checkbox'}
          className="dropdown-checkbox"
          checked={this.props.checked} 
          onChange={(e) => {
            // Just Required to Work with React Checkboxes
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            this.onClick(this.props.id)
          }}
        >
        </Checkbox> 
        <span className="dropdown-item-label"> {this.props.label} </span>
      </div>
    </MenuItem>
    )
  }
}

export class ToolbarCheckableDropdown extends React.Component {
  static propTypes = {
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      onClick: PropTypes.func.isRequired,
      items: PropTypes.array.isRequired,
      label: PropTypes.string.isRequired,
      style: PropTypes.string.isRequired,
      flush: PropTypes.bool,
  };
  render(){
     var btnClass = classNames({
      'toolbar-dropdown-btn' : true,
      'flush': (this.props.flush && this.props.flush === true),
    });

    return(
      <Dropdown id={this.props.id}>
          <Dropdown.Toggle className={btnClass} bsStyle={this.props.style}>
              {this.props.icon && 
                  <span className='menu-icon'>
                  <FontAwesomeIcon icon={this.props.item.icon}/> 
                </span>
              }
              {this.props.label}
          </Dropdown.Toggle>
          <Dropdown.Menu className="toolbar-dropdown-menu">
            {this.props.items.map((item) => {
                return(
                  <CreateItem 
                    key={item.id}
                    id={item.id}
                    item={item}
                    onClick={this.props.onClick}                
                  />
                )
            })}
          </Dropdown.Menu>
      </Dropdown>
    )
  }
}
