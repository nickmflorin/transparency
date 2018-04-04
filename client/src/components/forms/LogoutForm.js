import React from 'react';
import PropTypes from 'prop-types';

import { Form, Alert, ButtonToolbar, Dropdown, SplitButton, MenuItem, Button, FormControl } from 'react-bootstrap'
import { TextInput } from '../inputs'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faUser from '@fortawesome/fontawesome-free-regular/faUser'
import MissingUser from './MissingUser.png'

export class LogoutForm extends React.Component {
  constructor(props, context){
    super(props, context)
  }
  static propTypes = {
      isAuthenticated: PropTypes.bool.isRequired,
      onLogOut: PropTypes.func.isRequired,
      user: PropTypes.object.isRequired,
  };
  onSubmit(event){
    event.preventDefault()
    this.props.onLogOut()
  }
  render() {
    return (
			<Form onSubmit={this.onSubmit.bind(this)} className='logout-form'>
        <div className="logout-form-panel-title"> 
          <div className="flex-grow">Account</div> 
          <div><FontAwesomeIcon icon={faUser} /></div>
       </div>

        <div className="logout-form-panel-body">
          <div className="flex">
                <div className='logout-form-image-container'>
                   <img className='logout-form-image' src={MissingUser}></img>
                </div>
                <div className='logout-form-info-container'>
                      <p className="logout-user"> {this.props.user && this.props.user.username} </p>
                      <p className="logout-email"> {this.props.user && this.props.user.email} </p>
                </div>
            </div>
        </div>

        <div className="login-button-container logout-button-container">
	  	    <button className="btn btn-primary login-button-submit logout-button-submit">Log Out</button>
        </div>
	    </Form>
    )
  }
}


