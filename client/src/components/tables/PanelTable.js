import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore'

import {CSVDownload} from 'react-csv';
import ReactTable from "react-table";
import "react-table/react-table.css";

export class PanelTable extends React.Component {
    constructor(props, context) {
        super(props, context)
    }
    
  	render(){
	  	return (
	  		<ReactTable
			  ref="react-table"
	          data={[]}
	          columns={this.props.columns}
	          minRows={this.props.minRows}
	          defaultPageSize={this.props.defaultPageSize}
	          className="-striped -highlight react-table-condensed"
	        />
	  	)
	}
}
