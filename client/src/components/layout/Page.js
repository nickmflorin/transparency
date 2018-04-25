import React from 'react';  
import PropTypes from 'prop-types';
import moment from 'moment'
import _ from 'underscore'

import { AlertControl } from '../Alerts'
import Background from './background.png';

var classNames = require('classnames')

export class Page extends React.Component {
  constructor(state, context){
    super(state, context)
    this.state = {
      errors : [],
      warnings : []
    }
  }
  static propTypes = {
    white : PropTypes.bool.isRequired,
    padded : PropTypes.bool.isRequired,
    requesting : PropTypes.bool.isRequired,
    backgroundImage : PropTypes.bool.isRequired,
    notificationTypes : PropTypes.array.isRequired,
  };
  static defaultProps = {
    white: false,
    padded: false,
    backgroundImage : true,
    notificationTypes : [],
  };
  componentWillReceiveProps(props){

    var errors = [], warnings = []
    var self = this 

    _.each(this.props.notificationTypes, function(type){
      var err = _.findWhere(props.errors, { reference : type })
      if(err){
        errors.push(err)
      }
      var warning = _.findWhere(props.warnings, { reference : type })
      if(warning){
        warnings.push(warning)
      }
    })

    this.setState({ warnings : warnings, errors : errors })
  }
  render() {
    const classes = classNames({
       "page" : true,
       "padded" : this.props.padded ? true : false,
    })

    var subClasses = {}
    var showHeader = false;
    if(this.props.manager !== undefined){
      showHeader = true;
      subClasses["margin-top"] = true;
    }   
    subClasses = classNames(subClasses)

    var BackgroundContainerStyle = {}
    // Currently Not Using Background Image
    // if(this.props.backgroundImage){
    //   BackgroundContainerStyle.backgroundImage = `url(${Background})`
    // }

    var showAlert = false;
    if(this.state.warnings.length != 0 || this.state.errors.length != 0){
      showAlert = true;
    }

    return (
      <div className={classes} style={BackgroundContainerStyle}>
        {this.props.header}

        <div className={subClasses}>
            {showAlert &&
              <AlertControl 
                warnings={this.state.warnings} 
                errors={this.state.errors} 
              />
            }
            {this.props.children}
        </div>
      </div>
    );
  }
}



