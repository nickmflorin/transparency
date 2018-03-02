import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Router, browserHistory } from 'react-router';
import Base from './layout/base.js'

class App extends React.Component {
  render() {
    return (
      <Base />
    );
  }
}

export default App;
