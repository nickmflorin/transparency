import React from 'react';
import _ from 'underscore'
import PropTypes from 'prop-types';
import { DropdownButton, ButtonToolbar, MenuItem } from 'react-bootstrap';
import './SelectToolbar.css'
import './toolbar.css'

class SelectToolbarItem extends React.Component {
    constructor(props, context){
        super(props, context)
        this.state = { value : 'default' }
    }
    static propTypes = {
        item: PropTypes.object.isRequired,
        handleChange: PropTypes.func.isRequired,
    };
     handleChange(event) {
        this.setState({value: event.target.value});
        this.props.handleChange(event, this.props.item.id)
    }
    componentWillReceiveProps(props){
        if(props.item && props.item.active){
            this.setState( { value : props.item.active.id })
        }
    }
    render(){
        return (
            <div className="select-toolbar-container-select-container">
                <label className="select-toolbar-label"> {this.props.item.label} </label>
                <div className="flex-grow">
                    <select className="select-toolbar-select"
                        name={this.props.item.id} 
                        onChange={(event) => this.handleChange(event)}
                        value={this.state.value}
                        >
                        {this.props.item.children.map((child) => {
                            return (
                                <option 
                                    id={child.id} 
                                    value={child.id} 
                                    key={child.id}> 
                                    {child.Header} 
                                </option>
                            )
                        })}
                    </select>
                 </div>
            </div>
        )
    }
}

class SelectToolbar extends React.Component {
    constructor(props) {
        super(props)
    }
    static propTypes = {
        items: PropTypes.array.isRequired,
        handleChange: PropTypes.func.isRequired,
    };
    render(){
    	return (
    	    <ButtonToolbar>
                <div className="select-toolbar-container">
                    {this.props.items.map((item) => {
                        return (
                            <SelectToolbarItem 
                                key={item.id} 
                                item={item} 
                                handleChange={this.props.handleChange}
                            />
                        )
                    })}
                </div>
			</ButtonToolbar>
    	)
    }
}

export default SelectToolbar;
