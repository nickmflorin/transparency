import React from 'react';
import PropTypes from 'prop-types'
import _ from 'underscore'

import { QueryResultsTableToolbar } from '../../components/toolbars'
import { DownloadTable } from '../../components/tables'

class Column {
  constructor(name){
    this.id = name 
    this.Header = name 
    this.label = name 
    this.enabled = true  // Default True 
  }
}

class QueryResults extends React.Component {
  constructor(props, context){
    super(props, context)
    this.state = {
        results : [],
        columns : [
          new Column('Data Column 1'), 
          new Column('Data Column 2')
        ],
      }
  }
  static propTypes = {
      query: PropTypes.object,
      download: PropTypes.func.isRequired,
  };
  componentWillReceiveProps(props){
    // Update Results and Columns if New Result Retrieved
    if(props.query && props.query.result){
      const result = props.query.result

      if(result.results && result.columns && result.columns.length != 0){
        var update = { results : result.results }
        update['columns'] = result.columns.map((col) => {
          return new Column(col)
        })
        this.setState(update)
      }      
    }
  }
  onDownload(download_type){
    var columns = null;
    if(download_type != 'selected'){
      columns = this.state.columns.map( (col) => {
          return {
            id : col.id,
            Header: col.label,
          }
      })
    }
    this.refs['results-table'].download(columns)
  }
  toggleColumn(columnId){
    var columns = this.state.columns 
    var col = _.findWhere(columns, { id :columnId })
    if(col){
      if(col.enabled){
        col.enabled = false
      }
      else{
        col.enabled = true
      }
    }
    else{
      throw new Error('Invalid Column')
    }
    this.setState({columns : columns})
  }
  render(){
    const filtered = _.filter(this.state.columns, function(col){
      return col.enabled === true 
    })
    return (  
      <div>
        <QueryResultsTableToolbar 
          columns={this.state.columns}
          toggle={this.toggleColumn.bind(this)}
          onDownload={this.onDownload.bind(this)}
        />

        <DownloadTable
          ref="results-table"
          data={this.state.results}
          target="results"
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
        />
      </div>
    )
  }
}

export default QueryResults;
