import React from 'react';
import PropTypes from 'prop-types';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { Dropdown, DropdownButton, MenuItem} from 'react-bootstrap';
import { MenuDropdownItem } from './DropdownItems'

export const MenuDropdown = (props) => (
	<Dropdown id={props.id} className="menu-item">
		<Dropdown.Toggle className="menu-item-link">
	        {props.app.icon && 
	            <span className='link-icon'>
	              <FontAwesomeIcon icon={props.app.icon}/> 
	            </span>
	        }
	        <span className='link-label'>
	            {props.app.label} 
	        </span>
	     </Dropdown.Toggle>
	    <Dropdown.Menu className="dropdown-menu menu-dropdown-menu">
    		{props.app.children.map((child) => {
		    	return <MenuDropdownItem key={child.id} app={child} onClick={ (e) => props.close(e, props.app) }/>
		    })}
	    </Dropdown.Menu>
	</Dropdown>
)