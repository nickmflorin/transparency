import React from 'react';
import axios from 'axios';
import _ from 'underscore'

import { DropdownButton, ButtonToolbar, MenuItem} from 'react-bootstrap';

import ReactTable from "react-table";
import "react-table/react-table.css";
import Utilities from '../../../../utilities.js'

import ManagerComparisonToolbar from './toolbar'
import ManagerComparisonStats from './stats'
import './table.css'

class TableManager {
  constructor(manager, kwargs){
    _.extend(this, manager)
    this.peer = kwargs.peer || false 
    this.benchmark = kwargs.benchmark || false 
  }
}
class GeneralReturnTableRow extends React.Component {
  render() {
      var cumulative = {}
      if(this.props.stats && this.props.stats.cumulative){
        cumulative = this.props.stats.cumulative
      }
      const buttons = this.props.actionButtons || []
      return (
        <tr className={this.props.className} onClick={this.props.rowClicked} data-click='test'>
          <td className='overflow-cell'> {this.props.name} </td>
          <td className='center-cell'> {this.props.title} </td>
          <td className='center-cell'> {this.props.strategy}</td>
          <td className='value-cell'> {cumulative && cumulative.lookback && Utilities.percentify(cumulative.ytd)} </td>
          <td className='value-cell'> {cumulative && cumulative.lookback && Utilities.percentify(cumulative.lookback[3])} </td>
          <td className='value-cell'> {cumulative && cumulative.lookback && Utilities.percentify(cumulative.lookback[6])} </td>
          <td className='value-cell'> {cumulative && cumulative.lookback && Utilities.percentify(cumulative.lookback[12])} </td>
          <td className='value-cell'> {cumulative && cumulative.lookback && Utilities.percentify(cumulative.lookback[24])} </td>
          <td className='value-cell'> {cumulative && cumulative.lookback && Utilities.percentify(cumulative.lookback[36])} </td>
          <td className='value-cell'> {cumulative && cumulative.lookback && Utilities.percentify(cumulative.lookback[60])} </td>
          <td className='value-cell'> {this.props.stats && Utilities.percentify(this.props.stats.maximum)} </td>
          <td className='value-cell'> {this.props.stats && Utilities.percentify(this.props.stats.minimum)} </td>
          <td className='value-cell'> {this.props.stats && Utilities.percentify(this.props.stats.average)} </td>
          {buttons.map((config) => {
              if(!config.ignore){
                return <td className="center-cell" key={config.id}> <a className='table-link' onClick={config.clicked}> {config.label} </a> </td>
              }
              return <td className="center-cell" key={config.id}> </td>
            })
          }
        </tr>
      )
  }
}

class PeerAnalysisTableRow extends React.Component {
  remove = (e) => {
    e.stopPropagation();
    this.props.remove(this.props.peer) 
  }
  activate = (e) => {
    e.stopPropagation();
    this.props.activate(this.props.peer) 
  }
  render() {
    return (
      <GeneralReturnTableRow 
        className = "peer-row"
        name={this.props.peer.name}
        rowClicked={this.props.rowClicked}
        title="Peer"
        actionButtons={[
          {'id' : 'remove', 'label' : 'Remove', 'clicked' : this.remove},
          {'id' : 'primary', 'label' : 'Set as Primary', 'clicked' : this.activate}
        ]}
        strategy={this.props.peer.strategy && this.props.peer.strategy.name}
        stats={this.props.peer.returns && this.props.peer.returns.stats}
      />
    )
  }
}

class BenchmarkAnalysisTableRow extends React.Component {
  remove = (e) => {
    e.stopPropagation();
    this.props.remove(this.props.benchmark) 
  }
  activate = (e) => {
    e.stopPropagation();
    this.props.activate(this.props.benchmark) 
  }
  render() {

    return (
      <GeneralReturnTableRow 
        className = "benchmark-row"
        name={this.props.benchmark.name}
        rowClicked={this.props.rowClicked}
        title="Benchmark"
        actionButtons={[
          {'id' : 'remove', 'label' : 'Remove', 'clicked' : this.remove},
          {'id' : 'primary', 'label' : 'Set as Primary', 'clicked' : this.activate}
        ]}
        strategy={this.props.benchmark.strategy && this.props.benchmark.strategy.name}
        stats={this.props.benchmark.returns && this.props.benchmark.returns.stats}
      />
    )
  }
}

