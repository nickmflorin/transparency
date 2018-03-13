import React from 'react';
import _ from 'underscore'
import moment from 'moment'

class ManagerHeader extends React.Component{
    render(){
      return (
        <div className="header-container">
          <div className="title-container">
            <h2 className="title">
              {this.props.manager && this.props.manager.name}
              {this.props.manager && 
                  <span className="subtitle"> {this.props.manager.id} </span>
              }
            </h2>
          </div>
        </div>
      )
    }
}

export default ManagerHeader;
