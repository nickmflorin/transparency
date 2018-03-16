import React from 'react';  
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import _ from 'underscore'
import moment from 'moment'

import { HistoricalExposureBarChart } from '../../components/charts'

export class ManagerExposureExplorer extends React.Component {
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
       <div className="underneath-header"></div>
    )
  }
}

export class ManagerSnapshotExposures extends React.Component {
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
         <div className="underneath-header"></div>
    )
  }
}

export class ManagerHistoricalExposures extends React.Component {
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
       <div className="underneath-header">
         <HistoricalExposureBarChart 
            tiers={['long','short']}
            exposures={(this.props.manager && this.props.manager.exposures) || []}
          />
          <HistoricalExposureBarChart 
            tiers={['gross','net']}
            exposures={(this.props.manager && this.props.manager.exposures) || []}
          />
      </div>
    )
  }
}

