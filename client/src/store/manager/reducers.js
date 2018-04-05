import { combineReducers } from 'redux';
import update from 'react-addons-update';
import _ from 'underscore'
import store from './index'

import { Manager, ManagerBetas } from './models'

const RECENT_SEARCH_LIMIT = 8

export function manager(state = null, action) {
	switch (action.type) {
		case 'GET_MANAGER_RECEIVED':
			console.log('Received Manager : ',action.data.id)
			return action.data;
		default:
			return state;
	}
};


export function selected(state = null, action) {
	switch (action.type) {
		case 'SELECT_MANAGER':
			return action.data;
		default:
			return state;
	}
};

export function search_results(state = [], action) {
	switch (action.type) {
		case 'SEARCH_MANAGER_RECEIVED':
			return action.data;
		default:
			return state;
	}
};

export function searches(state = [], action) {
	switch (action.type) {
		case 'SELECT_MANAGER':
			const exists = _.findWhere(state, { id : action.data.id })
			if(!exists){
				var updated = [action.data, ...state]
				return [...updated.slice(0, RECENT_SEARCH_LIMIT)]
			}
			return state;
		default:
			return state;
	}
};

export function exposures(state = null, action){
	switch (action.type) {
		case 'GET_MANAGER_EXPOSURES_RECEIVED':
			return action.data;
		default:
			return state;
	}
};

// Snapshot Exposure on Single Date
export function exposure(state = null, action){
	switch (action.type) {
		case 'GET_MANAGER_EXPOSURE_RECEIVED':
			return action.data
		default:
			return state;
	}
};

export function returns(state = null, action){
	switch (action.type) {
		case 'GET_MANAGER_RETURNS_RECEIVED':
			return action.data;
		default:
			return state;
	}
};

export function categorized_exposures(state = null, action){
	switch (action.type) {
		case 'GET_MANAGER_CATEGORIES_RECEIVED':
			return action.data;
		default:
			return state;
	}
};

export function betas(state = null, action){
	switch (action.type) {
		case 'GET_MANAGER_BETAS_RECEIVED':
			return action.data;
		default:
			return state;
	}
};




