import React from 'react';
import PropTypes from 'prop-types'
import _ from 'underscore'
import { connect } from 'react-redux'

import { CSVDownload } from 'react-csv';
import { AlertControl } from '../../components/alerts'
import { Table } from '../../utilities'

import QueryField from './QueryField'
import QuerySelection from './QuerySelection'
import QueryResults from './QueryResults'
import { user, Actions, Api } from '../../store'

import './data.css'

const defaultSQL = 'SELECT TOP 20 * FROM Research.dbo.vDailyTrades';

export class Data extends React.Component {
  constructor(props, context){
    super(props, context)
    this.state = {
        error : null,
        warning : null,
        to_download : null,
      }
  }
  componentWillMount() {
      if(!this.props.query){
        this.props.createTempQuery()
      }
  }
  // Only Handle Errors and Warnings in Top Level
  componentWillReceiveProps(props){

    if(props.query){
      var update = { warning : null }
      if(props.query.error){
        update['error'] = props.query.error
      }
      else if(props.query.message){
        update['warning'] = props.query.message
      }
      this.setState(update)
    }
  }
  export(sql){
    var self = this 
    this.props.loading(true)
    Api.db.RunQuery(sql, {'nolimit' : true}).then(response => {
      self.props.loading(false)

      if(response.error){
        self.setState({ error : response.error })
      }
      else if(response.results && response.columns){
        var data = Table.convertResultToArray(response.columns, response.results)
        self.download(data)
      }
   })
  }
  download(data){
    this.setState({to_download : data})
    var self = this 
    setTimeout(function() { //Start the timer
        self.setState({to_download : null})
    }, 2000)
  }
  render(){
    return (
        <div className="content white-content">
          {this.state.to_download && 
            <CSVDownload data={this.state.to_download} target="data" />
          }
          <div className="data-top-container">
            <div className="left">
                <QueryField 
                  export={this.export.bind(this)}
                  download={this.download.bind(this)}
                />
            </div>
            <div className="right">
                <QuerySelection />
            </div>
          </div>

          <AlertControl 
            warning={this.state.warning} 
            error={this.state.error} 
          />

          <div className="data-bottom-container" style={{marginTop: 20}}>
              <QueryResults 
                download={this.download.bind(this)}
                query={this.props.query}
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
  }
};

export default connect(DataStateToProps, DataDispatchToProps)(Data);  



