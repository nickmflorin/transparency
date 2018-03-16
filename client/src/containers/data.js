import React from 'react';
import { connect } from 'react-redux'

import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/theme/material.css';

import MenuBar from '../components/menu/menu'
import QueryDetail from '../components/data/QueryDetail'
import { QueryResultsTable, QueryTable } from '../components/tables'
import QueryFieldToolbar from '../components/elements/QueryFieldToolbar'

import { getDatabases, query, query_table } from '../actions'
import './data.css'

const options = {
  lineNumbers: true,
  mode: 'text/x-sql',
  theme: 'material',
  autofocus : true,
  viewportMargin : Infinity,
};

class Data extends React.Component {
  constructor(){
    super()
    this.state = {
      database : null, 
      'sql' : 'SELECT TOP 20 * FROM Research.dbo.vDailyTrades',
    }
  }
  componentWillMount() {
      this.props.getDatabases()
      //const defaultDB = response.data[0]
      //self.setState({'database' : defaultDB, 'tables' : defaultDB.tables})
  }
  // Not Currently Used but May Use in Future
  onSelect(e, manager){
    return
  }
  databaseSelected(event, database){
    this.setState({'database' : database })
  }
  showTop5(event, table){
      this.props.query_table(table.id)
  }
  // Here We Can Either Use Direct Value from CM or Update SQL State Whenever Code Mirror Edited
  runQuery(event){
    var cm = this.cm.getCodeMirror()
    var value = cm.getValue()
    console.log(value)
    if(value.trim() != ""){
      this.props.query(value)
    }
  }
  get to_download(){
    return []
  }

  editorRefCallback = (ref) => {
    this.cm = ref 
  }
  // Called When CodeMirror Text Updated
  updateCode(){
    
  }
  clearQuery(){

  }
  render(){
    return (
      <div className="menu-content">
        <MenuBar 
          onSelect={this.onSelect.bind(this)}
        />

        <div className="content">
          <div className="data-top-container">
            <div className="left">
               <div className="query-field-container">
                  <div className="query-field-toolbar-container" style={{marginLeft:28}}>
                    <QueryFieldToolbar 
                      to_download={this.to_download}
                      clear={this.clearQuery.bind(this)}
                      run={this.runQuery.bind(this)}
                    />
                  </div>
                  <div className="query-field-field-container">
                    <CodeMirror 
                      ref={this.editorRefCallback} 
                      value={this.state.sql} 
                      onChange={this.updateCode} 
                      options={options} 
                    />
                  </div>
                </div>
            </div>
            <div className="right">
              <QueryTable 
                  database={this.state.database} 
                  databases={this.props.databases || []} 
                  saved={this.state.saved || []} 
                  databaseSelected={this.databaseSelected.bind(this)} 
                  tables={this.state.tables} 
                  showTop5={this.showTop5.bind(this)}
              />
            </div>
          </div>
          <div className="data-bottom-container">
            <QueryResultsTable 
              result={this.props.query_result}
            />
          </div>
      </div>
    </div>
    )
  }
}

const DataStateToProps = (state, ownProps) => {  
  return {
    databases : state.db.databases,
    query_result : state.db.query_result
  };
};

const DataDispatchToProps = (dispatch, ownProps) => {
  return {
    getDatabases: () =>  dispatch(getDatabases()),
    query : (sql) => dispatch(query(sql)),
    query_table : (tableId, sql) => dispatch(query_table(tableId, sql))
  }
};

export default connect(DataStateToProps, DataDispatchToProps)(Data);  



