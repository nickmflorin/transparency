import React from 'react';
import _ from 'underscore'
import PropTypes from 'prop-types';
import { DropdownButton, ButtonToolbar, MenuItem } from 'react-bootstrap';

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

