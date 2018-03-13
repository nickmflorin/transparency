import React from 'react';
import { connect } from 'react-redux'
import { PulseLoader } from 'react-spinners';
import { Route, Switch } from 'react-router'

import * as reducers from '../reducers'

import Data from './data.js'
import DailyPlatform from './daily_platform.js'
import DailyMetrics from './daily_metrics.js'
import IndexScreen from './index_screen.js'
import Indices from './indices.js'
import RCGIndices from './rcg_indices.js'
import AssetAllocation from './aam.js'
import AssetAllocationDashboard from './aam_dashboard.js'
import ManagerComparison from './manager_comparison'
import Home from './home.js'

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

          <Route exact path="/" component={Home} name="home"></Route>
          <Route exact path="/data" component={Data}></Route>
          <Route exact path="/mgrcomp" component={ManagerComparison}></Route>
          
          <Route exact path="/dailymet" component={DailyMetrics}></Route>
          <Route exact path="/dailyplat" component={DailyPlatform}></Route>

          <Route exact path="/indices" component={Indices}></Route>
          <Route exact path="/rcgind" component={RCGIndices}></Route>
          <Route exact path="/indscreen" component={IndexScreen}></Route>

          <Route exact path="/aam" component={AssetAllocation}></Route>
          <Route exact path="/aamdash" component={AssetAllocationDashboard}></Route>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {  
  return {
    requesting : state.requesting,
    isAuthenticated: reducers.isAuthenticated(state)
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(App);  