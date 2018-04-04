import React from 'react';
import ReactDom from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import App from './App'

ReactDom.render(
  <App />,
  document.getElementById('root')
)

registerServiceWorker();
