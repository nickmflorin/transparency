import { combineReducers } from 'redux';
import update from 'react-addons-update';
import _ from 'underscore'
import store from './index'

import { Types } from './handler'
import { Manager, ManagerBetas } from './models'

const RECENT_SEARCH_LIMIT = 8

export function manager(state = null, action) {
	switch (action.type) {
		case Types.manager.get.success:
			return action.manager;
		default:
			return state;
	}
};

export function selected(state = null, action) {
	switch (action.type) {
		case Types.manager.select.success:
			return action.manager;
		default:
			return state;
	}
};

export function search_results(state = [], action) {
	switch (action.type) {
		case Types.manager.search.success:
			return action.results;
		default:
			return state;
	}
};

export function searches(state = [], action) {
	switch (action.type) {
		case Types.manager.select.success:
			const exists = _.findWhere(state, { id : action.manager.id })
			if(!exists){
				var updated = [action.manager, ...state]
				return [...updated.slice(0, RECENT_SEARCH_LIMIT)]
			}
			return state;
		default:
			return state;
	}
};


export function categorized_exposures(state = null, action){
	switch (action.type) {
		case Types.manager.categories.get.success:
			return action.categories;
		default:
			if(state === undefined){

				return null;
			}
			return state;
	}
};

export function exposures(state = null, action){
	switch (action.type) {
		case Types.manager.exposures.get.success:
			return action.exposures;
		default:
			return state;
	}
};

// Snapshot Exposure on Single Date
export function exposure(state = null, action){
	switch (action.type) {
		case Types.manager.exposure.get.success:
			return action.exposure
		default:
			return state;
	}
};

export function betas(state = null, action){
	switch (action.type) {
		case Types.manager.betas.get.success:
			var betas = new ManagerBetas(action.betas)
			return betas
		default:
			return state;
	}
};

export function returns(state = null, action){
	switch (action.type) {
		case Types.manager.returns.get.success:
			return action.returns
		default:
			return state;
	}
};


