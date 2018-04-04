import React from 'react';  
import PropTypes from 'prop-types';
import { Panel, HomeContent } from '../../../components/layout'

class HistoricalPositions extends React.Component {
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
  render() {
    return (
        <HomeContent> </HomeContent>
    )
  }
}

export default HistoricalPositions;