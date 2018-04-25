import React from 'react';
import PropTypes from 'prop-types'
import _ from 'underscore'
import moment from 'moment'

import { CSSTransitionGroup } from 'react-transition-group'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCalendar from '@fortawesome/fontawesome-free-regular/faCalendar'
import faUser from '@fortawesome/fontawesome-free-regular/faUser'

import { FormGroup, InputGroup, FormControl } from 'react-bootstrap'
import { DateInput } from '../elements'

var classNames = require('classnames');

export class ManagerHeaderContent extends React.Component {
  static propTypes = {
    placeholderText : PropTypes.string.isRequired,
  }
  static defaultProps = {
    placeholderText : "Please select a manager from the search bar..."
  }
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
                {(this.props.manager && this.props.manager.name) || this.props.placeholderText}
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

export class ManagerHeader extends React.Component {
  constructor(props, context){
    super(props, context)
  }
  static propTypes = {
    snapshot : PropTypes.bool.isRequired,
    manager : PropTypes.object,
    placeholderText : PropTypes.string,
    changeDate : PropTypes.func,
  }
  static defaultProps = {
    snapshot : false,
  }
  render(){
    return (
      <FormGroup className="page-header">
          <div className="page-header-item">
            <ManagerHeaderContent manager={this.props.manager} placeholderText={this.props.placeholderText}/>
          </div>

          {this.props.snapshot && 
              <div className="page-header-item">
                  <DateInput 
                    id="date"
                    date={this.props.dates.date} 
                    pushRight={true}
                    changeDate={this.props.changeDate}
                  />
              </div>
          }
      </FormGroup>
    )
  }
}