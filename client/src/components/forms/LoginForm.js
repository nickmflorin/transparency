import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore'

import { Form, Alert, ButtonToolbar, Dropdown, SplitButton, MenuItem, Button, FormControl } from 'react-bootstrap'
import { TextInput } from '../elements'
import { AlertMessage } from '../Alerts'

// TO DO: Redirect if Logged In Already? Might be Handled by Router
export class LoginForm extends React.Component {
  constructor(props, context){
    super(props, context)
    this.state = {
      username : '',
      password : '',
      error : null,
    }
  }
  static propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.array.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    login: PropTypes.func.isRequired,
  };
  clear(){
    this.setState({ error : null })
  }
  onSubmit(event){
    event.preventDefault()
    this.clear()
    this.props.login(this.state.username, this.state.password)
  }
  componentWillReceiveProps(props){
    if(props.errors){
      const error = _.findWhere(props.errors, { reference : 'LOGIN' })
      if(error){
        this.setState({ error : error })
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
    return (
			<Form onSubmit={this.onSubmit.bind(this)} className='login-form'>
				<TextInput 
					name="username" 
					label="Username" 
         	error={(this.state.error && this.state.error.message)}
         	onChange={this.handleInputChange}
          style={{marginTop:"10px"}}
        />
  			<TextInput 
  				name="password" 
  				label="Password" 
          type="password"  
         	error={(this.state.error && this.state.error.message)}
         	onChange={this.handleInputChange}
          style={{marginTop:"10px"}}
        />
        {this.state.error &&
           <AlertMessage type="error"> {this.state.error.message} </AlertMessage>
        }
        
        <div className="login-button-container">
	  	    <button className="btn btn-primary">Sign In</button>
        </div>
	    </Form>
    )
  }
}


