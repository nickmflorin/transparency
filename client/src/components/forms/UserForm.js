import React from 'react';
import PropTypes from 'prop-types';

import { Form, Alert, ButtonToolbar, Dropdown, SplitButton, MenuItem, Button, FormControl } from 'react-bootstrap'
import { TextInput } from '../elements'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faUser from '@fortawesome/fontawesome-free-regular/faUser'
import MissingUser from './MissingUser.png'

export class UserForm extends React.Component {
  constructor(props, context){
    super(props, context)
    this.actions = [
      {'id' : 'admin', 'label' : 'Admin', 'href' : '/admin'}
    ]
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
			<Form onSubmit={this.onSubmit.bind(this)} className='user-form'>
        <div className="form-colored-title"> 
          <div className="flex-grow">Account</div> 
          <div><FontAwesomeIcon icon={faUser} /></div>
        </div>

        <div className="form-body">
          <div className="flex">
              <div className='image-container'>
                 <img className='image' src={MissingUser}></img>
              </div>
              <div className='info-container'>
                    <p className="user"> {this.props.user && this.props.user.username} </p>
                    <p className="email"> {this.props.user && this.props.user.email} </p>
              </div>
            </div>
        </div>

        <div className="actions-container">
          {this.actions.map((action) => {
            return <a id={action.id} key={action.id} href={action.href} className="btn btn-default action-button">{action.label}</a>
          })}
	  	    <button className="btn btn-primary action-button">Log Out</button>
        </div>
	    </Form>
    )
  }
}


