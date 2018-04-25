import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group'
var classNames = require('classnames')

export const AlertMessage = function(props){
	var classAttributes = {
       "alert-message" : true,
    }
    if(props.type == 'error'){
    	classAttributes['error'] = true;
    }
    else if(props.type == 'wanring'){
    	classAttributes['warning'] = true;
    }
	const classes = classNames(classAttributes)
	return <p className={classes}> {props.children} </p>
}

export class WarningAlertBox extends React.Component {
	constructor(props, context){
		super(props, context)
	}
	render(){
		return (
		   <div className="alert-container warning">
		   		{this.props.warning && 
		   			<AlertMessage> 
		   				{this.props.warning.message} 
		   			</AlertMessage>
		   		}
		   		{this.props.warnings && this.props.warnings.map((warning) => {
		   			return (
		   				<AlertMessage key={warning.id} type='warning'>
		   					{warning.message} 
		   				</AlertMessage>
		   			)
		   		})}
		   </div>
		)
	}
}

export class ErrorAlertBox extends React.Component {
	constructor(props, context){
		super(props, context)
	}
	render(){
		return (
		   <div className="alert-container error">
		   		{this.props.error && 
		   			<AlertMessage>
		   				{this.props.error.message} 
		   			</AlertMessage>
		   		}
		   		{this.props.errors && this.props.errors.map((error) => {
		   			return (
		   				<AlertMessage key={error.id} type='error'>
		   					{error.message} 
		   				</AlertMessage>
		   			)
		   		})}
		   </div>
		)
	}
}

export class AlertControl extends React.Component {
	constructor(props, context){
		super(props, context)
	}
	static propTypes = {
	    warning: PropTypes.string,
	    error: PropTypes.string,
	    warnings: PropTypes.array,
	    errors: PropTypes.array,
	};
	render(){
		var showError = false;
		if(this.props.error || (this.props.errors && this.props.errors.length != 0)){
			showError = true;
		}
		var showWarning = false;
		if(this.props.warning || (this.props.warnings && this.props.warnings.length != 0)){
			showWarning = true;
		}
		return (
		    <CSSTransitionGroup
		  	   transitionName="alert"
	           transitionEnterTimeout={500}
	           transitionLeaveTimeout={300}>
			   {showError && 
			   	<ErrorAlertBox error={this.props.error} errors={this.props.errors} />
			   }
			   {showWarning && 
			   	<WarningAlertBox warning={this.props.warning} warnings={this.props.warnings} />
			   }
			</CSSTransitionGroup>
		)
	}
}