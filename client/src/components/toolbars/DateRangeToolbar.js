import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSave from '@fortawesome/fontawesome-free-regular/faSave'
import faFile from '@fortawesome/fontawesome-free-regular/faFile'
import faEraser from '@fortawesome/fontawesome-free-solid/faEraser'
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload'

import { ButtonToolbar, FormGroup, FormControl, ControlLabel, Input, Checkbox } from 'react-bootstrap';
import { ToolbarDropdown, ToolbarCheckableDropdown } from '../dropdowns'
import { DateRange, ToolbarButton, ToolbarRadioButtons } from '../inputs'

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