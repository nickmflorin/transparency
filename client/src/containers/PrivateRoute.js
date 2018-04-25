import React from 'react';
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router'
import { Redirect } from 'react-router-dom'
import { isAuthenticated } from '../reducers'

export const PrivateRoute = ({ component: Component, isAuthenticated : isAuthenticated, ...rest }) => (
  <Route {...rest} render={(props) => (
    isAuthenticated === true
      ? <Component {...rest} />
      : <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
  )} />
)

const mapStateToProps = (state, ownProps) => {  
  return {
    isAuthenticated: isAuthenticated(state)
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);  