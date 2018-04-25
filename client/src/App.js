import React from 'react';
import PropTypes from 'prop-types';

// Redux Related Imports
import { ConnectedRouter } from 'react-router-redux'
import configureStore from './_store'
import createHistory from 'history/createBrowserHistory'

import { PersistGate } from 'redux-persist/integration/react' // Not Used Currently
import { Provider } from 'react-redux'

// Importing Container Element Components
import Base from './containers/Base'

// Importing Configuration Setups
import './style/App.scss'

const history = createHistory()
const store = configureStore(history)

export class App extends React.Component {
  render(){
    return (
      <Provider store={store}>
          <ConnectedRouter history={history}>
              <Base history={history} {...this.props} />
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default App;