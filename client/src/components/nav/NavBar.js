import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faBars from '@fortawesome/fontawesome-free-solid/faBars'

import { LoginDropdown, UserDropdown } from '../dropdowns'

export class NavBar extends React.Component {
	static propTypes = {
	    authErrors: PropTypes.array,
	    isAuthenticated: PropTypes.bool.isRequired,
	    user: PropTypes.object, // Not Always Required if User Not Logged In Yet
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
						Rock Creek
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
				                authErrors={this.props.authErrors}
				                isAuthenticated={this.props.isAuthenticated}
				                onLogIn={this.props.onLogIn}
				              />
				            }
				            {this.props.isAuthenticated && 
				              <UserDropdown 
				                id="user"
				                label={this.props.user.username}
				                isAuthenticated={this.props.isAuthenticated}
				                user={this.props.user}
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

