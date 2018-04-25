import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

import Actions from '../actions'
import { isAuthenticated } from  '../reducers'
import { LoginForm } from '../components/forms'
import { Page } from '../components/layout'

export class Login extends React.Component {
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
  login(username, password){
    this.props.onLogIn(username, password)
  }
  render(){
    var fromPath = '/'
    const history = this.props.history
    if(history){
      const location = history.location
      if(location && location.state && location.state.from && location.state.from.pathname){
        fromPath = location.state.from.pathname
      }
    }
    return (
      <Page
        backgroundImage={true}
        {...this.props}
      >
        <div className="login-page-container">
          {this.state.redirectToReferrer === true && 
            <Redirect to={fromPath} />
          }
          <div className="login-page-form-container">
            <LoginForm 
              login={this.login.bind(this)} 
              {...this.props}
            />
          </div>
        </div>
      </Page>
    )
  }
}

const mapStateToProps = (state, ownProps) => {  
  return {
    isAuthenticated : isAuthenticated(state),
    auth: state.auth,
    requesting : state.requesting,
    errors : state.errors,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onLogIn : (username, password) =>  dispatch(Actions.login(username, password)),
    onLogOut : (username, password) =>  dispatch(Actions.logout())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

