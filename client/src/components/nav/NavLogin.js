import React from 'react'
import PropTypes from 'prop-types';

import { ButtonToolbar, Dropdown, SplitButton, MenuItem, Button, FormControl } from 'react-bootstrap'
import { LoginDropdown, UserDropdown } from '../dropdowns'
import { LoginToggleButton, UserToggleButton } from '../buttons'

export class NavLogin extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      error : null,
      login_open : false,
      user_open : false,
    };
  }
  static propTypes = {
    authErrors: PropTypes.array.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    user: PropTypes.object, // Not Always Required if User Not Logged In Yet
    onLogIn: PropTypes.func.isRequired,
    onLogOut: PropTypes.func.isRequired,
  };
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
      <div className='nav-login-button-container'>
           {!this.props.isAuthenticated && 
              <LoginDropdown 
                id="login"
                label="Login"
                authErrors={this.props.authErrors}
                isAuthenticated={this.props.isAuthenticated}
                onLogIn={this.props.onLogIn}
              />
            }
            
            {this.props.isAuthenticated && 
              <Dropdown id="dropdown-custom-menu" open={this.state.user_open} onToggle={val => this.toggle(val, 'user_open')}>

                <UserToggleButton bsRole="toggle">
                  {this.props.user.username}
                  <span className="nav-bar-btn-caret caret"></span>
                </UserToggleButton>

                <UserDropdown 
                  bsRole="menu" 
                  open={this.open.bind(this)} 
                  close={this.close.bind(this)} 
                  isAuthenticated={this.props.isAuthenticated}
                  user={this.props.user}
                  onLogOut={this.props.onLogOut}
                />
              </Dropdown>
            }
      </div>
    )
  }
}


