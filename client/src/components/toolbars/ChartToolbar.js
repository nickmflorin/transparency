import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore'
import moment from 'moment'

import { ButtonToolbar } from 'react-bootstrap';
import { ToolbarButton } from '../inputs'

var classNames = require('classnames');

export class ChartToolbarControl extends React.Component {
	constructor(props, context){
		super(props, context)
	}
	onClick(e, id){
      this.props.onClick(e, this.props.id)
    }
	// Parent ID is First, Toggled ID is Second, to Move Up the Ladder of Categoric Breakdowns
	toggle(e, id){
		this.props.toggle(e, this.props.id, id)
	}
	isActive(option){
		return this.props.value == option.id
	}
	static propTypes = {
		id: PropTypes.oneOfType([
		  PropTypes.string,
		  PropTypes.number
		]),
	    options: PropTypes.array.isRequired,
	    type: PropTypes.string.isRequired,
	    toggle: PropTypes.func.isRequired,
	};
	render(){
		return (
		   <ButtonToolbar>
		   {this.props.type == 'button' && this.props.options.map( (option) => {
   				return(
   				    <ToolbarButton 
   				    	id={option.id}
   				    	key={option.id}
   				    	separated={this.props.separated}
   				    	className={"chart-toolbar-btn"}
   				    	active={this.isActive(option)}
   				    	label={option.label}
   				    	onClick={this.toggle.bind(this)}
   				    />
   				)
	   		})}
		   </ButtonToolbar>
		)
	}
}


export class ChartToolbar extends React.Component {
	constructor(props, context) {
    	super(props, context)
    }
    static propTypes = {
	    controls: PropTypes.array.isRequired,
	    toggle: PropTypes.func.isRequired,
	};
	render(){
	    return (
  		<ButtonToolbar>
  			{this.props.controls.map( (control) => {
  				return(
  				    <ChartToolbarControl 
  				    	id={control.id} 
  				    	key={control.id} 
  				    	separated={this.props.separated}
  				    	value={control.value} 
  				    	options={control.options || []} 
  				    	type={control.type} 
  				    	toggle={this.props.toggle}
  				  	/>
  				)
  			})}
		</ButtonToolbar>
		)
	  }
}

