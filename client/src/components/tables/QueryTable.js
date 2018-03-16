import React from 'react';
import PropTypes from 'prop-types';

import { DropdownButton, ButtonToolbar, MenuItem } from 'react-bootstrap';
import ReactTable from "react-table";
import "react-table/react-table.css";

import QueryTableToolbar from '../elements/QueryTableToolbar'
import './QueryTable.css'

export class QueryTable extends React.Component {
	tdProps(state, rowInfo, column){
		var props = {style : {}}
		if(column.id == 'show' || column.id == 'type'){
			props.style.textAlign = 'center'
      	}
      	return props
	}
	static propTypes = {
      databaseSelected: PropTypes.func.isRequired,
      showTop5: PropTypes.func.isRequired,
  };
  render(){
	    return (
	        <div className="query-table-container">
		         <QueryTableToolbar 
		            database={this.props.database} 
		            databases={this.props.databases || []} 
		            saved={this.props.saved || []} 
		            databaseSelected={this.props.databaseSelected}
		         />
	          <div className="query-table-table-container">
				 <ReactTable
			          data={(this.props.database && this.props.database.tables) || []}
			          columns={[
			          	{ Header: "Table Name", id : "name",
			          		accessor: function(d){
			          			return d.db + '.' + d.handle + '.' + d.name
			          		}
			          	},
				        { Header: "Type", id: "type", accessor: "type"},
				        { Header : "Show", id: "show", 
				        	Cell: row => (
				        	  <a className='table-link' onClick={(e) => this.props.showTop5(e, row.row._original)}> Show Top 5 Rows </a>
				        	)
				    	}
			          ]}
			          minRows={25}
			          loadingText= 'Loading Results...'
  					  noDataText='No Tables Found'
			          defaultPageSize={15}
			          className="-striped -highlight react-table-condensed"
			          defaultPageSize={20}
			          getTdProps={this.tdProps}
				 />
			 </div>
		</div>
	   )
 	}
}

export default QueryTable;