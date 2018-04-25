import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import _ from 'underscore'

import Actions from '../actions'
import { isAuthenticated } from '../reducers'
import { MenuBar } from '../components/menu/'

class MenuContainer extends React.Component {
  static propTypes = {
    apps : PropTypes.array.isRequired
  }
	render(){
		return (
		   <MenuBar 
            {...this.props}
        />
		)
	}
}

const StateToProps = (state, ownProps) => {  
  return {
    selected : state.managers.selected,
    search_results : state.managers.search_results,
    searches : state.managers.searches,
    managers: state.managers.all,
  };
};

const DispatchToProps = (dispatch, ownProps) => {
  return {
    searchManager: (search) =>  dispatch(Actions.manager.search(search)),
    selectManager : (manager) => dispatch(Actions.manager.select(manager))
  }
};

export default connect(StateToProps, DispatchToProps)(MenuContainer);  