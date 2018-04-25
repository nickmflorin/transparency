import React from 'react';
import _ from 'underscore'

// Router Related Imports
import { Route, Switch } from 'react-router'
import { Redirect, BrowserRouter, Router, withRouter } from 'react-router-dom'

// Importing Container Pages
import DailyPlatform from './analysis/DailyPlatform'
import DailyMetrics from './analysis/DailyMetrics'

import IndexScreen from './indices/IndexScreen'
import Indices from './indices/Indices'
import RCGIndices from './indices/RCGIndices'
import AAMDashboard from './aam/AAMDashboard'
import AAM from './aam/AAM'
import Data from './data/Data'
import Home from './home/Home'
import ManagerComparison from './analysis/manager_comparison/ManagerComparison'

import PrivateRoute from './PrivateRoute'

const hasApp = (apps, id) => {
	const allowed = _.pluck(apps, 'id')
	if(_.contains(allowed, id)){
		return true 
	}
	return false 
}

// To Do: Have to Adjust Default App for Endpoint Without Secondary Query Param Based on Whether or Not User Has Access
const TransparencyRouter = (props) => (
	<div className="content">
		<Route exact path='/' render={(props) => (
		    <Redirect to={{ pathname : '/managers', state : { from : '/'}}} />
		)}/>

	    <Switch>
	    	<PrivateRoute path='/managers' component={Home} {...props}/>
	    	<PrivateRoute exact path='/data/' component={Data} {...props}/>
		    <Switch>
	      	   <PrivateRoute exact path='/analysis/dailymet' component={DailyMetrics} {...props}/>
		       <PrivateRoute exact path='/analysis/dailyplat' component={DailyPlatform} {...props}/>
		       <PrivateRoute exact path='/analysis/mgrcomp' component={ManagerComparison} {...props}/>
		       <PrivateRoute path='/analysis' component={ManagerComparison} {...props}/>
		    </Switch>

		    <Switch>
		      <PrivateRoute exact path='/benchmarks/indices' component={Indices} {...props}/>
		      <PrivateRoute exact path='/benchmarks/rcgind' component={RCGIndices} {...props}/>
		      <PrivateRoute exact path='/benchmarks/indscreen' component={IndexScreen} {...props}/>
		      <PrivateRoute path='/benchmarks' component={Indices} {...props}/>
		    </Switch>

		     <Switch>
		     	<PrivateRoute exact path='/alloc/aam' component={AAM} {...props}/>
		      	<PrivateRoute exact path='/alloc/aamdash' component={AAMDashboard} {...props}/>
		      	<PrivateRoute path='/alloc' component={AAM} {...props}/>
		    </Switch>
	    </Switch>
	</div>
)

export default TransparencyRouter;