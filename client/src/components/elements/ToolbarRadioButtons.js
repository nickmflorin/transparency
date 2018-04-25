import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore'

import { ButtonToolbar, FormGroup, Checkbox, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
var classNames = require('classnames');

export class ToolbarRadioButtons extends React.Component {
    constructor(props, context) {
        super(props, context)
        var checked = {}

        if(props.items.length != 2){
          throw new Error('Only Supports Dual Check Box Items')
        }

        _.each(props.items, function(item){
          checked[item.id] = false 
        })
        var checked_item = _.findWhere(props.items, { checked : true })
        checked[checked_item.id] = true

        this.state = {
          checked : checked
        }
    }
    static defaultProps = {
      items : [],
    };
    static propTypes = {
        id: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number
        ]).isRequired,
        onChange: PropTypes.func.isRequired,
        items: PropTypes.array.isRequired,
    }
    onChange(e){
      var id = e.target.id
      var isChecked = e.target.checked
      
      var checked = _.mapObject(this.state.checked, (item) => { return false })
      checked[e.target.id] = true 
      this.setState({ checked : checked })
      this.props.onChange(e, this.props.id, id, isChecked)
    }
    render() {
      return (
          <FormGroup className="toolbar-form-group toolbar-checkbox-form-group">
            {this.props.items.map( (item) => {
              return(
                  <Checkbox 
                    key={item.id}
                    id={item.id}
                    onChange={this.onChange.bind(this)}
                    checked={this.state.checked[item.id]}
                    className="checkbox-label toolbar-checkbox" 
                    inline
                  > 
                    {item.label}
                  </Checkbox> 
              )
            })}
         </FormGroup>
      )
    }
}