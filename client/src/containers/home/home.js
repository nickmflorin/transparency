import React from 'react';  
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { Route, Router, Switch } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import { Redirect } from 'react-router-dom'

import _ from 'underscore'
import moment from 'moment'
import $ from 'jquery'

import MenuBar from '../../components/menu/menu'
import ManagerHeader from '../../components/elements/ManagerHeader'
import ManagerSidebar from '../../components/sidebar/ManagerSidebar'

import { clearManagers, removeManager, updateManagerReturns, selectManager, getManagerExposures } from '../../actions'
import ManagersAPI from '../../api/manager'

import { ManagerHistoricaPerformance, ManagerPerformanceAttribution } from './returns'
import { ManagerSnapshotExposures, ManagerExposureExplorer, ManagerHistoricalExposures } from './exposures'
import { ManagerTopPositions, ManagerHistoricalPositions, ManagerProxyPositions } from './positions'
import { ManagerQuant } from './quant'

import PrivateRoute from '../PrivateRoute'
import './home.css'

class HomeBody extends React.Component {

}

class Home extends React.Component {
  constructor(props, context){
    super(props, context)

    var initDate = new moment()
    this.state = {
      fade : false,
      date : { month : initDate.month(), year : initDate.year() }
    }
  }
  
  onAdd(e, manager){
  }
  handleDateChange(id, year, month){
    this.setState({ date : { month : month, year : year }})
    console.log('updating date')
    console.log({ date : { month : month, year : year }})
    return
    if(this.props.manager){
      const manager = this.props.manager
      var date = new moment(new Date(this.state.date.year, this.state.date.month, 1))
      this.props.selectManager(
          manager.id, 
          {'group' : [], date : date.format('YYYY-MM-DD')} // Flags API to Get Relative Stats to Peers and Benchmarks
      )
    }
  }
  onSelect(e, manager){
    var date = new moment(new Date(this.state.date.year, this.state.date.month, 1))
    this.props.selectManager(
        manager.id, 
        {'group' : [], date : date.format('YYYY-MM-DD')} // Flags API to Get Relative Stats to Peers and Benchmarks
    )
  }
  render() {
    return (
      <div className="menu-content">
          <MenuBar 
            onSelect={this.onSelect.bind(this)} 
            onAdd={this.onAdd.bind(this)}
          />
          <div className="content-with-sidebar">
              <ManagerSidebar />

              <div className="padded-content">
                <ManagerHeader 
                  manager={this.props.manager} 
                  date={this.state.date}
                  handleDateChange={this.handleDateChange.bind(this)}
                />

                {<Route exact path='/managers' render={(props) => (
                  <Redirect to={{ pathname : '/managers/perf', state : { from : '/managers'}}} />
                )} /> }

                <Switch>
                  <Route exact path='/managers/perf/attr' render={() => (
                    <ManagerPerformanceAttribution {...this.props} date={this.state.date}/>
                  )}/>
                  <Route exact path='/managers/perf/hist' render={() => (
                    <ManagerHistoricaPerformance {...this.props} date={this.state.date}/>
                  )}/>
                  <Route path='/managers/perf' render={() => (
                    <ManagerHistoricaPerformance {...this.props} date={this.state.date}/>
                  )}/>
                </Switch>

                <Switch>
                  <Route exact path='/managers/exp/explore' render={(props) => (
                    <ManagerExposureExplorer {...this.props} date={this.state.date}/>
                  )}/>
                  <Route exact path='/managers/exp/snap' render={(props) => (
                    <ManagerSnapshotExposures {...this.props} date={this.state.date}/>
                  )}/>
                  <Route exact path='/managers/exp/hist' render={(props) => (
                    <ManagerHistoricalExposures {...this.props} date={this.state.date}/>
                  )}/>
                  <Route path='/managers/exp' render={(props) => (
                    <ManagerHistoricalExposures {...this.props} date={this.state.date}/>
                  )}/>
                </Switch>

                <Switch>
                  <Route exact path='/managers/pos/proxy' render={(props) => (
                    <ManagerProxyPositions {...this.props} date={this.state.date}/>
                  )}/>
                  <Route exact path='/managers/pos/top' render={(props) => (
                    <ManagerTopPositions {...this.props} date={this.state.date}/>
                  )}/>
                   <Route exact path='/managers/pos/hist' render={(props) => (
                    <ManagerHistoricalPositions {...this.props} date={this.state.date}/>
                  )}/>
                  <Route path='/managers/pos' render={(props) => (
                    <ManagerHistoricalPositions {...this.props} date={this.state.date}/>
                  )}/>
                </Switch>

                {<Route exact path='/managers/quant' render={(props) => (
                    <ManagerQuant {...this.props} date={this.state.date}/>
                )} /> }
              </div>
          </div>
      </div>
    )
  }
}

const HomeStateToProps = (state, ownProps) => {  
  return {
    manager : state.mgrs.manager,
    exposures : state.mgrs.exposures,
  };
};

const HomeDispatchToProps = (dispatch, ownProps) => {
  return {
    removeManager: (id) =>  dispatch(removeManager(id)),
    clearManagers: () =>  dispatch(clearManagers()),
    updateManagerReturns: (ids, start_date, end_date) =>  dispatch(updateManagerReturns(ids, start_date, end_date)),
    selectManager: (id, start_date, end_date, options) =>  dispatch(selectManager(id, start_date, end_date, options)),
    getManagerExposures: (id) =>  dispatch(getManagerExposures(id)),
  }
};

export default connect(HomeStateToProps, HomeDispatchToProps)(Home);  

