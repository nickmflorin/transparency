import React from 'react';  
import PropTypes from 'prop-types';
import moment from 'moment'

import { PageHeader } from './PageHeader'
var classNames = require('classnames')

export const PageContent = function(props){
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
        {props.children}
      </div>
    </div>
  )
}

export default PageContent;

