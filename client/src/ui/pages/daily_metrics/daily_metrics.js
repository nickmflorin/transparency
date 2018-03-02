import React from 'react';

import { PulseLoader } from 'react-spinners';
import MenuBar from '../../layout/menu/menu'

class DailyMetrics extends React.Component {
	constructor(props){
	    super(props)
	    this.state = {
	      'loading' : false
	    }
  	}
  	render(){
	    return (
	      <div className="menu-content">
	    	<MenuBar />

	        <div className='loading'>
	          <PulseLoader
	            color={'#004C97'} 
	            loading={this.state.loading} 
	          />
	        </div>
	        <div className="content"></div>
	     </div>
    )
  }
}

export default DailyMetrics

