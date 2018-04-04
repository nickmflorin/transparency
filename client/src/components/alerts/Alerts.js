import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group'

// Used if No Desired Container Box but Just Red Alert Text
export const ErrorMessage = function(props){
	return <p className="error-message"> {props.message} </p>
}

export class WarningAlert extends React.Component {
	constructor(props, context){
		super(props, context)
	}
	render(){
		return (
		   <div className="alert-container warning-container">
		   		<p className="message"> {this.props.message} </p>
		   </div>
		)
	}
}

export class ErrorAlert extends React.Component {
	constructor(props, context){
		super(props, context)
	}
	render(){
		return (
		   <div className="alert-container error-container">
		   		<p className="message"> {this.props.message} </p>
		   </div>
		)
	}
}

export class AlertControlComponent extends React.Component {
	clear(){
		this.setState({error : null, warning : null})
	}
	warn(message){
		this.setState({error : null, warning : message})
	}
	error(message){
		this.setState({error : message, warning : null})
	}
}

export class AlertControl extends React.Component {
	constructor(props, context){
		super(props, context)
	}
	static propTypes = {
	    warning: PropTypes.string,
	    error: PropTypes.string,
	};
	render(){
		return (
		   <CSSTransitionGroup
		  	   transitionName="alert"
	           transitionEnterTimeout={500}
	           transitionLeaveTimeout={300}>
			   {this.props.error && 
			   	<ErrorAlert message={this.props.error} />
			   }
			   {this.props.warning && 
			   	<WarningAlert message={this.props.warning} />
			   }
			</CSSTransitionGroup>
		)
	}
}