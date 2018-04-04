import React from 'react';
import PropTypes from 'prop-types';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faClock from '@fortawesome/fontawesome-free-solid/faClock'
import faCaretUp from '@fortawesome/fontawesome-free-solid/faCaretUp'
import faCaretDown from '@fortawesome/fontawesome-free-solid/faCaretDown'

class ManagerSidebarSearchItem extends React.Component {
    static propTypes = {
        manager: PropTypes.object.isRequired,
        selectManager: PropTypes.func.isRequired
    };
    render(){
        return (
            <li className='sidebar-item search'>
                <a className='sidebar-link' onClick={(e) => this.props.selectManager(this.props.manager)}>
                    <span className='sidebar-label'>
                        {this.props.manager.name} 
                    </span>
                </a>
            </li>
        )
    }
}

export class ManagerSidebarSearches extends React.Component {
    constructor(props, context){
        super(props, context)
        this.state = { opened : true }
    }
    static propTypes = {
        searches: PropTypes.array.isRequired,
        selectManager: PropTypes.func.isRequired
    };
    toggle(){
        this.setState({ opened : !(this.state.opened) })
    }
    render(){
        var linkClass = 'sidebar-link'
        var caret = this.state.opened ? faCaretDown : faCaretUp
        return (
            <ul className="sidebar-search-panel">
                <div className="sidebar-search-container">
                    <li className='sidebar-item parent'>
                        <a className={linkClass} onClick={this.toggle.bind(this)} >
                            <span className='sidebar-caret'>
                                <FontAwesomeIcon icon={caret}/> 
                            </span>
                            <span className='sidebar-label'>
                                Recent Searches
                            </span>
                            <span className='sidebar-icon'>
                                <FontAwesomeIcon icon={faClock}/> 
                            </span>
                        </a>
                    </li>
                    {this.state.opened && 
                        this.props.searches.map((manager) => {
                            return (
                                <ManagerSidebarSearchItem 
                                    manager={manager} 
                                    key={manager.id} 
                                    selectManager={this.props.selectManager}
                                />
                            )
                        })
                    }
                </div>
            </ul>
        )
    }
}

