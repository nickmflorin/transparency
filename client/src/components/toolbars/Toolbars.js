import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore'
import moment from 'moment'

import { ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap';
import { ToolbarButton, DateRange } from '../elements'

var classNames = require('classnames')

export class PanelToolbar extends React.Component {
    static propTypes = {
      buttons: PropTypes.array.isRequired,
  	};
	render(){
		const props_classes = (this.props.className ? this.props.className.split(' ') : [])
		var all_classes = {
			"base-toolbar" : true,
			"panel-toolbar" : true,
		}
		_.each(props_classes, (cls) => { all_classes[cls] = true })
		const classes = classNames(all_classes)
	    return (
	        <ButtonToolbar className={classes}>
	        	{this.props.pushRight &&
	        		<div className="flex-grow"></div>
	        	}
				{this.props.buttons.map((button) => {
					return (
						<ToolbarButton
							key={button.id}
							className={button.className}
			                label={button.label}
			                icon={button.icon}  
			                onClick={button.onClick} 
			            />
					)
				})}
			</ButtonToolbar>
	    )
	}
}

export class TableToolbar extends React.Component {
    static propTypes = {
      buttons: PropTypes.array.isRequired,
  	};
	render(){
		const props_classes = (this.props.className ? this.props.className.split(' ') : [])
		var all_classes = {
			"base-toolbar" : true,
		}
		_.each(props_classes, (cls) => { all_classes[cls] = true })
		const classes = classNames(all_classes)
	    return (
	        <ButtonToolbar className={classes}>
	        	{this.props.pushRight &&
	        		<div className="flex-grow"></div>
	        	}
				{this.props.buttons.map((button) => {
					return (
						<ToolbarButton
							key={button.id}
							className={button.className}
			                label={button.label}
			                icon={button.icon}  
			                onClick={button.onClick} 
			            />
					)
				})}
			</ButtonToolbar>
	    )
	}
}

export class DateRangeToolbar extends React.Component {
	constructor(props, context) {
        super(props, context)
    }
    static propTypes = {
      changeDate: PropTypes.func.isRequired,
      dates: PropTypes.object.isRequired,
  	};
	render(){
	    return (
	        <ButtonToolbar className="date-toolbar">
				<DateRange
					dates={this.props.dates}
					changeDate={this.props.changeDate}
				/>
			</ButtonToolbar>
	    )
	}
}

class SelectToolbarItem extends React.Component {
    constructor(props, context){
        super(props, context)
        this.state = { value : props.value }
    }
    static propTypes = {
        id: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number
        ]),
        item: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
    };
     onChange(event) {
        this.setState({value: event.target.value});
        this.props.onChange(event, this.props.id, event.target.value)
    }
    render(){
        return (
            <div className="toolbar-item-group select-item-group">
                <div className="toolbar-text-container">
                    <label className="toolbar-text"> {this.props.item.label} </label>
                </div>
                <div className="flex-grow">
                    <select
                        name={this.props.id} 
                        onChange={(event) => this.onChange(event)}
                        value={this.state.value}
                        >
                        {this.props.item.children.map((child) => {
                            return <option id={child.id} value={child.id} key={child.id}> {child.label} </option>
                        })}
                    </select>
                 </div>
            </div>
        )
    }
}

export class SelectToolbar extends React.Component {
    constructor(props) {
        super(props)
    }
    static propTypes = {
        id: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number
        ]),
        items: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
    };
    render(){
    	return (
    	    <ButtonToolbar className='base-toolbar'>
                {this.props.items.map((item) => {
                    return (
                        <SelectToolbarItem 
                            id={item.id}
                            key={item.id} 
                            item={item}
                            value={item.value}
                            onChange={this.props.onChange}
                        />
                    )
                })}
			</ButtonToolbar>
    	)
    }
}

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
   				    	className={"btn chart-toolbar-btn"}
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
