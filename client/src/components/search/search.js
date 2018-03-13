import React from 'react';
import { connect } from 'react-redux'

import { apiSearchManager } from '../../api'
import SearchResults from './results'
import './search.css'

class SearchBarInput extends React.Component{
  constructor(props){
    super(props)
    this.state = {'search' : ''}
  }
  handleChange(){
    var value = this.refs.searchInput.value
    this.setState({'search' : value})
    this.props.onChange(value)
  }
  render(){
    return (
      <form className="search-bar-form">
        <input className="manager-search" type="text" placeholder="Search for a Manager..." value={this.state.search} ref="searchInput" onChange={this.handleChange.bind(this)}/>
      </form>
    )
  }
}

class SearchBar extends React.Component{
  constructor(){
    super()
    this.state = {
      'results' : [], 
      'showResults' : true
    }
  }
  clear(){
    this.setState({'results' : []})
  }
  onChange(value) {
    this.setState({'showResults' : true})

    var self = this 
    if(value && value.trim() !== ""){
      apiSearchManager(value).then(results => {
          self.setState({results : results})
      })
    }
    else{
      self.setState({'results' : []})
    }
  }
  render() {
    return (
      <div className="search-container">
        <SearchBarInput 
          search={this.state.search}
          onChange={this.onChange.bind(this)}
        />
        {this.state.showResults && 
          <SearchResults
            results={this.state.results}
            clear={this.clear.bind(this)}
            {...this.props}
          />
        }
      </div>
    );
  }
}

export default SearchBar



