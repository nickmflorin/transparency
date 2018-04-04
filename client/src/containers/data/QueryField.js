import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'underscore'

import SweetAlert from 'sweetalert2-react';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/theme/material.css';

import { Table } from '../../utilities'
import { Types } from '../../store/db'
import { QueryFieldToolbar } from '../../components/toolbars'
import { SaveQueryModal } from '../../components/modals'

import { user, Actions, Api } from '../../store'

const options = {
  lineNumbers: true,
  mode: 'text/x-sql',
  theme: 'material',
  autofocus : true,
  viewportMargin : Infinity,
};


class QueryField extends React.Component {
  constructor(props, context){
    super(props, context)
    this.overwrite = false // Dont Want to Trigger Rerender When Toggled
    this.state = {
      modalIsOpen : false,
      saveDisabled : true,
      confirm_save : false,
      error_save : false,
    }
  }
  static propTypes = {
      updateQuery : PropTypes.func.isRequired,
      runQuery: PropTypes.func.isRequired,
      saveNewQuery: PropTypes.func.isRequired,
      export: PropTypes.func.isRequired,
      query: PropTypes.object,
  };
  componentWillMount(){
    if(this.props.query){
      this.setQuery(this.props.query.sql)
    }
  }
  componentWillReceiveProps(props){
    if(props.query){
      this.setQuery(props.query.sql)
    }
  }
  onExport(event){
    const sql = this.getQuery()
    if(sql){
      this.props.updateQuery({ sql: sql }).then((action) => {
        if (action.type == Types.query.update.success) {
          this.props.runQuery().then( (action) => {
              if (action.type == Types.query.run.success) {
                var results = action.result.results 
                var columns = action.result.columns 
                var data = Table.convertResultToArray(columns, results)
                this.props.download(data)
              }
              else{
                console.log('Error Running Query')
                console.log(action.error)
              }
          })
        }
        else{
          console.log('There Was an Error Updating the Query SQL Before Running...')
        }
      })
    }
  }
  runQuery(event){
    const value = this.getQuery()
    if(value){
      this.props.updateQuery({ sql: value }).then((action) => {
        if (action.type == Types.query.update.success) {
          this.props.runQuery()
        }
        else{
          console.log('There Was an Error Updating the Query SQL Before Running...')
        }
      })
    }
  }
  setQuery(sql){
    if(this.cm){
     var cm = this.cm.getCodeMirror()
     if(cm){
        cm.setValue(sql)
        this.updateCode(sql)
      }
    }
  }
  getQuery(){
    if(this.cm){
     var cm = this.cm.getCodeMirror()
     if(cm){
        var value = cm.getValue()
        if(value.trim() != ""){
          return value.trim()
        }
      }
    }
    return null
  }
  onSaveAs(){
      const user = this.props.user
      if(!user){
        throw new Error('User Must be Present')
      }

      const value = this.getQuery()
      if(value){
        this.props.updateQuery({ sql: value }).then((action) => {
          if (action.type == Types.query.update.success) {
            this.overwrite = true
            this.setState({ modalIsOpen: true })
          }
          else{
            console.log('There Was an Error Updating the Query SQL Before Saving...')
          }
        })
      }
  }
  onSave(){
      const user = this.props.user
      if(!user){
        throw new Error('User Must be Present')
      }

      const value = this.getQuery()
      if (value) {
          // Make Sure State Query Model Has Updated SQL
          this.props.updateQuery({ sql: value }).then((action) => {
              if (action.type == Types.query.update.success) {
                  if (this.props.query.id == 'new') {
                      this.overwrite = false
                      this.setState({ modalIsOpen: true })
                  } else {
                      if (this.props.query.user.id == user.id) {
                          this.props.saveQuery().then((action) => {

                              if (action.type == Types.query.save.success) {
                                this.setState({ confirm_save : true })
                              }
                              else{
                                this.setState({ error_save : true })
                              }
                          })
                      } else {
                          // Save As Situation
                          this.overwrite = false
                          this.setState({ modalIsOpen: true })
                      }
                  }
              }
              else{
                console.log('There Was an Error Updating the Query SQL Before Saving...')
              }
          })
      } 
  }
  toggleModal(){
      this.setState({modalIsOpen: !this.state.modalIsOpen});
  }
  editorRefCallback = (ref) => {
    this.cm = ref 
  }
  // Called When CodeMirror Text Updated
  updateCode(text){
    var disabled = this.state.saveDisabled
    if(text.trim() != ""){
      if(disabled){
        this.setState({ saveDisabled : false })
      }
    }
    else{
      if(!disabled){
        this.setState({ saveDisabled : true })
      }
    }
  }
  render(){
    return (  
      <div className="query-field-container">

        <SweetAlert
          show={this.state.confirm_save}
          title="Saved"
          type='success'
          text="Your query was saved successfully."
          onConfirm={() => this.setState({ confirm_save : false })}
        />

        <SweetAlert
          show={this.state.error_save}
          title="Error"
          type='error'
          text="There was an error saving your query."
          onConfirm={() => this.setState({ error_save : false })}
        />

        <SaveQueryModal 
          saveNewQuery={this.props.saveNewQuery}
          overwrite={this.overwrite}
          query={this.props.query}
          user={this.props.user}
          show={this.state.modalIsOpen} 
          onClose={this.toggleModal.bind(this)}
          afterSave={this.props.getQueries}
        />

        <div className="query-field-toolbar-container" style={{marginLeft:28}}>
          <QueryFieldToolbar 
            run={this.runQuery.bind(this)}
            onSave={this.onSave.bind(this)}
            onSaveAs={this.onSaveAs.bind(this)}
            onNew={this.props.createTempQuery}
            onExport={this.onExport.bind(this)}
            saveDisabled={this.state.saveDisabled}
            {...this.props}
          />
        </div>
        <div className="query-field-field-container">
          <CodeMirror 
            ref={this.editorRefCallback} 
            value={this.state.sql} 
            onChange={this.updateCode.bind(this)} 
            options={options} 
          />
        </div>
      </div>
    )
  }
}

const DataStateToProps = (state, ownProps) => {  
  return {
    query : state.db.query,
    user : user(state),
  };
};

const DataDispatchToProps = (dispatch, ownProps) => {
  return {
    createTempQuery : () => dispatch(Actions.query.createTempQuery()),
    saveQuery : () => dispatch(Actions.query.saveQuery()),
    saveNewQuery : (name) => dispatch(Actions.query.saveNewQuery(name)),
    runQuery : (options) => dispatch(Actions.query.runQuery(options)),
    updateQuery : (update) => dispatch(Actions.query.updateQuery(update)),
    getQueries : () => dispatch(Actions.query.getQueries()),
  }
};

export default connect(DataStateToProps, DataDispatchToProps)(QueryField);  
