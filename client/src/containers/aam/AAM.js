import React from 'react';
import MenuContainer from '../Menu'

class AAM extends React.Component {
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

export default AAM


