import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCaretUp from '@fortawesome/fontawesome-free-solid/faCaretUp'
import faCaretDown from '@fortawesome/fontawesome-free-solid/faCaretDown'

class ManagerSidebarSubItem extends React.Component {
    render(){
        var linkClass = 'sidebar-link'
        if(this.props.active === true){
            linkClass += ' active'
        }
        return (
            <li className='sidebar-item child'>
                <Link className={linkClass} to={this.props.item.link} >
                    <span className='sidebar-label'>
                        {this.props.item.label} 
                    </span>
                </Link>
            </li>
        )
    }
}

export class ManagerSidebarItem extends React.Component {
    static propTypes = {
        item: PropTypes.object.isRequired,
        toggle: PropTypes.func.isRequired,
    };
    isActive(child){
        if(this.props.actives){
            return this.props.actives[child.id]
        }
        return false
    }
    render(){
        var linkClass = 'sidebar-link'
        if(this.props.active === true){
            linkClass += ' active'
        }

        var caret = this.props.opened ? faCaretDown : faCaretUp
        return (
            <div className="sidebar-item-container">
                <li className='sidebar-item parent'>
                    {this.props.item.children &&
                        <a className={linkClass} onClick={(e) => this.props.toggle(e, this.props.item)} >
                            <span className='sidebar-caret'>
                                <FontAwesomeIcon icon={caret}/> 
                            </span>
                            <span className='sidebar-label'>
                                {this.props.item.label} 
                            </span>
                            <span className='sidebar-icon'>
                                <FontAwesomeIcon icon={this.props.item.icon}/> 
                            </span>
                        </a>
                    }
                    {!this.props.item.children &&
                        <Link to={this.props.item.link} className={linkClass}>
                            <span className='sidebar-label'>
                                {this.props.item.label} 
                            </span>
                            <span className='sidebar-icon'>
                                <FontAwesomeIcon icon={this.props.item.icon}/> 
                            </span>
                        </Link>
                    }
                </li>
                {this.props.opened && 
                    this.props.item.children && this.props.item.children.map((child) => {
                        return(
                            <ManagerSidebarSubItem 
                                item={child} 
                                key={child.id} 
                                active={this.isActive(child)}
                            />
                        )
                    })
                }
            </div>
        )
    }
}
