import { combineReducers } from 'redux';
import * as reducers from './reducers'
import * as actions from './actions'

export * from './actions'
export * from './models'

export const managerReducer = combineReducers({  
    search_results: reducers.search_results,
    searches : reducers.searches,
    manager: reducers.manager,
    selected: reducers.selected,
    exposures : reducers.exposures,
    exposure : reducers.exposure,
    categorized_exposures : reducers.categorized_exposures,
    returns : reducers.returns,
    betas : reducers.betas,
});

export const managerActions = {
    manager : {
        select : actions.selectManager,
        search : actions.searchManager,
        get : actions.getManager,
        exposure : {
            get : actions.getManagerExposure,
        },
        exposures : {
            get : actions.getManagerExposures,
            getCategories : actions.getManagerCategoryExposures,
        },
        returns : {
            get : actions.getManagerReturns, 
            getBetas : actions.getManagerBetas, 
        }
    }
}
