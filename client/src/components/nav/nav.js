import React from 'react';
import ReactDOM from 'react-dom'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faBars from '@fortawesome/fontawesome-free-solid/faBars'

import NavLogin from '../login/NavLogin'
import './nav.css'

class NavBar extends React.Component {
	render(){
		return (
			<div className='nav-bar'>
		    	<div className='nav-bar-left-container'>
					<a className="nav-bar-logo">Rock Creek</a>
					<div className='nav-bar-open-container'>
						<a className="sidebar-open-button">
							<FontAwesomeIcon icon={faBars} />
						</a>
	        		</div>
				</div>
				<div className="nav-bar-separator-container"></div>
				<div className="nav-bar-right-container">
					 <div className="nav-bar-right-buttons-container">
						  <NavLogin />
					 </div>
				</div>
		  </div>
		)
	}
}

export default NavBar;