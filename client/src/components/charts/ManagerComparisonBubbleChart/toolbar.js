import React from 'react';
import _ from 'underscore'

import { DropdownButton, ButtonToolbar, MenuItem } from 'react-bootstrap';
import { CSVLink, CSVDownload } from 'react-csv';

class ManagerComparisonBubbleChartToolbar extends React.Component {
    constructor(props) {
        super(props)
    }
    render(){
    	return (
    	    <ButtonToolbar>
      			<div className="toolbar-select-container">
	      			<select>
	      			</select>
	      			<select>
	      			</select>
	      			<select>
	      			</select>
				</div>
			</ButtonToolbar>
    	)
    }
}

export default ManagerComparisonBubbleChartToolbar;