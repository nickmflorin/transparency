import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore'

import { Form, Alert, ButtonToolbar, Dropdown, SplitButton, MenuItem, Button, FormControl } from 'react-bootstrap'
import { TextInput } from '../inputs'
import { ErrorMessage } from '../alerts'

// TO DO: Redirect if Logged In Already? Might be Handled by Router
export class LoginForm extends React.Component {
  constructor(props, context){
    super(props, context)
    this.state = {
      username : '',
      password : '',
      messages : [],
      errors : { username : null, password : null },
    }
  }
  static propTypes = {
    auth: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    login: PropTypes.func.isRequired,
  };
  clear(){
    this.setState({ messages : [], errors : { username : null, password : null } })
  }
  onSubmit(event){
    event.preventDefault()
    this.clear()
    this.props.login(this.state.username, this.state.password)
  }
  componentWillReceiveProps(props){
    // Clear Errors and Messages on Submit
    if(props.auth.errors.login){
      const error = props.auth.errors.login
      var err = { username : null, password : null }
      if(error.field){
        err[error.field] = error.message
        this.setState({ errors : err, messages : [error.message] })
      }
      else{
        console.log('Invalid Error Returned')
        console.log(error)
        //throw new Error('Invalid Error Returned')
      }
    }
  }
  handleInputChange = (event) => {
    const target = event.target
    const value = target.value
    const name = target.name
    this.setState({
      [name]: value
    });
  }
  render() {
    const show_messages = this.state.messages.length != 0
    return (
			<Form onSubmit={this.onSubmit.bind(this)} className='login-form'>
				<TextInput 
					name="username" 
					label="Username" 
         	error={this.state.errors.username}
         	onChange={this.handleInputChange}
          style={{marginTop:"10px"}}
        />
  			<TextInput 
  				name="password" 
  				label="Password" 
          type="password"  
         	error={this.state.errors.password}
         	onChange={this.handleInputChange}
          style={{marginTop:"10px"}}
        />
        {show_messages && this.state.messages.map((message, i) => {
            return <ErrorMessage key={i} message={message} />
        })}
        
        <div className="login-button-container">
	  	    <button className="login-button-submit">Sign In</button>
        </div>
	    </Form>
    )
  }
}


