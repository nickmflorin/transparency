import React from 'react';
import axios from 'axios';
import $ from 'jquery'
import _ from 'underscore'
import { PulseLoader } from 'react-spinners';

import MenuBar from '../../layout/menu/menu'
import ManagerAddButton from '../../layout/menu/searchButtons'

import ManagerHeader from '../../components/manager/header'
import ReturnsTable from '../../components/returns/returnsTable'
import ReturnsBarChart from '../../charts/ReturnsBarChart'

import './home.css'

class Home extends React.Component {
  constructor(){
    super()
    this.state = {
      'managers' : [], // Primary Manager Selected from Search Bar
      'active' : null,
      'loading' : false
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
          console.log(manager)

          var managers = self.state.managers
          managers.push(manager)
          
          self.setState({managers : managers})
          self.setState({active : manager})
        }
    });
  }
  addManager(manager){
  	var self = this 
    this.setState({'loading': true})

    var promiseObj = axios.get('http://localhost:8000/api/managers/?id=' + manager.id)
    promiseObj.then(function(response){
        self.setState({'loading' : false})

        if(response.data && response.data[0]){
          var manager = response.data[0]
          console.log(manager)

          var managers = self.state.managers
          managers.push(manager)
          self.setState({managers : managers})
        }
    });
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
          <ManagerHeader manager={this.state.active} />

          <div className="flex">
            <div className="manager-returns-table-container">
              <ReturnsTable 
              	returnsManagerType={this.returnsManagerType} 
              	manager={this.state.active}
              />
            </div>
            <div className="manager-returns-chart-container">
            	<ReturnsBarChart 
            		managers={this.state.managers}
            	/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home