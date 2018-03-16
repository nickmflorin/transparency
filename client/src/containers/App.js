import React from 'react';
import { connect } from 'react-redux'
import { PulseLoader } from 'react-spinners';
import { Route, Switch } from 'react-router'
import { Redirect } from 'react-router-dom'

import Data from './data.js'
import DailyPlatform from './daily_platform.js'
import DailyMetrics from './daily_metrics.js'
import IndexScreen from './index_screen.js'
import Indices from './indices.js'
import RCGIndices from './rcg_indices.js'
import AssetAllocation from './aam.js'
import AssetAllocationDashboard from './aam_dashboard.js'
import ManagerComparison from './manager_comparison'

import Home from './home/home'
import PrivateRoute from './PrivateRoute'

import * as reducers from '../reducers'

class App extends React.Component {
  render(){
    return (
      <div className="App">
          <div className='loading'>
            <PulseLoader
              color={'#004C97'} 
              loading={this.props.requesting} 
            />
          </div>

          <Route exact path='/' render={(props) => (
              <Redirect to={{ pathname : '/managers', state : { from : '/'}}} />
          )}/>
          <Switch>
            <PrivateRoute path='/managers' component={Home} />
            <PrivateRoute exact path='/data' component={Data} />
            <PrivateRoute exact path='/mgrcomp' component={ManagerComparison} />
            <PrivateRoute exact path='/dailymet' component={DailyMetrics} />
            <PrivateRoute exact path='/dailyplat' component={DailyPlatform} />
            <PrivateRoute exact path='/indices' component={Indices} />
            <PrivateRoute exact path='/rcgind' component={RCGIndices}/>
            <PrivateRoute exact path='/rcgind' component={IndexScreen} />
            <PrivateRoute exact path='/aam' component={AssetAllocation} />
            <PrivateRoute exact path='/aamdash' component={AssetAllocationDashboard}/>
          </Switch>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {  
  return {
    requesting : state.requesting,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(App);  