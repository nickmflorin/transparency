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
    this.state = {
      confirm_save : false,
      save_error : null,
      save_as_error : null,
      modalIsOpen : false,
      saveDisabled : false,
    }
  }
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
  onSave(){
    var self = this 
    const user = this.props.user
    if (!user){
      throw new Error('User Must be Present')
    }

    const value = this.getQuery()
    if(this.props.query && value){
      this.props.updateQuery({ sql: value })

      if (this.props.query.id == 'new') {
        this.setState({ modalIsOpen: true })
      }
      else{
        if (this.props.query.user.id == user.id) {
          this.props.dispatch(Actions.query.save_Async()).then(function(action, error){
            if(action.error){
              self.setState({ save_error : action.error })
            }
            else{
              self.setState({ confirm_save : true })
            }
          })
        }
        else{
          self.setState({ modalIsOpen: true })
        }
      }
    }
    return
  }
  onSaveAs(){
      const user = this.props.user
      const value = this.getQuery()
      if(!user){
        throw new Error('User Must be Present')
      }
      if(this.props.query){
        this.props.updateQuery({ sql: value })
        this.setState({ modalIsOpen: true })
      }
  }
  onModalSubmit(data){
    var self = this 
    this.props.dispatch(Actions.query.saveNew_Async(data.name)).then(function(action, error){
      if(action.error){
        self.setState({save_as_error : action.error})
      }
      else{
        self.setState({ modalIsOpen: false, save_as_error : null })
      }
    })
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
    var show_error_alert = false;
    if(this.state.save_error){
      show_error_alert = true 
    }

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
          show={show_error_alert}
          title="Error"
          type='error'
          text={this.state.save_error}
          onConfirm={() => this.setState({ error_save : false })}
        />

        <SaveQueryModal 
          onSubmit={this.onModalSubmit.bind(this)}
          onClose={this.toggleModal.bind(this)}
          query={this.props.query}
          user={this.props.user}
          show={this.state.modalIsOpen} 
          error={this.state.save_as_error}
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
  };
};

const DataDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch : (action) => dispatch(action),
    createTempQuery : () => dispatch(Actions.query.temp()),
    runQuery : (options) => dispatch(Actions.query.run(options)),
    updateQuery : (update, options) => dispatch(Actions.query.update(update, options)),
    getQueries : () => dispatch(Actions.queries.get()),
  }
};

export default connect(DataStateToProps, DataDispatchToProps)(QueryField);  
