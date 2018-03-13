import React from 'react';
import ReactDOM from 'react-dom'

import { Form, Alert, ButtonToolbar, Dropdown, SplitButton, MenuItem, Button, FormControl } from 'react-bootstrap'
import TextInput from '../elements/TextInput'

class LoginPageForm extends React.Component {
  state = {
    username: '',
    password: ''
  }
  handleInputChange = (event) => {
    const target = event.target
    const value = target.value
    const name = target.name
    this.setState({
      [name]: value
    });
  }
  onSubmit = (event) => {
    event.preventDefault()
    this.props.onLogIn(this.state.username, this.state.password)
  }
  render() {
    const errors = this.props.errors || {}
    return (
			<Form onSubmit={this.onSubmit} className='login-form'>

				<TextInput 
					name="username" 
					label="Username" 
         	error={errors.username}
         	onChange={this.handleInputChange}
          style={{marginTop:"10px"}}
        />

  			<TextInput 
  				name="password" 
  				label="Password" 
          type="password"  
         	error={errors.password} 
         	onChange={this.handleInputChange}
          style={{marginTop:"10px"}}
        />

        {errors.non_field_errors?
         <div className="error login-page-form-error">
            {errors.non_field_errors}
         </div>:""}

	  	 <button className="btn btn-primary login-button-submit">Sign In</button>
	    </Form>
    )
  }
}

export default LoginPageForm