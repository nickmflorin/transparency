import React from 'react';  
import PropTypes from 'prop-types';
import moment from 'moment'

import { AlertControl, AlertControlComponent } from '../alerts'
import { PageHeader } from './PageHeader'

var classNames = require('classnames')

export const HomeContent = function(props){
  const classes = classNames({
     "content" : true,
     "white-content" : props.white
  })
  return (

    <div className={classes}>
      <PageHeader 
        {...props}
      />

      <div className='content-under-header'>
          <AlertControl 
            warning={props.warning} 
            error={props.error} 
          />

        {props.children}
      </div>
    </div>
  )
}

export default HomeContent;

