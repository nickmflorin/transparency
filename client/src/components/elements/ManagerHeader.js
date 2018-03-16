import React from 'react';
import _ from 'underscore'
import moment from 'moment'

import ToolbarDateRange from './ToolbarDateRange'
import ToolbarDate from './ToolbarDate'
import './ManagerHeader.css'

class ManagerHeader extends React.Component{
    render(){
      var className = "header-container"

      return (
        <div className={className}>
          <div className="header-title-container">
            <h2 className="title">
              {this.props.manager && this.props.manager.name}
              {this.props.manager && 
                  <span className="subtitle"> {this.props.manager.id} </span>
              }
            </h2>
          </div>
          <div className="header-dates-container">
              <div className="header-dates-right-container">
                  {this.props.dates && this.props.dates.start && this.props.dates.end && 
                    <ToolbarDateRange start={this.props.dates} />
                  }
                  {this.props.date && 
                    <ToolbarDate 
                      handleDateChange={this.props.handleDateChange}
                      date={this.props.date} 
                    />
                  }
              </div>
           </div>
        </div>
      )
    }
}

export default ManagerHeader;
