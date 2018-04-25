import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore'

import { ManagerSidebarItem } from './ManagerSidebarItem'
import { ManagerSidebarSearches } from './ManagerSidebarSearches'

export class ManagerSidebar extends React.Component {
    constructor(props, context){
        super(props, context)
        var opened = {}

        var self = this 
        _.each(this.props.items, function(item){
            if(item.children){
                opened[item.id] = false 
            }
        })
        this.state = { opened : opened }
    }
    static propTypes = {
        apps: PropTypes.array.isRequired,
        selectManager: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
    };
    toggle(e, item){
        var opened = this.state.opened 
        if(opened[item.id] == true){
            opened[item.id] = false
        }
        else{
            opened[item.id] = true
        }
        this.setState({opened : opened})
    }
    isOpened(item){
        return this.state.opened[item.id]
    }
    getActives(item){
        if(item.children){
            return this.state.actives[item.id]
        }
        return null
    }
    isActive(item){
        const location = this.props.history.location
        if(location && location.pathname){
            if(item.link == location.pathname){
                return true 
            }
        }
        return false 
    }
    render(){
        var app = _.findWhere(this.props.apps, { id : 'managers' })

        var self = this 

        var actives = {}
        _.each(app.children, function(item){
            actives[item.id] = {}
            if(item.children){
                _.each(item.children, function(child){
                    actives[item.id][child.id] = self.isActive(child) 
                })
            }
        })
        
        return (
            <div className="sidebar-container">
                <div className='sidebar-panel'>
                    <div className="sidebar">
                        <ul className="sidebar-item-panel">
                            {app && app.children && app.children.map((app) => {
                                return (
                                    <ManagerSidebarItem 
                                        key={app.id} 
                                        app={app} 
                                        toggle={this.toggle.bind(this)}
                                        actives={actives[app.id]}
                                        opened={this.isOpened(app)} // Default for Now
                                    />
                                )
                            })}
                        </ul>
                        <ManagerSidebarSearches 
                            searches={this.props.searches || []}
                            selectManager={this.props.selectManager}
                            date={this.props.date}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
