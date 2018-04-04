import React from 'react';
import MenuContainer from '../Menu'

class AAMDashboard extends React.Component {
	constructor(props){
	    super(props)
	    this.state = {
	      'loading' : false
	    }
  	}
  	render(){
	    return (
	      <div className="menu-content">
	    	<MenuContainer />
	        <div className="content"></div>
	     </div>
    )
  }
}

export default AAMDashboard


