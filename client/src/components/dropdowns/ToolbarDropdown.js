import React from 'react';
import PropTypes from 'prop-types';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {Checkbox, Dropdown, DropdownButton, MenuItem} from 'react-bootstrap';
var classNames = require('classnames');

export class ToolbarDropdown extends React.Component {
  isActive(element){
    if(this.props.active && this.props.active.id == element.id){
      return true 
    }
    return false 
  }
  static propTypes = {
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      onSelect: PropTypes.func.isRequired,
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
                <MenuItem 
                  id={item.id}
                  key={item.id} 
                  eventKey={item.id}
                  active={this.isActive(item)}
                  onSelect={ (e) => this.props.onSelect(e, this.props.id, item) }
                >
                {item.name || item.label}
                </MenuItem>
              )
            })}
          </Dropdown.Menu>
      </Dropdown>
    )
  }
}