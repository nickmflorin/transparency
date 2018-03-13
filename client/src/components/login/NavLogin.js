import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

import { ButtonToolbar, Dropdown, SplitButton, MenuItem, Button, FormControl } from 'react-bootstrap'

import LoginDropdown from './LoginDropdown'
import UserDropdown from './UserDropdown'

import { logout, login } from  '../../actions'
import { authErrors, isAuthenticated, user } from '../../reducers'

import './login.css'

class LoginToggle extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    e.preventDefault();
    this.props.onClick(e);
  }
  render() {
    return (
      <a href="" className='btn nav-bar-button login-button' onClick={this.handleClick}>
         {this.props.children}
      </a>
    );
  }
}

class UserToggle extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    e.preventDefault();
    this.props.onClick(e);
  }
  render() {
    return (
      <a href="" className='btn nav-bar-button login-button' onClick={this.handleClick}>
         {this.props.children}
      </a>
    );
  }
}

class NavLogin extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      error : null,
      login_open : false,
      user_open : false,
    };
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.isAuthenticated){
      this.setState({ 'login_open' : false })
      this.setState({ 'user_open' : false })
    }
  }
  close(id){
    var setter = {}
    setter[id] = false
    this.setState(setter);
  }
  open(id){
    var setter = {}
    setter[id] = true
    this.setState(setter);
  }
  toggle(val, id){
    var setter = {}
    setter[id] = val
    this.setState(setter);
  }
  render(){
    return (
      <div className='login-button-container'>
            {!this.props.isAuthenticated && 
              <Dropdown id="dropdown-custom-menu" open={this.state.login_open} onToggle={val => this.toggle(val, 'login_open')}>
                <LoginToggle bsRole="toggle">
                  Login
                  <span className="nav-bar-button-caret caret"></span>
                </LoginToggle>
                <LoginDropdown bsRole="menu" open={this.open.bind(this)} close={this.close.bind(this)} {...this.props}/>
              </Dropdown>
            }

            {this.props.isAuthenticated && 
              <Dropdown id="dropdown-custom-menu" open={this.state.user_open} onToggle={val => this.toggle(val, 'user_open')}>
                <UserToggle bsRole="toggle">
                  {this.props.user.username}
                  <span className="nav-bar-button-caret caret"></span>
                </UserToggle>
                <UserDropdown 
                  bsRole="menu" 
                  open={this.open.bind(this)} 
                  close={this.close.bind(this)} 
                  {...this.props}
                />
              </Dropdown>
            }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {  
  return {
    errors: authErrors(state),
    isAuthenticated: isAuthenticated(state),
    user : user(state),
  };
};


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
   onLogIn : (username, password) =>  dispatch(login(username, password)),
   onLogOut : (username, password) =>  dispatch(logout())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(NavLogin);

