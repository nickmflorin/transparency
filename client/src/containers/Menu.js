import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { Actions } from '../store'
import { MenuBar } from '../components/menu/'

class MenuContainer extends React.Component {
  static propTypes = {
    config : PropTypes.object.isRequired
  }
	render(){
		return (
		   <MenuBar 
            apps={this.props.config.app}
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