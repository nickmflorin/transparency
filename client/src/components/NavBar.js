import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faBars from '@fortawesome/fontawesome-free-solid/faBars'

import { LoginDropdown, UserDropdown } from './dropdowns'

export class NavBar extends React.Component {
	static propTypes = {
	    auth: PropTypes.object.isRequired,
	    isAuthenticated: PropTypes.bool.isRequired,
	    onLogIn: PropTypes.func.isRequired,
	    onLogOut: PropTypes.func.isRequired,
	    toggleSidebar: PropTypes.func.isRequired,
	};
	render(){
		return (
			<div className='nav-bar'>
		    	<div className='nav-bar-left-container'>
					<Link 
						className="nav-bar-logo" to="/">
						Transparency
					</Link>
					<div className='nav-bar-open-container'>
						<a className="sidebar-open-button" onClick={this.props.toggleSidebar}>
							<FontAwesomeIcon icon={faBars} />
						</a>
	        		</div>
				</div>
				<div className="nav-bar-separator-container"></div>
				<div className="nav-bar-right-container">
					 <div className="nav-bar-right-buttons-container">
				 		<div className='nav-login-button-container'>
				           {!this.props.isAuthenticated && 
				              <LoginDropdown 
				                id="login"
				                label="Login"
				                auth={this.props.auth}
				                errors={this.props.errors}
				                isAuthenticated={this.props.isAuthenticated}
				                onLogIn={this.props.onLogIn}
				              />
				            }
				            {this.props.isAuthenticated && 
				              <UserDropdown 
				                id="user"
				                label={this.props.auth.user.username}
				                errors={this.props.errors}
				                isAuthenticated={this.props.isAuthenticated}
				                user={this.props.auth.user}
				                onLogOut={this.props.onLogOut}
				              />
				            }
				      </div>
					 </div>
				</div>
		  </div>
		)
	}
}

