import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSortUp from '@fortawesome/fontawesome-free-solid/faSortUp'

var classNames = require('classnames');

// To Do: Not Currently Implementing the Collapsable Panel Feature, Ideally, Button Would Allow Panel Body to Collapse/Hide
const PanelHeader = function(props){
	return (
	    <div className="panel-header flex">
	    	<div className="flex-grow">
		    	<h2 className="title"> {props.title} </h2>
		    	{props.subtitle && 
		    		<h2 className="subtitle"> {props.subtitle} </h2>
		    	}
		    </div>
		    {props.canCollapse && 
		    	<a className="panel-collapse-link" onClick={props.onCollapse}>
		    		<span className="panel-collapse-link-icon">
		    			<FontAwesomeIcon icon={faSortUp}/> 
		    		</span>
		    	</a>
		    }
	    </div>
	)
}

export class Panel extends React.Component {
	static propTypes = {
	};
	render(){
		var classes = { 
			'panel-body' : true,
		}
      	classes = Object.assign({}, classes, this.props.classNames);
		var panelClass = classNames(classes)

		return (
		   <div className='panel' style={{marginTop:10}}>
		   		{this.props.title && 
		   			<PanelHeader 
		   				title={this.props.title} 
		   			/>
		   		}
		   		<div className={panelClass}>
		   			{this.props.children}
		   		</div>
		   </div>
		)
	}
}

