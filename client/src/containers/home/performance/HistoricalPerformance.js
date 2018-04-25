import React from 'react';  
import PropTypes from 'prop-types';

import _ from 'underscore'
import moment from 'moment'

import { ReturnsTable } from '../../../components/tables'
import { BetaBarChart } from '../../../components/charts'
import { Panel, Page, ManagerHeader } from '../../../components/layout'

class HistoricalPerformance extends React.Component {
  static propTypes = {
    selected: PropTypes.object,
    manager: PropTypes.object,
    getManager: PropTypes.func.isRequired,
    getManagerBetas: PropTypes.func.isRequired,
    betas: PropTypes.object,
    date: PropTypes.object,
  };
  handleDateChange(id, year, month){
    this.setState({ date : { month : month, year : year }})

    if(this.state.manager){
      const manager = this.state.manager
      var date = new moment(new Date(this.props.date.year, this.props.date.month, 1))
      this.props.selectManager(manager.id)
    }
  }
  render() {
    return (
       <Page
        manager={this.props.selected}
        notificationTypes={[
          'GET_MANAGER_RETURNS',
          'GET_MANAGER_BETAS'
        ]}
        header={(
          <ManagerHeader {...this.props} />
        )}
        {...this.props}
       >
          <div className="panel chart-panel manager-home-top" style={{marginTop:10}}>
              <ManagerReturns 
                  date={this.props.date} 
                  manager={this.props.manager} 
                  selected={this.props.selected} 
                  getManager={this.props.getManager} 
              />
              <ManagerBetas 
                  date={this.props.date} 
                  betas={this.props.betas} 
                  selected={this.props.selected} 
                  getManagerBetas={this.props.getManagerBetas} 
                />
          </div>
          <div className="manager-home-bottom"></div>
     </Page> 
    )
  } 
}

class ManagerReturns extends React.Component {
  constructor(props, context){
    super(props, context)
    this.state = {
      selected_id : null, // Keeps Track of Active Manager So Multiple API Requests Not Performed
      manager : null,
    }
  }
  static propTypes = {
    selected: PropTypes.object,
    manager: PropTypes.object,
    getManager: PropTypes.func.isRequired,
    date: PropTypes.object,
  };
  componentWillMount(){
    if(this.props.selected){
      this.setState({ selected_id : this.props.selected.id })
      if(!this.state.manager || this.state.manager.id != this.props.selected.id){
          this.props.getManager(this.props.selected.id)
      }
    }
  }
  componentWillReceiveProps(props){
   
    if(props.selected){
      if(!this.state.selected_id || this.state.selected_id != props.selected.id){
        this.setState({selected_id : props.selected.id})
        this.props.getManager(props.selected.id)
      }
    }
    if(props.manager){
      if(!this.state.manager || this.state.manager.id != props.manager.id ){
        this.setState({manager : props.manager})
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.manager){
      if(!this.state.manager || this.state.manager.id != nextState.manager.id){
        return true 
      }
    }
    return false 
  }
  render(){
    return (
      <div className="left">
        <ReturnsTable 
            dates={this.props.dates} // To Do: Use Manager Return Range Here Instead of Front End Dates
            manager={this.state.manager}
        />
      </div>
    )
  }
}

class ManagerBetas extends React.Component {
  constructor(props, context){
    super(props, context)
    this.state = {
      selected_id : null, // Keeps Track of Active Manager So Multiple API Requests Not Performed
      betas : null,
    }
  }
  static propTypes = {
    selected: PropTypes.object,
    betas: PropTypes.object,
    getManagerBetas: PropTypes.func.isRequired,
    date: PropTypes.object,
  };
  toggle(e, id){
      this.setState({'active' : id})
  }
  componentWillMount(){
    if(this.props.selected){
      this.setState({ selected_id : this.props.selected.id })
      if(!this.state.betas || this.state.betas.manager != this.props.selected.id){
          this.props.getManagerBetas(this.props.selected.id)
      }
    }
  }
  componentWillReceiveProps(props){
    // Will Only Update if shouldComponentUpdate Notices Difference
    if(props.selected){
      if(!this.state.selected_id || this.state.selected_id != props.selected.id){
        this.setState({selected_id : props.selected.id})
        this.props.getManagerBetas(props.selected.id)
      }
    }
    if(props.betas){
      if(!this.state.betas || this.state.betas.manager != props.betas.manager ){
        this.setState({betas : props.betas})
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.betas){
      if(!this.state.betas || this.state.betas.manager != nextState.betas.manager){
        return true 
      }
    }
    return false 
  }
  render(){
    return (
      <div className="right" style={{paddingTop:25}}>
        <BetaBarChart 
          date={this.props.date}
          betas={this.state.betas}
        />
      </div>
    )
  }
}



export default HistoricalPerformance;


