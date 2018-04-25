import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import Actions from '../../actions'
import { ManagerSidebar } from '../../components/sidebar/'

class Sidebar extends React.Component {
	render(){
		return (
		   <ManagerSidebar 
            searches={this.props.searches}
            history={this.props.history}
            apps={this.props.apps}
            selectManager={this.props.selectManager}
          />
		)
	}
}

const StateToProps = (state, ownProps) => {  
  return {
    searches : state.managers.searches,
    search_results : state.managers.search_results,
  };
};

const DispatchToProps = (dispatch, ownProps) => {
  return {
    selectManager : (manager) => dispatch(Actions.manager.select(manager))
  }
};

export default connect(StateToProps, DispatchToProps)(Sidebar);  

