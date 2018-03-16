import React from 'react';
import _ from 'underscore'
import moment from 'moment'

import Picker from 'react-month-picker'
import 'react-month-picker/css/month-picker.css'
import { Utilities } from '../../utilities'

import MonthBox from './MonthBox'
import './toolbar.css'

class ToolbarDateRange extends React.Component{
	constructor(props, context){
		super(props, context)
		this.Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	}
	// To Do: We Cannot Limit Return Years Based on Current State Since That Will Prevent Us from Going Outside State
	// We Want to Set Bounds Based on Return Bounds
	get years(){
		var start_mmt = moment({ 
			year : 2000,
			month : 1, 
			day : 1
		})
		var end_mmt = moment({
		 	year : 2020, 
		 	month : 1, 
		 	day : 1
		})

		var series = Utilities.generateMonthSeries(start_mmt, end_mmt, 'parsed')
		var years = _.uniq(_.pluck(series, 'year'))
		return years
	}
	handleClickMonthBox(e) {
        this.refs[e.target.id].show()
    }
    handleDateChange(id, year, month) {
    	if(this.props.dates[id]){
	      if(this.props.dates[id]['year'] == year && this.props.dates[id]['month'] == month){
	        return 
	      }
	    }
		this.props.handleDateChange(id, year, month - 1)
    }
    handleMonthDissmis(id, value) {
    	this.handleDateChange(id, value.year, value.month)
    }
    startDate(format){
    	format = format || 'default'
    	var startDates = {} // Defaults

    	var date = new moment(new Date(this.props.dates.start.year, this.props.dates.start.month, 1))
    	if(!date.isValid()) throw new Error('Invalid Start Date')
		
		startDates['default'] = {'month' : date.month() + 1, 'year' : date.year() }
		startDates['string'] = this.Months[date.month()] + ' - ' + date.year()
    	return startDates[format]
    }
    endDate(format){
    	format = format || 'default'
    	var endDates = {} // Defaults

    	var date = new moment(new Date(this.props.dates.end.year, this.props.dates.end.month, 1))
		if(!date.isValid()) throw new Error('Invalid End Date')
		
		endDates['default'] = {'month' : date.month() + 1, 'year' : date.year() }
		endDates['string'] = this.Months[date.month()] + ' - ' + date.year()
    	return endDates[format]
    }
	render(){
		return (
		   <div className="toolbar-daterange-container">
		   		<div className="toolbar-datepicker-container">
				   <Picker
		                ref="start"
		                years={this.years}
		                value={this.startDate()}
		                lang={this.Months}
		                onChange={(year, month) => this.handleDateChange('start', year, month)}
		                onDismiss={(value) => this.handleMonthDissmis('start', value)}
		                >
		                <MonthBox 
		                	id="start"
		                	value={this.startDate('string')} 
		                	onClick={this.handleClickMonthBox.bind(this)} 
		                />
		            </Picker>
		        </div>
	        	<p className="from-to"> to </p>
		        <div className="toolbar-datepicker-container">
				   <Picker
		                ref="end"
		                years={this.years}
		                value={this.endDate()}
		                lang={this.Months}
		                onChange={(year, month) => this.handleDateChange('end', year, month)}
		                onDismiss={(value) => this.handleMonthDissmis('end', value)}
		                >
		                <MonthBox 
		                	id="end"
		                	value={this.endDate('string')} 
		                	onClick={this.handleClickMonthBox.bind(this)} 
		                />
		            </Picker>
		        </div>
		    </div>
		)
	}
}

export default ToolbarDateRange;