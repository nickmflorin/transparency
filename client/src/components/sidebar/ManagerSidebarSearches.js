import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore'
import { connect } from 'react-redux'
import moment from 'moment'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faClock from '@fortawesome/fontawesome-free-solid/faClock'
import faCaretUp from '@fortawesome/fontawesome-free-solid/faCaretUp'
import faCaretDown from '@fortawesome/fontawesome-free-solid/faCaretDown'

import { BrowserRouter, Link, Route } from 'react-router-dom';
import { DropdownButton, ButtonToolbar, MenuItem } from 'react-bootstrap';

import { selectManager } from '../../actions'

class ManagerSidebarSearchItem extends React.Component {
    constructor(props, context){
        super(props, context)
    }
    render(){
        return (
            <li className='manager-sidebar-item manager-sidebar-search-item'>
                <a className='manager-sidebar-link manager-sidebar-search-link' onClick={(e) => this.props.onSelect(e, this.props.manager)}>
                    <span className='manager-sidebar-label manager-sidebar-search-label'>
                        {this.props.manager.name} 
                    </span>
                </a>
            </li>
        )
    }
}

class ManagerSidebarSearches extends React.Component {
    constructor(props, context){
        super(props, context)
        this.state = { opened : true }
    }
    toggle(){
        this.setState({ opened : !(this.state.opened) })
    }
    onSelect(e, manager){
        var start_mmt = new moment(new Date(this.props.dates.start.year, this.props.dates.start.month, 1))
        var end_mmt = new moment(new Date(this.props.dates.end.year, this.props.dates.end.month, 1))
        this.props.selectManager(
            manager.id, 
            start_mmt.format('YYYY-MM-DD'), 
            end_mmt.format('YYYY-MM-DD'), 
            {'group' : []} // Flags API to Get Relative Stats to Peers and Benchmarks
        )
    }
    render(){
        var linkClass = 'manager-sidebar-link manager-sidebar-parent-link'
        var caret = this.state.opened ? faCaretDown : faCaretUp
        return (
            <ul className="manager-sidebar-search-panel">
                <div className="manager-sidebar-search-container">
                    <li className='manager-sidebar-item manager-sidebar-parent-item'>
                        <a className={linkClass} onClick={this.toggle.bind(this)} >
                            <span className='manager-sidebar-caret'>
                                <FontAwesomeIcon icon={caret}/> 
                            </span>
                            <span className='manager-sidebar-label manager-sidebar-parent-label'>
                                Recent Searches
                            </span>
                            <span className='manager-sidebar-icon'>
                                <FontAwesomeIcon icon={faClock}/> 
                            </span>
                        </a>
                    </li>
                    {this.state.opened && 
                        this.props.searches && this.props.searches.map((manager) => {
                            return (
                                <ManagerSidebarSearchItem 
                                    manager={manager} 
                                    key={manager.id} 
                                    onSelect={this.onSelect.bind(this)}
                                />
                            )
                        })
                    }
                </div>
            </ul>
        )
    }
}

const StateToProps = (state, ownProps) => {  
  return {
    searches : state.mgrs.searches
  };
};
const DispatchToProps = (dispatch, ownProps) => {
    return {
        selectManager: (id, start_date, end_date, options) =>  dispatch(selectManager(id, start_date, end_date, options)),
    }
}
export default connect(StateToProps, DispatchToProps)(ManagerSidebarSearches);  