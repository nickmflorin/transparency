import React from 'react';  
import PropTypes from 'prop-types';
import { Panel, Page, ManagerHeader } from '../../../components/layout'

class HistoricalPositions extends React.Component {
  static propTypes = {
    manager: PropTypes.object,
    dates: PropTypes.object,
  };
  render() {
    return (
        <Page
          header={(
            <ManagerHeader {...this.props} />
          )}
          {...this.props}
        > </Page>
    )
  }
}

export default HistoricalPositions;