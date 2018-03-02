import React from 'react';
import { BrowserRouter, Switch, Route, withRouter} from 'react-router-dom'
import { Router, hashHistory, IndexRoute } from 'react-router';

import Data from '../pages/data/data.js'
import Home from '../pages/home/home.js'
import ManagerComparison from '../pages/manager_comparison/manager_comparison.js'
import DailyPlatform from '../pages/daily_platform/daily_platform.js'
import DailyMetrics from '../pages/daily_metrics/daily_metrics.js'
import IndexScreen from '../pages/index_screen/index_screen.js'
import Indices from '../pages/indices/indices.js'
import RCGIndices from '../pages/rcg_indices/rcg_indices.js'
import AssetAllocation from '../pages/aam/aam.js'
import AssetAllocationDashboard from '../pages/aam_dashboard/aam_dashboard.js'

import NavBar from './nav/nav'
import './layout.css'

function Footer(props) {
  return (
    <footer>
        <p className='footer-content'>Copyright © 2016 Rock Creek Insights All rights reserved.</p>
    </footer>
  );
}

function Header(props) {
  return (
    <header>
        <NavBar />
    </header>
  );
}

// ALlows Props to be Passed to Routes Dynamically
const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }}/>
  );
}

// Contains Navigation Bar and Main Content Area, Does Not Include Static Footer
// To Do: Design Header So Each Page Component Can Include as Component and Pass In Buttons and Button Handlers for Nav Bar
class Base extends React.Component {
	constructor(props){
		super(props)
		this.state = {'selectedManager' : null}
	}
	onAdd(e, result){
		console.log('Manager Added')
	}
	// Called When Manager Selected from Search Bar
	onSelect(e, result){
		this.setState({'selectedManager' : result})
	}
	render(){
		return (
		    <BrowserRouter>
		    	<div className="base">
		    	<Header></Header>
		    	<section>
		            <PropsRoute exact path="/" component={Home} name="home" selectedManager={this.state.selectedManager}/>
		            <Route exact path="/data" component={Data} selectedManager={this.state.selectedManager}></Route>

		            <PropsRoute exact path="/mgrcomp" component={ManagerComparison} selectedManager={this.state.selectedManager}/>
		            <Route exact path="/dailymet" component={DailyMetrics} selectedManager={this.state.selectedManager}></Route>
		            <Route exact path="/dailyplat" component={DailyPlatform} selectedManager={this.state.selectedManager}></Route>

		            <Route exact path="/indices" component={Indices} selectedManager={this.state.selectedManager}></Route>
		            <Route exact path="/rcgind" component={RCGIndices} selectedManager={this.state.selectedManager}></Route>
		            <Route exact path="/indscreen" component={IndexScreen} selectedManager={this.state.selectedManager}></Route>

		            <Route exact path="/aam" component={AssetAllocation} selectedManager={this.state.selectedManager}></Route>
		            <Route exact path="/aamdash" component={AssetAllocationDashboard} selectedManager={this.state.selectedManager}></Route>
	            </section>
	            <Footer></Footer>
	            </div>
            </BrowserRouter>
		)
	}
}

export default Base;