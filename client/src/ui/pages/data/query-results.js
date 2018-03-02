import React from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";

class QueryResultsTable extends React.Component {
  render(){
    const results = (this.props.results && this.props.results.results) || []
    const columns = (this.props.results && this.props.results.columns) || []

    return (
      <div className="query-results-container">
        <ReactTable
            data={results}
            columns={columns.map((column, i) => {
                return {
                  Header : column,
                  id : column,
                  accessor: function(d){
                    return d[i]
                  }
                }
            })}
            defaultPageSize={50}
            className="-striped -highlight"
        />
      </div>
    )
  }
}

export default QueryResultsTable;