import React from 'react';
import ReactDOM from 'react-dom'
import { Form, Alert, ButtonToolbar, Dropdown, SplitButton, MenuItem, Button, FormControl } from 'react-bootstrap'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faUser from '@fortawesome/fontawesome-free-solid/faUser'
import MissingUser from './MissingUser.png'

import TextInput from '../elements/TextInput'
import './user.css'

class UserDropdown extends React.Component {
  onSubmit = (event) => {
    event.preventDefault()
    this.props.onLogOut()
  }
  render() {
    return (
      <div className="dropdown-menu dropdown-menu-right user-menu">
        <Form onSubmit={this.onSubmit} className='user-form'>
            <div className="user-form-panel-title"> 
                <div className="flex-grow">
                  Account
                </div> 
                <div>
                  <FontAwesomeIcon icon={faUser} />
                </div>
             </div>

            <div className="user-form-panel-body">
              <div className="flex">
                    <div className='user-form-image-container'>
                       <img className='user-form-image' src={MissingUser}></img>
                    </div>
                    <div className='user-form-info-container'>
                          <p className="twelve emphasis"> {this.props.user && this.props.user.username} </p>
                          <div style={{marginTop: 5}}>
                            <p className="eleven user-email"> {this.props.user && this.props.user.email} </p>
                          </div>
                    </div>
                </div>
            </div>
            <div className="logout-button-container">
              <button className="btn btn-primary logout-button-submit">Log Out</button>
            </div>
				  </Form>
	    </div>
    )
  }
}

export default UserDropdown