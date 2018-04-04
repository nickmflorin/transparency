import React from 'react';
import PropTypes from 'prop-types'
import { DateInput } from './DateInput'

export class DateRange extends React.Component{
	static propTypes = {
		dates : PropTypes.object.isRequired,
		changeDate : PropTypes.func.isRequired,
	}
	render(){
		return (
		   <div className="flex">
		   		<DateInput
		   			id="start"
		   			date={this.props.dates.start}
		   			changeDate={this.props.changeDate}
		   		/>
		   		<div className="toolbar-text-container">
	        		<p className="emphasis"> to </p>
	        	</div>
		   		<DateInput
		   			id="end"
		   			date={this.props.dates.end}
		   			changeDate={this.props.changeDate}
		   		/>
		   	</div>
		)
	}
}

