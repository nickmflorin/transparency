import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

// Router Related Imports
import { Route, Switch } from 'react-router'
import { Redirect, BrowserRouter, Router, withRouter } from 'react-router-dom'

// Importing Loading and Global Components
import { BeatLoader } from 'react-spinners';

import { apps } from '../reducers'

import Login from './Login'
import Nav from './Nav'
import MenuContainer from './Menu'
import TransparencyRouter from './Router'

var classNames = require('classnames')

export class Base extends React.Component {
  render(){
    console.log(this.props.apps)
    const loadingClass = classNames({ 
      loading: true,
      visible: this.props.requesting 
    });

    return(
      <div className="base">
        
        <div className={loadingClass}>
          <BeatLoader
            color={'#0159b3'} 
            size={20}
            loading={this.props.requesting} 
          />
        </div>

          <header>
              <Nav />
          </header>
          <Switch>  
            <Route exact path="/login/" render={() => (
                <Login {...this.props}/>
            )}/>
            <Route path="/" render={() => (
                <div className="App">
                  <div className="outer-content">
                    <MenuContainer 
                      {...this.props} 
                    />
                    <TransparencyRouter 
                      {...this.props} 
                    />
                 </div>
               </div>
            )}/>
          </Switch>
   
          <footer>
              <p className='footer-content'>Copyright © 2018 The Rock Creek Group All rights reserved.</p>
          </footer>
      </div>
    )
  }
}

const StateToProps = (state, ownProps) => {  
  return {
    apps : apps(state),
    requesting : state.requesting,
    user : state.auth.user,
    warnings : state.warnings,
    errors : state.errors,
  }
};
const DispatchToProps = (dispatch, ownProps) => {
  return {}
};
export default withRouter(connect(StateToProps, (DispatchToProps))(Base));  