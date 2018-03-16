import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

import { logout, login } from  '../../actions'
import {authErrors, isAuthenticated, user} from '../../reducers'

import LoginPageForm from './LoginPageForm'
import './login.css'

class LoginPage extends React.Component {
  constructor(props, context){
    super(props, context)
    this.state = {
      redirectToReferrer : false
    }
  }
  componentWillReceiveProps(props){
    this.setState({
      redirectToReferrer: props.isAuthenticated
    })
  }
  login = (username, password) => {
    this.props.onLogIn(username, password)
  }
  render(){
    var fromPath = '/'
    if(this.props.location.state && this.props.location.state.from && this.props.location.state.from.pathname){
      fromPath = this.props.location.state.from.pathname
    }
    return (
      <div className="login-page-container">
        {this.state.redirectToReferrer === true && 
          <Redirect to={fromPath} />
        }
        <div className="login-page-form-container">
          <LoginPageForm {...this.props} login={this.login.bind(this)}/>
        </div>
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

