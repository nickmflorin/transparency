import React from 'react';  
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import _ from 'underscore'
import moment from 'moment'
import $ from 'jquery'

import MenuBar from '../components/menu/menu'
import ManagerHeader from '../components/elements/ManagerHeader'
import ManagerComparisonToolbar from '../components/elements/ManagerComparisonToolbar'

import { ManagerComparisonTable, ReturnsTable } from '../components/tables'
import { ManagerComparisonBubbleChart } from '../components/charts'
import { SaveListModal } from '../components/modals'

import { ManagerStatisticsConfiguration } from '../utilities'
import { getManagerLists, addManagerList, getManagerList, clearManagers, removeManager, updateManagerReturns, selectManager, clearManagerLists, Loading } from '../actions'

import ManagersAPI from '../api/manager'
import './manager_comparison.css'

class ManagerComparison extends React.Component {
  constructor(props, context){
    super(props, context)

    // To Do: Allow Specifications of Parent For When These Become More Complex
    var enabled = ['name','strategy','type', 'maximum', 'month_3','month_6','year_1','year_3','year_5','average']
    var stat_config = new ManagerStatisticsConfiguration(enabled)

    this.state = {
      stat_config : stat_config,
      modalIsOpen : false,

      active : null, // Manager Clicked in Table
      selectedManager : null,
      dates : { 
        start : { month : 0, year : 2012 }, 
        end : { month : 0, year : 2018 }
      },
    }
  }
  static propTypes = {
    getManagerLists: PropTypes.func.isRequired,
    clearManagerLists: PropTypes.func.isRequired
  };
  componentDidMount(){
    //this.props.clearManagerLists()
    this.props.getManagerLists()
  }
  componentWillReceiveProps(nextProps) {
    var self = this 

    // To Do: Filter Managers to Make Sure Multiple Selected Managers Do Not Exist
    var selectedManager = null;
    if(nextProps.managers.length != 0){
      _.each(nextProps.managers, function(manager){
        if(manager.selected){
          selectedManager = manager;
        }
      })
      if(selectedManager){
        self.setState({ selectedManager : selectedManager })
        self.setState({ active : selectedManager })
      }
      else{
        // Here We Have to Worry About Removing Selected Manager but Setting Active Manager
        self.setState({ selectedManager : nextProps.managers[0] })
        self.setState({ active : nextProps.managers[0] })
      }
    }
    else{
      self.setState({ selectedManager : null })
      self.setState({ active : null })
    }
  }

