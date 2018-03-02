import React from 'react';
import _ from 'underscore'
import moment from 'moment'

import './header.css'

class ManagerHeader extends React.Component{
    render(){
      return (
        <div className="manager-header-container">
          <h2 className='manager-header-manager-name'> 
              {this.props.manager && this.props.manager.name} 
              <span className='light blue-text'> {this.props.returnsManagerType} </span> 
          </h2>
          <div className="flex-grow">
            <div className="float-r">
                <h2 className='manager-header-manager-id'> 
                    {this.props.manager && this.props.manager.id} 
                </h2>
            </div>
          </div>
        </div>
      )
    }
}

export default ManagerHeader;
