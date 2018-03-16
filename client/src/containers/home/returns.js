import React from 'react';  
import PropTypes from 'prop-types';

import _ from 'underscore'
import moment from 'moment'
import $ from 'jquery'

import { ReturnsTable } from '../../components/tables'
import { BetaBarChart } from '../../components/charts'

export class ManagerHistoricaPerformance extends React.Component {
  constructor(props, context){
    super(props, context)
    this.state = {
      manager : null,
      date : null,
    }
  }
  static propTypes = {
    manager: PropTypes.object,
    date: PropTypes.object,
  };
  componentWillReceiveProps(nextProps){
    if(nextProps.manager){
      if(!this.state.manager || this.state.manager.id != nextProps.manager.id){
        this.setState({ manager : nextProps.manager })
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.manager){
      if(!this.state.manager){
        return true 
      }
      else if(this.state.manager.id != nextState.manager.id){
        return true 
      }
    }
    return false;
  }
  render() {
    return (
       <div className="underneath-header">
          <div className="manager-home-top" style={{marginTop:10}}>
            <div className="left">
              <ReturnsTable 
                title={this.props.manager && this.props.manager.name}
                subtitle={this.props.manager && this.props.manager.id}
                dates={this.props.dates}
                complete={(this.props.manager && this.props.manager.returns && this.props.manager.returns.complete) || []}
                in_range={(this.props.manager && this.props.manager.returns && this.props.manager.returns.series) || []}
              />
            </div>
            <div className="right">
              <BetaBarChart 
                date={this.props.date}
                manager={this.props.manager}
                {...this.props}
              />
            </div>
          </div>

        <div className="manager-home-bottom"></div>
     </div> 
    )
  }
}

export class ManagerPerformanceAttribution extends React.Component {
  constructor(props, context){
    super(props, context)
  }
  static propTypes = {
    manager: PropTypes.object,
    exposures: PropTypes.array,
    dates: PropTypes.object,
  };
  render() {
    return (
        <div></div>
    )
  }
}