  onLoad(e, list){  
    this.props.loadList(list.id)
    this.props.clearManagers()
  }
  onSelect(e, manager){
    var start_mmt = new moment(new Date(this.state.dates.start.year, this.state.dates.start.month, 1))
    var end_mmt = new moment(new Date(this.state.dates.end.year, this.state.dates.end.month, 1))
    var exists = _.findWhere(this.props.managers, { id : manager.id })

    if(!exists){
      this.props.selectManager(manager.id, start_mmt.format('YYYY-MM-DD'), end_mmt.format('YYYY-MM-DD'))
    }
    else{
      console.log('Manager Already in List')
    }
  }
  setActiveManager(e, manager){
    this.setState({ active : manager })
  }
  removeManager(manager){
    this.props.removeManager(manager.id)
  }
  toggleModal(){
    console.log('toggling modal')
    this.setState({modalIsOpen: !this.state.modalIsOpen});
  }
  onClear(e){
    this.props.clearManagers()
  }
  handleDateChange(id, year, month){
    if(this.state.dates[id]){
      if(this.state.dates[id]['year'] == year && this.state.dates[id]['month'] == month){
        return 
      }
    }

    // To Do: Make Sure Manager Return Update Works Before Updating Dates in State
    var dates = this.state.dates 
    dates[id]['year'] = year
    dates[id]['month'] = month 
    this.setState({ dates : dates })

    var startDate = moment({ 
      year : this.state.dates.start.year, 
      month : this.state.dates.start.month, 
      day : 1
    })

    var endDate = moment({ 
      year : this.state.dates.end.year, 
      month : this.state.dates.end.month, 
      day : 1
    })

    if(this.props.list){
      if(this.props.list.managers.length != 0){
          console.log('Updating Returns for',this.props.list.managers.length,'Managers in List')
          var ids = _.pluck(this.props.list.managers, 'id')
          this.props.updateManagerReturns(ids, startDate, endDate)
      }
    }
    else{
      if(this.props.managers.length != 0){
          console.log('Updating Returns for',this.props.managers.length,'Managers in List')
          var ids = _.pluck(this.props.managers, 'id')
          this.props.updateManagerReturns(ids, startDate, endDate)
      }
    }
  }
  toggleStat(event, toToggle){
    var config = this.state.stat_config 
    config.toggle(toToggle.id)
    this.setState({ stat_config : config })
  }
  get to_download(){
    var data = this.state.stat_config.create_array(this.props.managers)
    return data
  }
  togglePeers(){
    console.log('Toggling Peers and Benchmarked Suppressed for This Version')
    return
    var current = this.state.showPeers 
    this.setState({ showPeers : !current })
  }
  toggleBenchmarks(){
    console.log('Toggling Peers and Benchmarked Suppressed for This Version')
    return
    var current = this.state.showBenchmarks 
    this.setState({ showBenchmarks : !current })
  }
  render() {
    return (
      <div className="menu-content">

        <MenuBar 
          onSelect={this.onSelect.bind(this)}
        />

        <SaveListModal 
          list={this.props.list}
          managers={this.props.managers}
          show={this.state.modalIsOpen} 
          onClose={this.toggleModal.bind(this)}
          addManagerList={this.props.addManagerList}
        />

        <div className="content">
          {this.state.active && 
            <ManagerHeader manager={this.state.active} />
          }

          <div className="manager-comparison-top" style={{marginTop:10}}>
            <div className="left">
              <ReturnsTable 
                title={this.state.active && this.state.active.name}
                subtitle={this.state.active && this.state.active.id}
                dates={this.state.dates}
                complete={(this.state.active && this.state.active.returns && this.state.active.returns.complete) || []}
                in_range={(this.state.active && this.state.active.returns && this.state.active.returns.series) || []}
              />
            </div>
            <div className="right">
              <ManagerComparisonBubbleChart 
                managers={this.props.managers}
                stat_config={this.state.stat_config}
              />
            </div>
          </div>

          <div className="manager-comparison-bottom">
              <ManagerComparisonToolbar 
                  stat_config={this.state.stat_config}

                  handleDateChange={this.handleDateChange.bind(this)}
                  toggleStat={this.toggleStat.bind(this)}
                  togglePeers={this.togglePeers.bind(this)}
                  toggleBenchmarks={this.toggleBenchmarks.bind(this)}

                  to_download={this.to_download}
                  onSave={this.toggleModal.bind(this)}
                  onLoad={this.onLoad.bind(this)}
                  onClear={this.onClear.bind(this)}

                  lists={this.props.lists}
                  list={this.props.list}
                  dates={this.state.dates}
                />

              <ManagerComparisonTable 
                  stat_config={this.state.stat_config}
                  data={this.props.managers}
                  rowClicked={this.setActiveManager.bind(this)} 
                  removeManager={this.removeManager.bind(this)}
              />
            </div>
        </div>
    </div>
    )
  }
}

const ComparisonStateToProps = (state, ownProps) => {  
  return {
    lists : state.lists, 
    list : state.list,
    managers : state.managers
  };
};

const ComparisonDispatchToProps = (dispatch, ownProps) => {
  return {
    getManagerLists: () =>  dispatch(getManagerLists()),
    loadList: (id) =>  dispatch(getManagerList(id)),
    clearManagerLists : () => dispatch(clearManagerLists()),

    addManagerList: (list) =>  dispatch(addManagerList(list)),
    removeManager: (id) =>  dispatch(removeManager(id)),
    clearManagers: () =>  dispatch(clearManagers()),
    updateManagerReturns: (ids, start_date, end_date) =>  dispatch(updateManagerReturns(ids, start_date, end_date)),
    selectManager: (id, start_date, end_date) =>  dispatch(selectManager(id, start_date, end_date, false)),

    startLoading: () =>  dispatch(Loading.startLoading()),
    stopLoading: () =>  dispatch(Loading.stopLoading()),
  }
};

export default connect(ComparisonStateToProps, ComparisonDispatchToProps)(ManagerComparison);  

