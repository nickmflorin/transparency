import React from 'react';
import ReactDom from 'react-dom';
import { Route, Switch } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { Provider } from 'react-redux'

import registerServiceWorker from './registerServiceWorker';
import createHistory from 'history/createBrowserHistory'
import configureStore from './reducers'

import App from './containers/App'
import LoginPage from './components/login/LoginPage'
import MenuBar from './components/menu/menu'
import NavBar from './components/nav/nav'

import './style'

const history = createHistory()
const store = configureStore(history)

function Footer(props) {
  return (
    <footer>
        <p className='footer-content'>Copyright © 2018 The Rock Creek Group All rights reserved.</p>
    </footer>
  );
}

function Header(props) {
  return (
    <header>
        <NavBar />
    </header>
  );
}

const render = () => {
    ReactDom.render(
      <Provider store={store}>
        <ConnectedRouter history={history}>
            <div className="base">
                <Header></Header>
                <section>
                  <Switch>
                    <Route exact path="/login/" component={LoginPage} />
                    <Route path="/" component={App} />
                  </Switch>
                </section>
                <Footer />
            </div>
        </ConnectedRouter>
      </Provider>,
      document.getElementById('root')
  )
}

if(process.env.NODE_ENV == 'development' && module.hot) {
    module.hot.accept(['./containers/App', './reducers'], () => {
        store.replaceReducer(require('./reducers').default);
    });
    render();
}

registerServiceWorker();
