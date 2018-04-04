import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'
import ReactTable from "react-table";
import "react-table/react-table.css";

import QueryTableConfig from './QueryTableConfig'

export class QueryTable extends React.Component {
	static propTypes = {
      openTableQuery: PropTypes.func.isRequired,
      openQuery: PropTypes.func.isRequired,
      removeQuery: PropTypes.func.isRequired,
	  displayQueries: PropTypes.array.isRequired,
	  displayTables: PropTypes.array.isRequired,
	  database: PropTypes.object,
	  display: PropTypes.string.isRequired,
  }
  render(){
  		var noDataText = "", columns = [], data = []
  		const config = QueryTableConfig(this.props.display, this.props)

  		noDataText = config.noDataText
		data = config.data
		columns = config.columns

	    return (
			 <ReactTable
		          data={data}
		          columns={columns}
		          minRows={25}
		          loadingText= 'Loading Results...'
				  noDataText={noDataText}
		          defaultPageSize={15}
		          className="-striped -highlight react-table-condensed"
		          defaultPageSize={20}
			 />
	   )
 	}
}
