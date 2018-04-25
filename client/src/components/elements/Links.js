import React from 'react';
import PropTypes from 'prop-types';

import { BrowserRouter, Link, Route } from 'react-router-dom';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

export class MenuLink extends React.Component {
  constructor(props, context){
    super(props, context)
  }
  render(){
    return (
      <Link className='link menu-item-link' to={this.props.path} onClick={this.props.onClick}>
          {this.props.icon && 
              <span className='link-icon'>
                <FontAwesomeIcon icon={this.props.icon}/> 
              </span>
          }
          {this.props.label}
      </Link>
    )
  }
}

export class MenuDropdownItemLink extends React.Component {
  constructor(props, context){
    super(props, context)
  }
  render(){
    return (
      <Link className="link" to={this.props.path} >
        {this.props.label} 
      </Link>
    )
  }
}
