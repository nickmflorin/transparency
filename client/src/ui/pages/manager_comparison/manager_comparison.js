import React from 'react';
import axios from 'axios';
import $ from 'jquery'
import _ from 'underscore'
import { PulseLoader } from 'react-spinners';

import MenuBar from '../../layout/menu/menu'
import ManagerAddButton from '../../layout/menu/searchButtons'

import ManagerComparisonBubbleChart from '../../charts/ManagerComparisonBubbleChart'
import ManagerHeader from '../../components/manager/header'
import ReturnsTable from '../../components/returns/returnsTable.js'

import ManagerComparisonTable from './table/table.js'
import './manager_comparison.css'

class ManagerComparison extends React.Component {
  constructor(){
    super()
    this.state = {
      // Active Manager Clicked from Table -> Defaults to Manager When Manager Selected
      // We Were Only Using This When We Wanted to Show Returns for Other Managers in Table
      'active' : null, 

      'manager' : null, // Primary Manager Selected from Search Bar
      'managers' : [],  // Supplementary Added Managers
      'peers' : [], 
      'benchmarks' : [], 
      'loading' : false
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.selectedManager){
      if(!this.props.selectedManager || nextProps.selectedManager.id != this.props.selectedManager.id){
        var manager = nextProps.selectedManager 
        this.getManager(manager)
      }
    }
  } 
  isPresent(id){
    if(this.state.manager && this.state.manager.id == id){
      return true
    }

    var groups = ['benchmarks','peers','managers']

    var self = this 
    var found = false;
    _.each(groups, function(group){
        var lookup = self.state[group] || []
        var inGroup = _.findWhere(lookup, {'id' : id}) 
        if(inGroup){
          found = true 
        }
    })
    return found
  }
  // Event Handler from Table -> Sets Primary Manager to New Manager and Adjusts Peers and Benchmarks

  // Cant Blindly Set All States of Manager (i.e.)
  // this.setState({manager : manager, 'active' : manager, 'peers' : manager.peers || [], 'benchmarks' : manager.benchmarks || [], 'managers':[]})
  // If This Manager is Peer or Benchmark, There Will Be no Peer or Benchmark Statistics
  activate(manager){
    this.setState({'loading': true})
    var self = this 
    var promiseObj = axios.get('http://localhost:8000/api/managers/?id=' + manager.id)
    promiseObj.then(function(response){
        self.setState({'loading' : false})

        if(response.data && response.data[0]){
          var manager = response.data[0]
          self.setState({manager : manager, 'active' : manager, 'peers' : manager.peers || [], 'benchmarks' : manager.benchmarks || []})
        }
    });
  }
  rowClicked(e, manager){
    this.setState({'active' : manager})
  }
  // Event Handler from Table
  // Possible Situation of Manager Being in Benchmarks & Peers?
  removeManager(manager){
    
    var present = this.isPresent(manager.id)
    if(!present) throw new Error('ID ' + manager.id + ' Not Present in Analysis')
    
    var groups = ['benchmarks','peers','managers']
    var update = {}

    var self = this 
    _.each(groups, function(group){
        var lookup = self.state[group] || []
        var inGroup = _.findWhere(lookup, {'id' : manager.id}) 
        if(inGroup){
            var current = self.state[group]
            current = _.without(current, inGroup)
            update[group] = current
        }
    })
    self.setState(update)
  }


  added(id){
    var self = this 
    this.setState({'showResults' : false})
    var present = this.isPresent(id)

    if(! present){
      this.setState({'loading': true})
      var promiseObj = axios.get('http://localhost:8000/api/managers/?id=' + id)
      promiseObj.then(function(response){
        self.setState({'loading' : false})

        if(response.data && response.data[0]){
          var manager = response.data[0]
          
          var managers = self.state.managers
          managers.push(manager)
          self.setState({managers : managers})
        }
      });
    }
  }
  peersBenchmarksToggled(event){
    var checked = $(event.target).is(':checked')
    if(!checked){

      // Clear Peers/Benchmarks
      var state = {}
      state[event.target.id] = []
      this.setState(state)
    }
    else{
      // Add Peers/Benchmarks Back
      var manager = this.state.manager
      var state = {}
      if(manager){
        state[event.target.id] = manager[event.target.id]
        this.setState(state)
      }
    }
  }
  
  // When Searched Manager is Clicked -> Manager in SearchResults Does Not Have All of the Details We Need
  setActiveManager(manager){
    var self = this 
    this.setState({'loading': true})

    var promiseObj = axios.get('http://localhost:8000/api/managers/?id=' + manager.id)
    promiseObj.then(function(response){
        self.setState({'loading' : false})

        if(response.data && response.data[0]){
          var manager = response.data[0]
          self.setState({manager : manager, 'active' : manager, 'peers' : manager.peers || [], 'benchmarks' : manager.benchmarks || []})
        }
    });
  }
  addManager(manager){
    var self = this 

    this.setState({'showResults' : false})
    var present = this.isPresent(manager.id)

    if(! present){
      this.setState({'loading': true})

      var promiseObj = axios.get('http://localhost:8000/api/managers/?id=' + manager.id)
      promiseObj.then(function(response){
        self.setState({'loading' : false})

        if(response.data && response.data[0]){
          var manager = response.data[0]
          
          var managers = self.state.managers
          managers.push(manager)
          self.setState({managers : managers})
        }
      });
    }
  }
  onAdd(e, result){
    if(result){
      this.addManager(result)
    }
  }
  searched(e, result){
    if(result){
      this.setActiveManager(result)
    }
  }
  render() {
    return (
      <div className="menu-content">
        <MenuBar 
          onSelect={this.searched.bind(this)} 
          buttons={[
            {'cls' : ManagerAddButton, 'onClick' : this.onAdd.bind(this), 'label' : 'Add', 'id' : 'add'}
          ]}
        />

        <div className='loading'>
          <PulseLoader
            color={'#004C97'} 
            loading={this.state.loading} 
          />
        </div>

        <div className="content">
          <ManagerHeader manager={this.state.manager} />

          <div className="manager-comparison-top">
            <div className="left">
              <ReturnsTable manager={this.state.active}/>
            </div>
            <div className="right">
              <ManagerComparisonBubbleChart 
                manager={this.state.manager}
                peers={this.state.peers}
                benchmarks={this.state.benchmarks}
                managers={this.state.managers}
              />
            </div>
          </div>

          <ManagerComparisonTable 
              peersBenchmarksToggled={this.peersBenchmarksToggled.bind(this)}
              rowClicked={this.rowClicked.bind(this)} 
              removeManager={this.removeManager.bind(this)}
              activate={this.activate.bind(this)}

              manager={this.state.manager} 
              managers={this.state.managers} 
              peers={this.state.peers} 
              benchmarks={this.state.benchmarks} 
          />
        </div>
    </div>
    )
  }
}

export default ManagerComparison;