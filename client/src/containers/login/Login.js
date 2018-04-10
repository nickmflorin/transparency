import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { PulseLoader } from 'react-spinners';

import Actions from '../../actions'
import { isAuthenticated } from  '../../reducers'

import { LoginForm } from '../../components/forms'
import Background from './background.png';

import './login.css'

var LoginPageStyle = {
  backgroundImage: `url(${Background})`,
};


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
      <div>
        <div className='loading'>
          <PulseLoader
            color={'#004C97'} 
            loading={this.props.requesting} 
          />
        </div>
        <div className="login-page-container">
          <div className="login-page-image-container" style={LoginPageStyle}>
          </div>
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
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {  
  return {
    isAuthenticated : isAuthenticated(state),
    auth: state.auth,
    requesting : state.requesting,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onLogIn : (username, password) =>  dispatch(Actions.login(username, password)),
    onLogOut : (username, password) =>  dispatch(Actions.logout())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

