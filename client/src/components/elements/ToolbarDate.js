import React from 'react';
import _ from 'underscore'
import moment from 'moment'

import Picker from 'react-month-picker'
import 'react-month-picker/css/month-picker.css'
import { Utilities } from '../../utilities'

import MonthBox from './MonthBox'
import './toolbar.css'

const StartYear = 1995

class ToolbarDate extends React.Component{
	constructor(props, context){
		super(props, context)
		console.log('creating date container')
		this.Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	}
	// To Do: We Cannot Limit Return Years Based on Current State Since That Will Prevent Us from Going Outside State
	// We Want to Set Bounds Based on Return Bounds
	get years(){
		var end_mmt = new moment()
		var start_mmt = moment({
		 	year : StartYear, 
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
       if(this.props.date['year'] == year && this.props.date['month'] == month){
           return 
       }
	   this.props.handleDateChange(id, year, month - 1)
    }
    handleMonthDissmis(id, value) {
    	this.handleDateChange(id, value.year, value.month)
    }
    date(format){
    	format = format || 'default'
    	var dates = {} // Defaults

    	var date = new moment(new Date(this.props.date.year, this.props.date.month, 1))
    	if(!date.isValid()){
    		throw new Error('Invalid Start Date')
    	}
		
		dates['default'] = {'month' : date.month() + 1, 'year' : date.year() }
		dates['string'] = this.Months[date.month()] + ' - ' + date.year()
    	return dates[format]
    }
	render(){
		return (
		   <div className="toolbar-daterange-container">
		   		<div className="toolbar-datepicker-container">
				   <Picker
		                ref="start"
		                years={this.years}
		                value={this.date()}
		                lang={this.Months}
		                onChange={(year, month) => this.handleDateChange('start', year, month)}
		                onDismiss={(value) => this.handleMonthDissmis('start', value)}
		                >
		                <MonthBox 
		                	id="start"
		                	value={this.date('string')} 
		                	onClick={this.handleClickMonthBox.bind(this)} 
		                />
		            </Picker>
		        </div>
		    </div>
		)
	}
}

export default ToolbarDate;