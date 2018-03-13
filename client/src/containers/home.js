import React from 'react';  
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import _ from 'underscore'
import moment from 'moment'
import $ from 'jquery'

import MenuBar from '../components/menu/menu'
import ManagerHeader from '../components/elements/ManagerHeader'
import { ReturnsTable } from '../components/tables'
import { ReturnsBarChart } from '../components/charts'

import { clearManagers, removeManager, updateManagerReturns, selectManager, clearManagerLists, Loading } from '../actions'
import ManagersAPI from '../api/manager'

import './home.css'

class Home extends React.Component {
  constructor(props, context){
    super(props, context)

    this.state = {
      active : null, // Manager Clicked in Table
      selectedManager : null,
      dates : { 
        start : { month : 0, year : 2012 }, 
        end : { month : 0, year : 2018 }
      },
    }
  }
  componentWillReceiveProps(nextProps) {
    var self = this 

    // To Do: Filter Managers to Make Sure Multiple Selected Managers Do Not Exist
    var selectedManager = null;
    if(nextProps.managers.length != 0){
      _.each(nextProps.managers, function(manager){
        if(manager.selected){
          selectedManager = manager;
        }
      })
      if(selectedManager){
        self.setState({ selectedManager : selectedManager })
        self.setState({ active : selectedManager })
      }
      else{
        // Here We Have to Worry About Removing Selected Manager but Setting Active Manager
        self.setState({ selectedManager : nextProps.managers[0] })
        self.setState({ active : nextProps.managers[0] })
      }
    }
    else{
      self.setState({ selectedManager : null })
      self.setState({ active : null })
    }
  }
  onAdd(e, manager){
    console.log('Adding')
    console.log(manager)
  }
  onSelect(e, manager){
    var start_mmt = new moment(new Date(this.state.dates.start.year, this.state.dates.start.month, 1))
    var end_mmt = new moment(new Date(this.state.dates.end.year, this.state.dates.end.month, 1))
    var exists = _.findWhere(this.props.managers, { id : manager.id })

    if(!exists){
      this.props.selectManager(manager.id, start_mmt.format('YYYY-MM-DD'), end_mmt.format('YYYY-MM-DD'))
    }
    else{
      console.log('Manager Already in List')
    }
  }
  setActiveManager(e, manager){
    this.setState({ active : manager })
  }
  removeManager(manager){
    this.props.removeManager(manager.id)
  }
  onClear(e){
    this.props.clearManagers()
  }
  render() {
    return (
      <div className="menu-content">

        <MenuBar 
          onSelect={this.onSelect.bind(this)} 
          onAdd={this.onAdd.bind(this)}
        />

        <div className="content">
          {this.state.active && 
            <ManagerHeader manager={this.state.active} />
          }
          <div className="manager-home-top" style={{marginTop:10}}>
            <div className="left">
              <ReturnsTable 
                title={this.state.active && this.state.active.name}
                subtitle={this.state.active && this.state.active.id}
                dates={this.state.dates}
                complete={(this.state.active && this.state.active.returns && this.state.active.returns.complete) || []}
                in_range={(this.state.active && this.state.active.returns && this.state.active.returns.series) || []}
              />
            </div>
            <div className="right">
              <ReturnsBarChart 
                managers={this.state.managers}
              />
            </div>
          </div>

          <div className="manager-home-bottom">
          </div>
        </div>
    </div>
    )
  }
}

const HomeStateToProps = (state, ownProps) => {  
  return {
    managers : state.managers
  };
};

const HomeDispatchToProps = (dispatch, ownProps) => {
  return {
    removeManager: (id) =>  dispatch(removeManager(id)),
    clearManagers: () =>  dispatch(clearManagers()),
    updateManagerReturns: (ids, start_date, end_date) =>  dispatch(updateManagerReturns(ids, start_date, end_date)),
    selectManager: (id, start_date, end_date) =>  dispatch(selectManager(id, start_date, end_date, false)),

    startLoading: () =>  dispatch(Loading.startLoading()),
    stopLoading: () =>  dispatch(Loading.stopLoading()),
  }
};

export default connect(HomeStateToProps, HomeDispatchToProps)(Home);  

