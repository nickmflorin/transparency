import React from 'react';
import PropTypes from 'prop-types'
import _ from 'underscore'
import moment from 'moment'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCalendar from '@fortawesome/fontawesome-free-regular/faCalendar'

import { FormGroup, InputGroup, FormControl } from 'react-bootstrap'
import Picker from 'react-month-picker'
import 'react-month-picker/css/month-picker.css'

import { Utilities } from '../../utilities'
var classNames = require('classnames');

// To Do: Move These to Config
const StartYear = 1995
const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export class MonthBox extends React.Component{
    constructor(props, context){
        super(props, context)
        this.state = {
            value: this.props.value || 'N/A',
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            value: nextProps.value || 'N/A',
        })
    }
    render(){
        return (
          <FormControl 
            type="text" 
            className="month-input"
            value={this.state.value} 
            onClick={(event) => this.props.onClick(event)} 
            onChange={(event) => this.props.onClick(event)} 
          />
        )
    }
}

export class DateInput extends React.Component{
	static propTypes = {
        id : PropTypes.string.isRequired,
		date : PropTypes.object.isRequired,
		changeDate : PropTypes.func.isRequired
	}
	// To Do: We Cannot Limit Return Years Based on Current State Since That Will Prevent Us from Going Outside State
	// We Want to Set Bounds Based on Return Bounds
	get_years(){
		var end_mmt = new moment()
		var start_mmt = moment({year : StartYear, month : 1, day : 1})
		var series = Utilities.generateMonthSeries(start_mmt, end_mmt, 'parsed')
		var years = _.uniq(_.pluck(series, 'year'))
		return years
	}
	toggleVisibility(e) {
        this.refs['date'].show()
    }
    onDateChange(year, month) {
        var change = {}
        if(month < 1){
            throw new Error('Invalid Month')
        }
        change[this.props.id] = { year : year, month : month }
        var test = moment({year : change.year, month : change.month, day : 1})
       
	    this.props.changeDate(change)
    }
    handleMonthDissmis(value) {
    	this.onDateChange(value.year, value.month)
    }
	render(){
        var start_mmt = moment({year : this.props.date.year, month : this.props.date.month, day : 1})
		const years = this.get_years()
        var pickerClass = classNames({
          'push-right': this.props.pushRight === true,
        });
       
		return (
		   <Picker
                ref="date"
                className={pickerClass}
                years={years}
                value={{ 
                    month : this.props.date.month + 1,
                    year : this.props.date.year
                }}
                lang={Months}
                onChange={(year, month) => this.onDateChange(year, month - 1)}
                onDismiss={(value) => this.handleMonthDissmis(value)}
            >
            <InputGroup>
                <InputGroup.Addon>
                    <FontAwesomeIcon icon={faCalendar}/> 
                </InputGroup.Addon>
                <MonthBox 
                	value={
                        Months[this.props.date.month] + ' - ' + this.props.date.year
                    } 
                	onClick={this.toggleVisibility.bind(this)} 
                />
            </InputGroup>
        </Picker>
		)
	}
}

