import React from 'react';  
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { Route, Router, Switch } from 'react-router'
import { Redirect } from 'react-router-dom'
import moment from 'moment'

import HistoricalPerformance from './performance/HistoricalPerformance'
import PerformanceAttribution from './performance/PerformanceAttribution'
import SnapshotExposures from './exposures/SnapshotExposures'
import ExposureExplorer from './exposures/ExposureExplorer'
import HistoricalExposures from './exposures/HistoricalExposures'
import HistoricalPositions from './positions/HistoricalPositions'
import TopPositions from './positions/TopPositions'
import ProxyPositions from './positions/ProxyPositions'
import ManagerQuant from './Quant'

import Sidebar from './Sidebar'
import Actions from '../../actions'

class Home extends React.Component {
  onAdd(e, manager){
  }
  render() {
    return (
      <div className="with-sidebar">
        {this.props.sidebarShowing && 
          <Sidebar 
            {...this.props}
          />
        }

          {<Route exact path='/managers' render={(props) => (
            <Redirect to={{ pathname : '/managers/perf', state : { from : '/managers'}}} />
          )} /> }

          <Switch>
            <Route exact path='/managers/perf/attr' render={() => (
              <PerformanceAttribution {...this.props}/>
            )}/>
            <Route exact path='/managers/perf/hist' render={() => (
              <HistoricalPerformance 
                  {...this.props} 
              />
            )}/>
            <Route path='/managers/perf' render={() => (
              <HistoricalPerformance {...this.props}/>
            )}/>
          </Switch>

          <Switch>
            <Route path='/managers/exp/explore/' render={(props) => (
              <ExposureExplorer {...this.props}/>
            )}/>
            <Route path='/managers/exp/snap/' render={(props) => (
              <SnapshotExposures {...this.props}/>
            )}/>
            <Route path='/managers/exp/hist/' render={(props) => (
              <HistoricalExposures {...this.props}/>
            )}/>
            <Route path='/managers/exp/' render={(props) => (
              <HistoricalExposures {...this.props}/>
            )}/>
          </Switch>

          <Switch>
            <Route exact path='/managers/pos/proxy' render={(props) => (
              <ProxyPositions {...this.props}/>
            )}/>
            <Route exact path='/managers/pos/top' render={(props) => (
              <TopPositions {...this.props}/>
            )}/>
             <Route exact path='/managers/pos/hist' render={(props) => (
              <HistoricalPositions {...this.props}/>
            )}/>
            <Route path='/managers/pos/' render={(props) => (
              <HistoricalPositions {...this.props}/>
            )}/>
          </Switch>

          {<Route exact path='/managers/quant' render={(props) => (
              <ManagerQuant {...this.props}/>
          )} /> }
      </div>
    )
  }
}

const HomeStateToProps = (state, ownProps) => {  
  return {
    selected : state.managers.selected,
    manager : state.managers.manager,
    returns : state.managers.returns,
    exposure : state.managers.exposure,
    exposures : state.managers.exposures,
    betas : state.managers.betas,
    categorized_exposure : state.managers.categorized_exposure,
    categorized_exposures : state.managers.categorized_exposures,
    sidebarShowing: state.sidebarShowing,
    dates : state.dates,
  };
};

const HomeDispatchToProps = (dispatch, ownProps) => {
  return {
    changeDate: (changes) => dispatch(Actions.changeDate(changes)),
    getManager: (id) => dispatch(Actions.manager.get(id)),
    getManagerBetas: (id, options) =>  dispatch(Actions.manager.returns.getBetas(id, options)),
    getManagerExposure: (id, date) =>  dispatch(Actions.manager.exposure.get(id, date)),
    getManagerCategoryExposure: (id, date, options) =>  dispatch(Actions.manager.exposure.getCategory(id, date, options)),
    getManagerExposures: (id) =>  dispatch(Actions.manager.exposures.get(id)),
    getManagerCategoryExposures: (id, options) =>  dispatch(Actions.manager.exposures.getCategories(id, options)),
  }
};

export default connect(HomeStateToProps, HomeDispatchToProps)(Home);  

