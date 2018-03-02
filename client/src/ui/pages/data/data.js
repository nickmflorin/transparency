import React from 'react';
import ReactDOM from 'react-dom'
import axios from 'axios';
import { PulseLoader } from 'react-spinners';
import { CSVLink, CSVDownload } from 'react-csv';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay'
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload'

import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/theme/material.css';

import MenuBar from '../../layout/menu/menu'
import QueryResultsTable from './query-results.js'
import QueryTable from './query-table.js'
import './data.css'

class QueryDetail extends React.Component {
  render(){
    return (
      <div className="query-detail-container">
        <h2> Fake Name </h2>
        <p> Fake User Name </p>
        <p> Fake Created At </p>
      </div>
    )
  }
}

class Data extends React.Component {
  constructor(){
    super()
    this.state = {
      'databases' : [], 
      'database' : null, 
      'sql' : 'SELECT TOP 20 * FROM Research.dbo.vDailyTrades',
      'loading' : false, 
      'saved' : [], 
      'tables' : [], 
      'results' : null,
      'to_download' : [],
    }
  }
  componentWillMount() {
      this.setState({'loading' : true})
      var promiseObj = axios.get('http://localhost:8000/api/databases/')

      var self = this 
      promiseObj.then(function(response){
        self.setState({'loading' : false})
        if(response.data){
          self.setState({'databases' : response.data})

          // Set Default Database
          const defaultDB = response.data[0]
          self.setState({'database' : defaultDB, 'tables' : defaultDB.tables})
        }
      });
  }
  databaseSelected(event, database){
    this.setState({'database' : database, 'tables' : database.tables})
  }
  showTop5(event, table){
      var self = this 
      var cm = this.cm.getCodeMirror()

      this.setState({'loading' : true})
      var promiseObj = axios.get('http://localhost:8000/api/query/?id=' + table.id)
      promiseObj.then(function(response){
        self.setState({'loading' : false})

        if(response.data && response.data.length == 1){
          cm.setValue(response.data[0].sql)
          self.setState({'sql' : response.data[0].sql})
          self.setState({'results' : response.data[0]})
          if(response.data[0].results){
            self.setState({'to_download' : response.data[0].results})
          }
        }
      });
  }
  runQuery(){
    var self = this 
    var cm = this.cm.getCodeMirror()
    var value = cm.getValue()
    if(value.trim() != ""){
      this.setState({'loading' : true})

      var promiseObj = axios.get('http://localhost:8000/api/query/?sql=' + value)
      promiseObj.then(function(response){
        self.setState({'loading' : false})

        if(response.data && response.data.length == 1){
            self.setState({'results' : response.data[0]})
            if(response.data[0].results){
              self.setState({'to_download' : response.data[0].results})
            }
        }
      });
    }
  }
  editorRefCallback = (ref) => {
    this.cm = ref 
  }
  // Called When CodeMirror Text Updated
  updateCode(){
    
  }
  render(){
    var options = {
      lineNumbers: true,
      mode: 'text/x-sql',
      theme: 'material',
      autofocus : true,
      viewportMargin : Infinity,
    };

    return (
      <div className="menu-content">
        <MenuBar />

        <div className='loading'>
          <PulseLoader
            color={'#004C97'} 
            loading={this.state.loading} 
          />
        </div>

        <div className="content">

          <div className="data-container">
            <div className="data-left-col">
              <div className="query-sidebar-container">

                <a onClick={this.runQuery.bind(this)} className="btn btn-default query-control-button"> Run 
                   <span className='query-control-icon'>
                    <FontAwesomeIcon icon={faPlay}/> 
                  </span>
                </a>

                {this.state.to_download && 
                  <CSVLink data={this.state.to_download}
                    filename={"data.csv"}
                    className="btn btn-default query-control-button"
                    target="_blank">
                      Export 
                      <span className='query-control-icon'>
                        <FontAwesomeIcon icon={faDownload}/> 
                      </span>
                  </CSVLink>
                }
              </div>
              <div className="query-field-container">
                  <CodeMirror 
                    ref={this.editorRefCallback} 
                    value={this.state.sql} 
                    onChange={this.updateCode} 
                    options={options} 
                  />
            </div>
            </div>
            <QueryTable 
                database={this.state.database} 
                databases={this.state.databases || []} 
                saved={this.state.saved || []} 
                databaseSelected={this.databaseSelected.bind(this)} 
                tables={this.state.tables} 
                showTop5={this.showTop5.bind(this)}
            />
        </div>

        <QueryResultsTable results={this.state.results}/>
     </div>
    </div>
    )
  }
}

export default Data


