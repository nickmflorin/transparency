import React from 'react'
import { connect } from 'react-redux'

import Actions from '../actions'
import { isAuthenticated } from '../reducers'
import { NavBar } from '../components/nav'

class Nav extends React.Component {
  render(){
    return (
      <NavBar {...this.props} />
    )
  }
}

const StateToProps = (state, ownProps) => {  
  return {
    sidebarShowing : state.sidebarShowing,
    isAuthenticated: isAuthenticated(state),
    auth : state.auth,
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
