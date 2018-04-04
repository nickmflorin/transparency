import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';

// Router Related Imports
import { Route, Switch } from 'react-router'
import { Redirect, BrowserRouter, Router, withRouter } from 'react-router-dom'

// Redux Related Imports
import { connect } from 'react-redux'

// Importing Loading and Global Components
import { BeatLoader } from 'react-spinners';

// Importing Container Pages
import DailyPlatform from './containers/analysis/DailyPlatform'
import DailyMetrics from './containers/analysis/DailyMetrics'

import IndexScreen from './containers/indices/IndexScreen'
import Indices from './containers/indices/Indices'
import RCGIndices from './containers/indices/RCGIndices'
import AAMDashboard from './containers/aam/AAMDashboard'
import AAM from './containers/aam/AAM'
import Data from './containers/data/Data'
import Home from './containers/home/Home'
import ManagerComparison from './containers/analysis/manager_comparison/ManagerComparison'

// Importing Container Element Components
import MenuContainer from './containers/Menu'
import PrivateRoute from './PrivateRoute'

var classNames = require('classnames');

class Base extends React.Component {
  static propTypes = {
    config : PropTypes.object.isRequired
  }
  render(){
    const loadingClass = classNames({ 
      loading: true,
      "loading-visible": this.props.requesting 
    });
    return (
      <div className="App">
          <div className={loadingClass}>
            <BeatLoader
              color={'#0159b3'} 
              size={20}
              loading={this.props.requesting} 
            />
          </div>

          <div className="menu-content">
            <MenuContainer 
              {...this.props} 
            />
            
          <Route exact path='/' render={(props) => (
              <Redirect to={{ pathname : '/managers', state : { from : '/'}}} />
          )}/>

          <Switch>
            <PrivateRoute path='/managers' component={Home} {...this.props} manager_apps={this.props.config.manager}/>
            <PrivateRoute exact path='/data' component={Data} {...this.props}/>

            <Switch>
              <PrivateRoute exact path='/analysis/dailymet' component={DailyMetrics} {...this.props}/>
              <PrivateRoute exact path='/analysis/dailyplat' component={DailyPlatform} {...this.props}/>
              <PrivateRoute exact path='/analysis/mgrcomp' component={ManagerComparison} {...this.props}/>
              <PrivateRoute path='/analysis' component={ManagerComparison} {...this.props}/>
            </Switch>

            <Switch>
              <PrivateRoute exact path='/benchmarks/indices' component={Indices} {...this.props}/>
              <PrivateRoute exact path='/benchmarks/rcgind' component={RCGIndices} {...this.props}/>
              <PrivateRoute exact path='/benchmarks/indscreen' component={IndexScreen} {...this.props}/>
              <PrivateRoute path='/benchmarks' component={Indices} {...this.props}/>
            </Switch>

             <Switch>
              <PrivateRoute exact path='/aam/model' component={AAM} {...this.props}/>
              <PrivateRoute exact path='/aam/aamdash' component={AAMDashboard} {...this.props}/>
              <PrivateRoute path='/aam' component={AAM} {...this.props}/>
            </Switch>
           </Switch>

         </div>
      </div>
    )
  }
}

const StateToProps = (state, ownProps) => {  
  return {
    requesting : state.requesting,
  }
};
const DispatchToProps = (dispatch, ownProps) => {
  return {}
};

export default withRouter(connect(StateToProps, (DispatchToProps))(Base));  