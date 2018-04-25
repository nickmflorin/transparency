import React from 'react';
import PropTypes from 'prop-types';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCaretRight from '@fortawesome/fontawesome-free-solid/faCaretRight'

import {Checkbox, Dropdown, DropdownButton, MenuItem} from 'react-bootstrap';
import { MenuDropdownItemLink } from '../elements'

export const MenuDropdownItem = (props) => (
	<li className='dropdown-item menu-dropdown-item'>
     	<MenuDropdownItemLink path={props.app.path} label={props.app.label} />
	</li>
)

export const CreateCheckBoxDropdownItem = function(props){
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

export class CheckBoxDropdownGroupedItem extends React.Component {
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
        <li className="dropdown-item sub-dropdown-item">
          <a data-toggle="dropdown" style={{display:'flex'}}>
              <span className="flex-grow"> {this.props.label} </span>
              <span className="caret-right">
                <FontAwesomeIcon icon={faCaretRight}/> 
              </span>
           </a>

           <Dropdown.Menu className="dropdown-menu">
              {this.props.children.map((child) => {
                  return(
                    <CreateCheckBoxDropdownItem 
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

export class CheckBoxDropdownItem extends React.Component {
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
        className="dropdown-item checkbox-dropdown-item"
        onSelect={(e) => {
          this.onClick(this.props.id)
        }}
      >
      <div className="flex">
        <input 
          type="checkbox" 
          id={this.props.id + '-' + 'checkbox'}
          className="dropdown-item-checkbox"
          checked={this.props.checked} 
          onChange={(e) => {
            // Just Required to Work with React Checkboxes
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            this.onClick(this.props.id)
          }}
        ></input>
        {this.props.label}
      </div>
    </MenuItem>
    )
  }
}
