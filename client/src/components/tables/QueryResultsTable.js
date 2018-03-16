import React from 'react';
import ReactDOM from 'react-dom'
import _ from 'underscore'

import {CSVDownload} from 'react-csv';
import PropTypes from 'prop-types';
import ReactTable from "react-table";
import "react-table/react-table.css";

import QueryResultsTableToolbar from '../elements/QueryResultsTableToolbar'

class Column {
  constructor(name){
    this.id = name 
    this.Header = name 
    this.enabled = true  // Default True 
  }
}

export class QueryResultsTable extends React.Component {
  constructor(props, context){
    super(props, context)
    this.state = {
      to_download : null,
      results : [],
      table : null, 
      sql : null,
      columns : [
        new Column('Data Column 1'), 
        new Column('Data Column 2')
      ] // Dummy Default for Now
    }
  }
  static propTypes = {
      results: PropTypes.object,
  };
  componentWillReceiveProps(props){
    if(props.result){
      var columns = _.map(props.result.columns, function(col){
        return new Column(col)
      })
      this.setState( { 
        results : props.result.results, 
        columns : columns,
        sql : props.result.sql, 
        table : props.result.table 
      })
    }
  }
  download(){
    var table = this.refs['results-table']
    if(table && table.props.data && table.props.data.length != 0){
      const data = table.props.data
      this.setState({to_download : data})

      setTimeout(function() { //Start the timer
          this.setState({to_download : null})
      }.bind(this), 2000)
    }
  }
  toggle(e, column){

    var columns = this.state.columns 
    var col = _.findWhere(columns, { id : column.id })
    if(!col){
      throw new Error('Invalid Column')
    }
    col.enabled = !col.enabled 
    this.setState({columns : columns})
  }
  render(){
    const filtered = _.filter(this.state.columns, function(col){
      return col.enabled === true 
    })

    return (
        <div>
          {this.state.to_download && 
            <CSVDownload data={this.state.to_download} target="data" />
          }
  
          <QueryResultsTableToolbar 
            columns={this.state.columns}
            toggle={this.toggle.bind(this)}
            download={this.download.bind(this)}
          />
          <ReactTable
              ref="results-table"
              data={this.state.results}
              columns={filtered.map((column, i) => {
                  return {
                    Header : column.Header,
                    id : column.id,
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