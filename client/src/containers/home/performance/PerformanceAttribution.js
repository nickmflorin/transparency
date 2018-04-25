import React from 'react';  
import PropTypes from 'prop-types';

import _ from 'underscore'
import moment from 'moment'
import { Panel, Page, ManagerHeader } from '../../../components/layout'

class PerformanceAttribution extends React.Component {
  static propTypes = {
    manager: PropTypes.object,
    dates: PropTypes.object,
  };
  render() {
    return (
      <Page
        manager={this.props.selected}
        header={(
          <ManagerHeader {...this.props} />
        )}
        {...this.props}
      > 
      </Page>
    )
  }
}

export default PerformanceAttribution;