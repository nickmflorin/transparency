import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery'

import {Checkbox, Dropdown, DropdownButton, MenuItem} from 'react-bootstrap';
import { CheckBoxDropdownGroupedItem, CheckBoxDropdownItem, CreateCheckBoxDropdownItem } from './DropdownItems'

var classNames = require('classnames');

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
      'btn toolbar-dropdown-btn' : true,
      'flush': (this.props.flush && this.props.flush === true),
    });

    return(
      <Dropdown id={this.props.id}>
          <Dropdown.Toggle className={btnClass} bsStyle={this.props.style}>
              {this.props.label}
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu toolbar-dropdown-menu">
            {this.props.items.map((item) => {
                return(
                  <CreateCheckBoxDropdownItem 
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
