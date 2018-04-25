import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSortUp from '@fortawesome/fontawesome-free-solid/faSortUp'

var classNames = require('classnames');

// Panel Options Not Currently Implemented
export class PanelOptions extends React.Component {
	static propTypes = {
		buttons : PropTypes.array.isRequired,
	};
	render(){
		console.log(this.props.buttons)
		return (
		   <div className='panel-options'>
		   		{this.props.buttons.map((button) => {
		   			return(
		   				<a className='panel-link' key={button.id} onClick={button.onClick}> 
		   				{button.iconLeft && 
		   					(<span className='panel-icon-left'>
		                      <FontAwesomeIcon icon={button.iconLeft}/> 
		                    </span>)
		   				}
		   				{button.label} 
		   				{button.iconRight && 
		   					(<span className='panel-icon-right'>
		                      <FontAwesomeIcon icon={button.iconRight}/> 
		                    </span>)
		   				}
		   				</a>
		   			)
		   		})}
		   </div>
		)
	}
}

const PanelHeader = function(props){
	return (
	    <div className="panel-header flex">
	    	<div className="flex-grow">
		    	<h2 className="title"> {props.title} </h2>
		    	{props.subtitle && 
		    		<h2 className="subtitle"> {props.subtitle} </h2>
		    	}
		    </div>
		    {props.options}
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
		   				// options={this.props.options}
		   			/>
		   		}
		   		<div className={panelClass}>
		   			{this.props.children}
		   		</div>
		   </div>
		)
	}
}

