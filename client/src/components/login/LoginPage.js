import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

import { logout, login } from  '../../actions'
import {authErrors, isAuthenticated, user} from '../../reducers'

import LoginPageForm from './LoginPageForm'
import './login.css'

class LoginPage extends React.Component {
  render(){
    return (
        <div>
          {this.props.isAuthenticated && 
            <Redirect to='/' />
          }
          {!this.props.isAuthenticated && 
            <div className="login-page-container">
              <div className="login-page-form-container">
                <LoginPageForm {...this.props}/>
              </div>
            </div>
          }
        </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {  
  return {
    errors: authErrors(state),
    isAuthenticated: isAuthenticated(state),
    user: user(state)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onLogIn : (username, password) =>  dispatch(login(username, password)),
    onLogOut : (username, password) =>  dispatch(logout())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);

