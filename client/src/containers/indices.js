import React from 'react';
import MenuBar from '../components/menu/menu'

class Indices extends React.Component {
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

	        <div className="content"></div>
	     </div>
    )
  }
}

export default Indices