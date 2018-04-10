import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore'

import ReactTable from "react-table";
import "react-table/react-table.css";

export class QueryResultsTable extends React.Component {
  constructor(props, context){
    super(props, context)
  }
  static propTypes = {
      columns: PropTypes.array.isRequired,
      data: PropTypes.array.isRequired,
  };
  render(){
    const filtered = _.filter(this.props.columns, function(col){
      return col.enabled === true 
    })

    return (
      <ReactTable
          ref="results-table"
          data={this.props.data}
          columns={filtered.map((column, i) => {
              return {
                Header : column.Header,
                id : column.id,
                accessor: function(datum){
                  return datum[column.id]
                }
              }
          })}
          defaultPageSize={50}
          className="-striped -highlight"
      />
    )
  }
}
