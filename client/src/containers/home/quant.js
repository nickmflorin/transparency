import React from 'react';  
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import _ from 'underscore'
import moment from 'moment'

export class ManagerQuant extends React.Component {
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