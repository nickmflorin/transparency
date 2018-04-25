import { createStore, applyMiddleware, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'

import createMiddleware from './_middleware'
import { persistedReducer } from './reducers'

export const configureStore = function(history) {
    let middleWare = createMiddleware(history)
    let store = createStore(persistedReducer, applyMiddleware(...middleWare))
    persistStore(store)
    return store
}

export default configureStore;


