import React from 'react';  
import PropTypes from 'prop-types';

import _ from 'underscore'
import moment from 'moment'
import { Panel, HomeContent } from '../../../components/layout'

import '../home.css'

class PerformanceAttribution extends React.Component {
  constructor(props, context){
    super(props, context)
    this.state = {
      manager : null,
    }
  }
  static propTypes = {
    manager: PropTypes.object,
    exposures: PropTypes.array,
    dates: PropTypes.object,
  };
  onSelect(){

  }
  handleDateChange(){

  }
  render() {
    return (
      <HomeContent
        manager={this.props.selected}
      > 
      </HomeContent>
    )
  }
}

export default PerformanceAttribution;