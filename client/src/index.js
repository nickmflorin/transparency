import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Link, Route } from 'react-router-dom';

import './ui/style/text.css'
import './ui/style/modal.css'
import './ui/style/input.css'
import './ui/style/tables.css'
import './ui/style/buttons.css'
import './ui/style/list.css'
import './ui/style/links.css'
import './ui/style/toolbar.css'

import './ui/style/loading.css'
import './ui/style/CodeMirror.css'

import './ui/style/utility.css'
import './ui/style/root.css'

import App from './ui/App';
import registerServiceWorker from './registerServiceWorker';

ReactDom.render(
    <App />,
    document.getElementById('root')
)

registerServiceWorker();

