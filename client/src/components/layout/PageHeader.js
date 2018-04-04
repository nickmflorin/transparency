import React from 'react';
import PropTypes from 'prop-types'
import _ from 'underscore'
import moment from 'moment'

import { CSSTransitionGroup } from 'react-transition-group'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCalendar from '@fortawesome/fontawesome-free-regular/faCalendar'
import faUser from '@fortawesome/fontawesome-free-regular/faUser'

import { FormGroup, InputGroup, FormControl } from 'react-bootstrap'
import { DateInput } from '../inputs'

var classNames = require('classnames');

export class ManagerHeader extends React.Component {
  render(){
    var titleClass = classNames({
      'title': true,
      'placeholder': !this.props.manager
    });
    return (
        <InputGroup className="separable">
          <InputGroup.Addon>
          <FontAwesomeIcon icon={faUser}/> 
          </InputGroup.Addon>
            <div className="header-box">
              <h2 className={titleClass}> 
                {(this.props.manager && this.props.manager.name) || "Please select a manager from the search bar..."}
              </h2>
              {this.props.manager && 
                <h2 className="subtitle"> 
                  {this.props.manager.id} 
                </h2>
              }
            </div>
        </InputGroup>
    )
  }
}

export class PageHeader extends React.Component {
  constructor(props, context){
    super(props, context)
  }
  static propTypes = {
    date : PropTypes.object,
    start : PropTypes.object,
    end : PropTypes.object,
    manager : PropTypes.object,
    changeDate : PropTypes.func,
  }
  render(){
    return (
      <FormGroup className="page-header">
          <div className="page-header-item">
            <ManagerHeader manager={this.props.manager}/>
          </div>

          {this.props.date && 
              <div className="page-header-item">
                  <DateInput 
                    id="date"
                    date={this.props.date} 
                    pushRight={true}
                    changeDate={this.props.changeDate}
                  />
              </div>
          }
      </FormGroup>
    )
  }
}