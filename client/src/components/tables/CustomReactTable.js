import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore'

import { CSVDownload } from 'react-csv';
import ReactTable from "react-table";
import "react-table/react-table.css";

export class CustomReactTable extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
        	to_download : null
        }
    }
    getTdProps(state, rowInfo, column, instance){
        var props = {}
        if(rowInfo){
        	if (this.props.rowClicked) {
	            props.onClick = (e, handleOriginal) => {
	                if (e.target.id != 'remove') {
	                    if (rowInfo && rowInfo.original) {
	                        this.props.rowClicked(rowInfo.original)
	                    }
	                }
	            }
	        }
	        if(this.props.active){
	        	if(rowInfo.original){
	        		if(rowInfo.original.id == this.props.active){
	            		props.className = 'active'
	            	}
	        	}
	        }
        }
        return props
    }
    download(columns = null){
	    var data = this.getData(columns)
	    this.setState({to_download : data})

	    setTimeout(function() { //Start the timer
	        this.setState({to_download : null})
	    }.bind(this), 2000)
	}
    getData(columns = null){
	    var table = this.refs['react-table']
	    var array = []

	    if(table.props.data.length != 0 && table.props.columns.length != 0){
	      const data = table.props.data
	      columns = columns || table.props.columns

	      var row = []
	      _.each(columns, function(col){
	        if(col.type != 'action'){
	          row.push(col.Header)
	        }
	      })
	      array.push(row)

	      _.each(data, function(datum){
	          var row = []
	          _.each(columns, function(col){
	            // Non Text Data Columns Have no Accessors
	            if(col.type != 'action'){
	              if(col.accessor){
	              	if(col.accessor instanceof Function){
	              		row.push(col.accessor(datum))
	              	}
	              	else{
	              		row.push(datum[col.accessor])
	              	}
	              }
	              else{
	                row.push(datum[col.id])
	              }
	            }
	          })
	          array.push(row)
	      })
	      return array
	    }
	}
  	render(){
	  	return (
	  		<div>
		  		{this.state.to_download &&
		            <CSVDownload data={this.state.to_download} filename={this.props.target + ".csv"} target="_blank" />
		        }
		  		<ReactTable
				  ref="react-table"
		          data={this.props.data}
		          style={{
		            height: this.props.height // This will force the table body to overflow and scroll, since there is not enough room
		          }}
		          showPaginationBottom={(this.props.showPaginationBottom === undefined) ? true : this.props.showPaginationBottom}
		          columns={this.props.columns}
		          minRows={this.props.minRows}
		          defaultPageSize={this.props.defaultPageSize}
		          className="-striped -highlight react-table-condensed"
		          getTdProps={this.getTdProps.bind(this)}
		        />
		    </div>
	  	)
	}
}

