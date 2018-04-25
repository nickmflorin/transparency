import React from 'react';  
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import _ from 'underscore'
import moment from 'moment'

import {  ReturnsTable } from '../../../components/tables'
import { Page, ManagerHeader } from '../../../components/layout'

import { Dates } from '../../../utilities'
import { Statistics } from '../../../config'
import Actions from '../../../actions'

import ListSelection from './ListSelection'
import ManagerResults from './ManagerResults'

const differentRanges = function(range1, range2){
  const starts_equal = moment(range1.start).isSame(range2.start)
  const ends_equal = moment(range1.end).isSame(range2.end)
  if(starts_equal && ends_equal){
    return false 
  }
  return true 
}

const defaultDimensions = function(stats){
  var dimensions = { x : null, y : null, z : null }
  const numeric = _.filter(stats, function(stat){
    return stat.type == 'numeric' 
  })
  const enabled = _.filter(numeric, function(stat){
    return stat.enabled === true
  })
  if(!dimensions.x){
    dimensions.x = enabled[0]
  }
  if(!dimensions.y){
    dimensions.y = enabled[0]
  }
  if(!dimensions.z){
    dimensions.z = enabled[0]
  }
  if(enabled.length > 1){
      dimensions.y = enabled[1]
      dimensions.z = enabled[1]
  }
  if(enabled.length > 2){
    dimensions.z = enabled[2]
  }
  return dimensions
}

export class ManagerComparison extends React.Component {
  constructor(props, context){
    super(props, context)

    this.default_enabled = ['name','strategy', 'range', 'maximum', 'month_3','month_6','year_1','year_3','year_5','average']
    const stats = Statistics(this.default_enabled)
    const dimensions = defaultDimensions(stats)

    this.state = {
      list : null,
      stats : stats,
      dimensions : dimensions,
      active : null,
    }
  }
  static propTypes = {
      user: PropTypes.object.isRequired,
      lists: PropTypes.array.isRequired,
      list: PropTypes.object
  };
  componentDidMount(){
    this.props.getManagerLists()
    if(!this.props.list){
      this.props.createNewManagerList()
    }
  }
  componentWillReceiveProps(props) {
    if(props.list){

      // Update Active Manager 
      if(props.list.managers.length != 0){

        if(!this.state.active){
          // Have to Get Full Manager to Display Full Manager Returns
          this.props.getManager(props.list.managers[0].id)
        }
        else{
          const exists = _.findWhere(props.list.managers, { id : this.state.active.id })
          if(!exists){
            // Have to Get Full Manager to Display Full Manager Returns
            this.props.getManager(props.list.managers[0].id)
          }
        }
      }
      // If No List Active, Remove Active Manager
      else{
        this.setState({ active : null })
      }

      // Update Active Manager on Click -> Clicked Manager from Table -> Make Sure Manager is In List
      if(props.manager){
        var exists = _.findWhere(props.list.managers, { id : props.manager.id })
        if(exists){
          this.setState({ active : props.manager })
        }
      }

      // Update Manager Returns if Dates Changed
      const startDiff = Dates.different(props.dates, this.props.dates, 'start')
      const endDiff = Dates.different(props.dates, this.props.dates, 'end')
      if(startDiff || endDiff){
   
        // Update Manager Returns Based on Start and End Dates
        this.props.updateManagerListDates({
          start_date : props.dates.start,
          end_date : props.dates.end,
        })
      }

      if(props.selected){
        if(!this.props.selected || this.props.selected.id != props.selected.id){
          // Gets Full Manager with Returns
          this.props.addManagerToList(props.selected.id, {
            start_date : this.props.dates.start,
            end_date : this.props.dates.end,
          })
        }
      }
    }
    // If No List Active, Remove Active Manager
    else{
      this.setState({ active : null })
    }
  }
  // When Manager is Removed, This Method Will Set Active Manager to Another Manager if Available
  findAnotherActiveManager(id){
      if(!this.props.list){
        throw new Error('List Should be Available if Manager Removed')
      }
      if(this.state.active && this.state.active.id == id){
        var others = _.filter(this.props.list.managers, function(mgr){
          return mgr.id != id 
        })
        // We Might Need to Refetch Manager Here for Total Return Stream
        if(others.length != 0){
          this.setState({ active : others[0] })
        }
        else{
          this.setState({ active : null })
        }
      }
  }
  onStatChange(id){
    var stats = this.state.stats 
    var stat = _.findWhere(this.state.stats, { id : id })
    if(!stat){
      throw new Error('Invalid Stat')
    }
    stat.enabled = !stat.enabled 
    this.setState({ stats : stats })
  }
  onDimensionChange(e, dim, id){

    // Stats Should Already All be Enabled
    const stats = _.filter(this.state.stats, function(stat){
      return stat.type == 'numeric' && stat.enabled === true
    })

    var stat = _.findWhere(stats, { id : id })
    if(!stat){
      throw new Error('Invalid Stat Provided')
    }
    var dimensions = this.state.dimensions 
    dimensions[dim] = stat 
    this.setState({ dimensions : dimensions })
  }
  render() {
    return (
      <Page 
        white={true}
        padded={true}
        error={this.state.error}
        className="content white-content"
        notificationTypes={[  
          'ADD_MANAGER_TO_LIST'
        ]}
        {...this.props}
      >
          <div className="blank-panel comparison-top-container">
            <div className="left">
              <ManagerHeader 
                manager={this.state.active}
                placeholderText="Select a manager from the table to view returns."
              />
              <div style={{marginTop: 15}}>
                <ReturnsTable 
                  dates={this.props.dates}
                  manager={this.state.active}
                />
              </div>
            </div>
            <div className="right">
              <ListSelection />
            </div>
          </div>

          <div className="blank-panel comparison-bottom-container">
              <ManagerResults 
                stats={this.state.stats}
                active={this.state.active}
                findAnotherActiveManager={this.findAnotherActiveManager.bind(this)}
                onStatChange={this.onStatChange.bind(this)}
              />
          </div>
      </Page>
    )
  }
}

const StateToProps = (state, ownProps) => {  
  return {
    errors : state.errors,
    lists : state.lists.lists, 
    list : state.lists.list,
    selected : state.managers.selected,
    manager : state.managers.manager,
    returns : state.managers.returns,
    user : state.auth.user,
    dates : state.dates,
  };
};

const DispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: (action) => dispatch(action),
    createNewManagerList: () =>  dispatch(Actions.list.new()),
    getManagerList: (id, options) =>  dispatch(Actions.list.get(id, options)),
    updateManagerListDates: (dates) => dispatch(Actions.list.updateDates(dates)),
    clearManagerList: () =>  dispatch(Actions.list.clear()),
    addManagerToList: (id, options) => dispatch(Actions.list.managers.add(id, options)),

    getManagerLists: () =>  dispatch(Actions.lists.get()),
    changeDate: (changes) => dispatch(Actions.changeDate(changes)),
    getManager: (id) => dispatch(Actions.manager.get(id)),
  }
};

export default connect(StateToProps, DispatchToProps)(ManagerComparison);  

