import React from 'react';
import _ from 'underscore'
import moment from 'moment'

class MonthBox extends React.Component{
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
    	    <input 
    	    	className="month-input"
    	    	id={this.props.id} 
    	    	value={this.state.value} 
    	    	onClick={(event) => this.props.onClick(event)} 
    	    	onChange={(event) => this.props.onClick(event)} 
    	    	type="text"
    	    >
    	    </input>
    	)
    }
}

export default MonthBox;