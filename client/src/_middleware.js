import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga' // Not Currently Used -> Will Use if Implementing React Saga

import { routerMiddleware } from 'react-router-redux'
import { apiMiddleware } from 'redux-api-middleware';

import { dataService, putService, postService, deleteService } from './services/data-service'
import { loginService, logoutService } from './services/auth-service'

export const createMiddleware = function(history){
	const _sagaMiddleware = createSagaMiddleware()
	const _routerMiddleware = routerMiddleware(history)

	return [
		thunk, 
		loginService, 
		logoutService, 
		postService, 
		putService, 
		deleteService, 
		dataService, 
		apiMiddleware, 
		_routerMiddleware,
		_sagaMiddleware,
	]
}

export default createMiddleware;