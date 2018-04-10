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
import { QueryFieldToolbar } from '../../components/toolbars'
import { SaveQueryModal } from '../../components/modals'

import Actions from '../../actions'

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
  componentWillMount(){
    if(this.props.query){
      this.setQuery(this.props.query.sql)
    }
  }
  componentWillReceiveProps(props){
    if(props.errors){
      if(props.errors.save){
        this.setState({error_save : true})
      }
    }
    if(props.successes){
      if(props.successes.save){
        this.setState({confirm_save : true})
      }
      if(props.successes.create){
        this.toggleModal()
      }
    }
    if(props.query){
      this.setQuery(props.query.sql)
    }
  }
  onExport(event){
    const value = this.getQuery()
    if(value){
      this.props.updateQuery({ sql: value }, { export : true })
    }
  }
  runQuery(event){
    const value = this.getQuery()
    if(value){
      this.props.updateQuery({ sql: value }, { run : true })
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
      const query = this.props.query
      if(user && query){
        const value = this.getQuery()
        if (value) {
          this.props.updateQuery({ sql: value })
          this.setState({ modalIsOpen: true })
        }
      }
  }
  onSave(){
      const user = this.props.user
      const query = this.props.query
      if(user && query){
        const value = this.getQuery()
        if (value) {
            if(query.id == 'new'){
              this.setState({ modalIsOpen: true })
            }
            else if(query.user.id == user.id){
              this.props.updateQuery({ sql: value }, { save : true })
            }
            else{
              this.setState({ modalIsOpen: true })
            }
        }
      }
  }
  successConfirmed(){
    this.props.clearSuccesses('save')
    this.setState({ confirm_save : false })
  }
  errorConfirmed(){
    this.props.clearErrors('save')
    this.setState({ error_save : false })
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
          onConfirm={this.successConfirmed.bind(this)}
        />

        <SweetAlert
          show={this.state.error_save}
          title="Error"
          type='error'
          text="There was an error saving your query."
          onConfirm={this.errorConfirmed.bind(this)}
        />

        <SaveQueryModal 
          saveNewQuery={this.props.saveNewQuery}
          overwrite={this.overwrite}
          query={this.props.query}
          user={this.props.user}
          show={this.state.modalIsOpen} 
          onClose={this.toggleModal.bind(this)}
          afterSave={this.props.getQueries}
          errors={this.props.errors}
          successes={this.props.successes}
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
    user : state.auth.user,
    successes : state.successes.query,
    errors : state.errors.query,
  };
};

const DataDispatchToProps = (dispatch, ownProps) => {
  return {
    clearSuccesses : (type) => dispatch(Actions.successes.query.clear(type)),
    clearErrors : (type) => dispatch(Actions.errors.query.clear(type)),
    createTempQuery : () => dispatch(Actions.query.temp()),
    saveQuery : () => dispatch(Actions.query.save()),
    saveNewQuery : (name, sql) => dispatch(Actions.query.saveNew(name, sql)),
    runQuery : (options) => dispatch(Actions.query.run(options)),
    updateQuery : (update, options) => dispatch(Actions.query.update(update, options)),
    getQueries : () => dispatch(Actions.queries.get()),
  }
};

export default connect(DataStateToProps, DataDispatchToProps)(QueryField);  
