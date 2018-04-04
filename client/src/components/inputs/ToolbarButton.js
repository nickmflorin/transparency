import React from 'react';
import PropTypes from 'prop-types';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
var classNames = require('classnames');

export class ToolbarButton extends React.Component {
    constructor(props, context) {
        super(props, context)
    }
    static defaultProps = {
      flush: false,
      active : false,
      separated : false,
      disabled : false,
    };
    static propTypes = {
        id: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number
        ]),
        onClick: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired,
        flush: PropTypes.bool.isRequired,
        active: PropTypes.bool.isRequired,
        separated: PropTypes.bool.isRequired,
    }
    onClick(e){
      this.props.onClick(e, this.props.id)
    }
    render() {
      var classes = {
        'toolbar-btn': true,
        'active': (this.props.active && this.props.active === true),
        'separated': (this.props.separated && this.props.separated === true),
        'flush': this.props.flush,
        'disabled': this.props.disabled,
      }
      if(this.props.className){
        classes[this.props.className] = true 
      }
      var btnClass = classNames(classes);
    	return (
          	<a className={btnClass} onClick={this.onClick.bind(this)}> 
          		{this.props.icon && 
	               <span className='toolbar-btn-icon'>
                    <FontAwesomeIcon icon={this.props.icon}/> 
                  </span>
                }
                {this.props.label} 
          	</a>
    	)
    }
}