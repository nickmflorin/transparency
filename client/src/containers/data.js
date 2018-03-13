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

import { getDatabases, query } from '../actions'
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
      saved : [], 
      results : null,
      'sql' : 'SELECT TOP 20 * FROM Research.dbo.vDailyTrades',
    }
  }
  componentWillReceiveProps(props){
    if(props.result){
      console.log('Got Query Result')
      console.log(props.result)
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
  // If No SQL Passed In, Show Top 5 Used
  showTop5(event, table){
      var self = this 
      this.props.query(table.id)
      // var cm = this.cm.getCodeMirror()

      // this.setState({'loading' : true})
      // var promiseObj = axios.get('http://localhost:8000/api/query/?id=' + table.id)
      // promiseObj.then(function(response){
      //   self.setState({'loading' : false})

      //   if(response.data && response.data.length == 1){
      //     cm.setValue(response.data[0].sql)
      //     self.setState({'sql' : response.data[0].sql})
      //     self.setState({'results' : response.data[0]})
      //     if(response.data[0].results){
      //       self.setState({'to_download' : response.data[0].results})
      //     }
      //   }
      // });
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
  runQuery(){
    var self = this 
    var cm = this.cm.getCodeMirror()
    var value = cm.getValue()
    if(value.trim() != ""){
      this.setState({'loading' : true})

      // var promiseObj = axios.get('http://localhost:8000/api/query/?sql=' + value)
      // promiseObj.then(function(response){
      //   self.setState({'loading' : false})

      //   if(response.data && response.data.length == 1){
      //       self.setState({'results' : response.data[0]})
      //       if(response.data[0].results){
      //         self.setState({'to_download' : response.data[0].results})
      //       }
      //   }
      // });
    }
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
            <QueryResultsTable results={this.state.results}/>
          </div>
      </div>
    </div>
    )
  }
}

const DataStateToProps = (state, ownProps) => {  
  return {
    databases : state.databases,
    result : state.result
  };
};

const DataDispatchToProps = (dispatch, ownProps) => {
  return {
    getDatabases: () =>  dispatch(getDatabases()),
    query : (tableId, sql) => dispatch(query(tableId, sql))
  }
};

export default connect(DataStateToProps, DataDispatchToProps)(Data);  



