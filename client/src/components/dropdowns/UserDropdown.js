import React from 'react';
import PropTypes from 'prop-types';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import {Checkbox, Dropdown, DropdownButton, MenuItem} from 'react-bootstrap';
import { UserForm } from '../forms'

export class UserDropdown extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  static propTypes = {
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    label: PropTypes.string.isRequired,
    onLogOut: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
  };
  render() {
    return (
        <Dropdown id={this.props.id}>
            <Dropdown.Toggle className="btn nav-bar-btn">
                {this.props.icon && 
                    <span className='link-icon'>
                      <FontAwesomeIcon icon={this.props.item.icon}/> 
                    </span>
                }
                {this.props.label}
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu dropdown-menu-right user-dropdown-menu">
                <UserForm
                  user={this.props.user} 
                  onLogOut={this.props.onLogOut} 
                  authErrors={this.props.authErrors} 
                  isAuthenticated={this.props.isAuthenticated}
                />
            </Dropdown.Menu>
        </Dropdown>
    )
  }
}

