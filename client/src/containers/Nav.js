import React from 'react'
import { connect } from 'react-redux'

import { authErrors, Actions, isAuthenticated, user } from '../store'

import { NavBar } from '../components/nav'

class Nav extends React.Component {
  render(){
    console.log('nav bar')
    console.log(this.props.authErrors)
    return (
      <NavBar {...this.props} />
    )
  }
}

const StateToProps = (state, ownProps) => {  
  return {
    authErrors: authErrors(state),
    sidebarShowing : state.sidebarShowing,
    isAuthenticated: isAuthenticated(state),
    user : user(state),
  };
};

const DispatchToProps = (dispatch, ownProps) => {
  return {
   toggleSidebar: () => dispatch(Actions.toggleSidebar()),
   onLogIn : (username, password) =>  dispatch(Actions.login(username, password)),
   onLogOut : (username, password) =>  dispatch(Actions.logout())
  }
};

export default connect(StateToProps, DispatchToProps)(Nav);