class ManagerAnalysisTableRow extends React.Component {
  remove = (e) => {
    e.stopPropagation();
    this.props.remove(this.props.manager) 
  }
  activate = (e) => {
    e.stopPropagation();
    this.props.activate(this.props.manager) 
  }
  render() {
    return (
      <GeneralReturnTableRow 
        className = "manager-row"
        name={this.props.manager.name}
        rowClicked={this.props.rowClicked}
        title=""
        actionButtons={[
          {'id' : 'remove', 'label' : 'Remove', 'clicked' : this.remove},
          {'id' : 'primary', 'label' : 'Set as Primary', 'clicked' : this.activate}
        ]}
        strategy={this.props.manager.strategy && this.props.manager.strategy.name}
        stats={this.props.manager.returns && this.props.manager.returns.stats}
      />
    )
  }
}

class PrimaryManagerAnalysisTableRow extends React.Component {
    render() {
      return (
        <GeneralReturnTableRow 
          className = "primary-row"
          name={this.props.manager.name}
          rowClicked={this.props.rowClicked}
          title=""
          actionButtons={[
            {'id' : 'remove', 'ignore' : true},
            {'id' : 'primary', 'ignore' : true}
          ]}
          strategy={this.props.manager.strategy && this.props.manager.strategy.name}
          stats={this.props.manager.returns && this.props.manager.returns.stats}
        />
      )
    }
}

class ManagerComparisonTable extends React.Component {
  constructor(props){
    super(props)

    var enabled = ['name','strategy','type', {'returns' : ['3_year']}]
    var stats = new ManagerComparisonStats(enabled)    
    this.state = {stats : stats}
  }
  toggleStat(event, stat){
    var stats = this.state.stats 
    if(!stat) throw new Error('Stat Object Required')

    if(stat.parent){
      var parentStat = _.findWhere(stats, { id : stat.parent })
      if(!parentStat) throw new Error('Invalid Parent Stat ID : ' + stat.parent)

      var childStat = _.findWhere(parentStat.children, { id : stat.id })
      if(!childStat) throw new Error('Invalid Child Stat ID : ' + stat.id)

      childStat.enabled = !(childStat.enabled)
      this.setState({ stats : stats })
    }
    else{
      var childStat = _.findWhere(stats, { id : stat.id })
      if(!childStat) throw new Error('Invalid Stat ID : ' + stat.id)

      childStat.enabled = !(childStat.enabled)
      console.log(stats)
      this.setState({ stats : stats })
    }
  }
  getManagers(){
      var to_chart = []
      _.each(this.props.managers , function(manager){
        var chartable = new TableManager(manager)
        to_chart.push(chartable)
      })
      _.each(this.props.benchmarks , function(manager){
        var chartable = new TableManager(manager, {benchmark : true})
        to_chart.push(chartable)
      })
      _.each(this.props.peers , function(manager){
        var chartable = new TableManager(manager, {peer : true})
        to_chart.push(chartable)
      })
      return to_chart 
  }
  getColumns(){
      var columns = []

      // To Do: Allow Disabling of Parent to Block All Children Elements from Being Displayed
      _.each(this.state.stats, function(stat){
        if(stat.children){
          _.each(stat.children, function(child){
            if(child.enabled){
              var col =  {Header : child.header, id: child.id, accessor : child.accessor}
              columns.push(col)
            }
          })
        }
        else{
          if(stat.enabled){
            var col =  {Header : stat.header, id: stat.id, accessor : stat.accessor}
            columns.push(col)
          }
        }
      })

      var self = this 
      const RemoveColumn = {
        Header : "Remove", 
        id: "remove", 
        Cell: function(row){
          return <a className='table-link' onClick={(e) => self.props.removeManager(row.original)}> Remove </a>
        }
      }

      columns.push(RemoveColumn)
      return columns
  }
  render(){

    var columns = this.getColumns()
    var managers = this.getManagers() // Formatted in ChartManager Object
    
    return(
      <div className="manager-comparison-bottom">
        <ManagerComparisonToolbar 
          stats={this.state.stats}
          toggleStat={this.toggleStat.bind(this)}
        />
        <ReactTable
            data={managers}
            columns={columns}
            verticalAlign='middle'
            defaultPageSize={20}
            className="-striped -highlight"
            getTdProps={this.tdProps}
        />
      </div>
    )
  }
}

export default ManagerComparisonTable;