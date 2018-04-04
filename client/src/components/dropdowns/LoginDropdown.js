import React from 'react';
import PropTypes from 'prop-types';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import {Checkbox, Dropdown, DropdownButton, MenuItem} from 'react-bootstrap';
import { LoginForm } from '../forms'

export class LoginDropdown extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  static propTypes = {
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    label: PropTypes.string.isRequired,
    authErrors: PropTypes.array.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    onLogIn: PropTypes.func.isRequired,
  };
  login(username, password){
    this.props.onLogIn(username, password)
  }
  render() {
    return (
        <Dropdown id={this.props.id}>
            <Dropdown.Toggle className="nav-bar-btn nav-login-btn">
                {this.props.icon && 
                    <span className='menu-icon'>
                      <FontAwesomeIcon icon={this.props.item.icon}/> 
                    </span>
                }
                {this.props.label || "Login"}
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu-right login-menu">
                <LoginForm 
                  login={this.login.bind(this)} 
                  authErrors={this.props.authErrors} 
                  isAuthenticated={this.props.isAuthenticated}
                />
            </Dropdown.Menu>
        </Dropdown>
    )
  }
}

