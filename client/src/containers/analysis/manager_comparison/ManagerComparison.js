import React from 'react';  
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import _ from 'underscore'
import moment from 'moment'

import {  ReturnsTable } from '../../../components/tables'
import { PageContent } from '../../../components/layout'

import { Dates } from '../../../utilities'
import { Statistics } from '../../../config'
import Actions from '../../../actions'

import ListSelection from './ListSelection'
import ManagerResults from './ManagerResults'
import './manager_comparison.css'

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
  componentDidMount(){
    this.props.getManagerLists()
    if(!this.props.list){
      if(!this.props.user){
        throw new Error('User Must be Available')
      }
      this.props.createTempManagerList()
    }
  }
  componentWillReceiveProps(props) {
    if(props.list){

      // Have to Get Returns for Managers Already in List if List Loaded
      // if(!this.props.list || this.props.list.id != props.list.id){
      //   if(props.list.managers.length != 0){
      //     // Get Full Manager Model to Set to New Active Manager
      //     this.props.addManagerToList(props.list.managers[0].id)
      //   }
      //   else{
      //     this.setState({ active : null })
      //   }
      // }

      const startDiff = Dates.different(props.dates, this.props.dates, 'start')
      const endDiff = Dates.different(props.dates, this.props.dates, 'end')
      if(startDiff || endDiff){
   
        // Update Manager Returns Based on Start and End Dates
        this.props.updateManagerListDates({
          start_date : props.dates.start,
          end_date : props.dates.end,
        })
      }

      // Clicked Manager from Table -> Make Sure Manager is In List
      if(props.manager){
        var exists = _.findWhere(props.list.managers, { id : props.manager.id })
        if(exists){
          this.setState({ active : props.manager })
        }
      }

      if(props.selected){
        if(!this.props.selected || this.props.selected.id != props.selected.id){
          // Get Full Manager Model to Set to New Active Manager
          console.log('Getting Manager')
          this.props.getManager(props.selected.id)
        }
      }
      if(props.manager){
        if(!this.props.manager || this.props.manager.id != props.manager.id){
          this.props.addManagerToList(props.manager, {
            start_date : this.props.dates.start,
            end_date : this.props.dates.end,
          })
        }
      }
    }
  }
  removeManager(id){
    if(this.state.active){
      if(this.state.active.id == id){
        this.setState({ active : null })

        if(this.props.list){ // List Should be Present
          var others = _.filter(this.props.list.managers, function(mgr){
            return mgr.id != id
          })
          if(others.length != 0){
            this.props.getManager(others[0].id)
          }
        }
      }
    }
    this.props.removeManagerFromList(id)
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
  // Active Manager Selected from Comparison Table Has Sliced Returns, Want to Get Main Manager with All Returns
  // Have to Get Full Manager from API
  setActiveManager(manager){
    this.props.getManager(manager.id)
  }
  render() {
    return (
      <PageContent 
        manager={this.state.active}
        white={true}
        className="content white-content"
      >
        <div className='content-under-header'>
            <div className="blank-panel comparison-top-container">
              <div className="left">
                <ReturnsTable 
                  dates={this.props.dates}
                  manager={this.state.active}
                />
              </div>
              <div className="right">
                <ListSelection />
              </div>
            </div>
            <div className="blank-panel comparison-bottom-container">
                <ManagerResults 
                  stats={this.state.stats}
                  rowClicked={this.setActiveManager.bind(this)}
                  onStatChange={this.onStatChange.bind(this)}
                  removeManager={this.removeManager.bind(this)}
                  {...this.props}
                />
            </div>
        </div>
      </PageContent>
    )
  }
}

const StateToProps = (state, ownProps) => {  
  return {
    lists : state.lists.lists, 
    list : state.lists.list,
    successes : state.successes.list,
    errors : state.errors.list,
    selected : state.managers.selected,
    manager : state.managers.manager,
    returns : state.managers.returns,
    user : state.auth.user,
    dates : state.dates,
  };
};

const DispatchToProps = (dispatch, ownProps) => {
  return {
    clearErrors: () => dispatch(Actions.errors.list.clear()),
    clearSuccesses: () => dispatch(Actions.successes.list.clear()),

    createTempManagerList: () =>  dispatch(Actions.list.temp()),
    saveNewManagerList: (name) =>  dispatch(Actions.list.saveNew(name)),
    saveManagerList: () =>  dispatch(Actions.list.save()),
    getManagerList: (id, options) =>  dispatch(Actions.list.get(id, options)),
    updateManagerListDates: (dates) => dispatch(Actions.list.updateDates(dates)),
    clearManagerList: () =>  dispatch(Actions.list.clear()),
    addManagerToList: (id, options) => dispatch(Actions.list.managers.add(id, options)),
    removeManagerFromList: (id) => dispatch(Actions.list.managers.remove(id)),

    getManagerLists: () =>  dispatch(Actions.lists.get()),
    changeDate: (changes) => dispatch(Actions.changeDate(changes)),
    getManager: (id) => dispatch(Actions.manager.get(id)),
  }
};

export default connect(StateToProps, DispatchToProps)(ManagerComparison);  

