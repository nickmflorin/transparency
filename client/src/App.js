import React from 'react';
import PropTypes from 'prop-types';

// Router Related Imports
import { Route, Switch } from 'react-router'
import { Redirect } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

// Redux Related Imports
import { PersistGate } from 'redux-persist/integration/react' // Not Used Currently
import { Provider } from 'react-redux'
import { store, history } from './reducers'

import Base from './Base'
import Login from './containers/login/Login'
import Nav from './containers/Nav'

// Importing Configuration Setups
import { Configuration } from './config'
import './style/App.scss'

// Disabled Apps
const Disabled = {
  app : ['benchmarks','aam','daily_metrics','daily_platform'],
  manager : ['quant','pos','attribution_perf']
}
const config = Configuration(Disabled)

class App extends React.Component {
  render(){
    return (
      <Provider store={store}>
          <ConnectedRouter history={history}>
            <div className="base">
                <header>
                    <Nav />
                </header>
                <section>
                  <Switch>  
                    <Route exact path="/login/" render={() => (
                        <Login history={history} {...this.props}/>
                    )}/>
                    <Route path="/" render={() => (
                        <Base history={history} config={config} {...this.props}/>
                    )}/>
                  </Switch>
                </section>
                <footer>
                    <p className='footer-content'>Copyright © 2018 The Rock Creek Group All rights reserved.</p>
                </footer>
            </div>
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default App;

