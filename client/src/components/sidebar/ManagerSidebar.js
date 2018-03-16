import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore'

import { BrowserRouter, Link, Route } from 'react-router-dom';
import { DropdownButton, ButtonToolbar, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCaretUp from '@fortawesome/fontawesome-free-solid/faCaretUp'
import faCaretDown from '@fortawesome/fontawesome-free-solid/faCaretDown'

import { ManagerSidebarItems } from '../../config'
import ManagerSidebarSearches from './ManagerSidebarSearches'
import './ManagerSidebar.css'

class ManagerSidebarSubItem extends React.Component {
    constructor(props, context){
        super(props, context)
    }
    isActive(){
        if(this.props.location && this.props.location.pathname){
            if(this.props.item.link == this.props.location.pathname){
                return true 
            }
        }
        return false 
    }
    render(){
        var linkClass = 'manager-sidebar-link manager-sidebar-child-link'
        if(this.isActive() === true){
            linkClass += ' active'
        }
        return (
            <li className='manager-sidebar-item manager-sidebar-child-item'>
                <Link className={linkClass} to={this.props.item.link} >
                    <span className='manager-sidebar-label manager-sidebar-child-label'>
                        {this.props.item.label} 
                    </span>
                </Link>
            </li>
        )
    }
}

class ManagerSidebarItem extends React.Component {
    constructor(props, context){
        super(props, context)
        this.state = { opened : undefined }
    }
    componentWillReceiveProps(props){
        if(props.opened !== undefined){
            this.setState({ opened : props.opened })
        }
    }
    toggle(){
        this.setState({ opened : !(this.state.opened) })
    }
    isActive(){
        if(this.props.location && this.props.location.pathname){
            if(this.props.item.link == this.props.location.pathname){
                return true 
            }
        }
        return false 
    }
    render(){
        var linkClass = 'manager-sidebar-link manager-sidebar-parent-link'
        if(this.isActive() === true){
            linkClass += ' active'
        }

        var caret = this.state.opened ? faCaretDown : faCaretUp
        return (
            <div className="manager-sidebar-item-container">
                <li className='manager-sidebar-item manager-sidebar-parent-item'>
                    {this.props.item.children &&
                        <a className={linkClass} onClick={this.toggle.bind(this)} >
                            <span className='manager-sidebar-caret'>
                                <FontAwesomeIcon icon={caret}/> 
                            </span>
                            <span className='manager-sidebar-label manager-sidebar-parent-label'>
                                {this.props.item.label} 
                            </span>
                            <span className='manager-sidebar-icon'>
                                <FontAwesomeIcon icon={this.props.item.icon}/> 
                            </span>
                        </a>
                    }
                    {!this.props.item.children &&
                        <Link to={this.props.item.link} className={linkClass}>
                            <span className='manager-sidebar-label manager-sidebar-parent-label'>
                                {this.props.item.label} 
                            </span>
                            <span className='manager-sidebar-icon'>
                                <FontAwesomeIcon icon={this.props.item.icon}/> 
                            </span>
                        </Link>
                    }
                </li>
                {this.state.opened && 
                    this.props.item.children && this.props.item.children.map((child) => {
                        return <ManagerSidebarSubItem item={child} key={child.id} location={this.props.location}/>
                    })
                }
            </div>
        )
    }
}

export class ManagerSidebar extends React.Component {
    constructor(props, context){
        super(props, context)
    }
    render(){
        return (
            <div className="sidebar-container">
                <div className='manager-sidebar-panel'>
                    <div className="manager-sidebar">
                        <ul className="manager-sidebar-item-panel">
                            {ManagerSidebarItems.map((item) => {
                                return (
                                    <ManagerSidebarItem 
                                        item={item} 
                                        key={item.id} 
                                        location={this.props.location}
                                        opened={false} // Default for Now
                                    />
                                )
                            })}
                        </ul>
                        <ManagerSidebarSearches 
                            dates={this.props.dates}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

const StateToProps = (state, ownProps) => {  
  return {
    location : state.location,
  };
};
const DispatchToProps = (dispatch, ownProps) => ({})
export default connect(StateToProps, DispatchToProps)(ManagerSidebar);  
