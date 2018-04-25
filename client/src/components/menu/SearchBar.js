import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import _ from 'underscore'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faArrowLeft from '@fortawesome/fontawesome-free-solid/faArrowLeft'

import { SearchResults } from './SearchResults'

export class SearchBar extends React.Component{
  constructor(){
    super()
    this.state = {
      search : '',
      results : [], 
      show_results : false,
      hovered : 0
    }

    var self = this 
    document.onkeydown = function(e) {
        switch (e.keyCode) {
          case 13:
              if(self.state.results.length != 0){
                  const result = self.state.results[self.state.hovered]
                  if(result){
                    self.clear()
                    self.props.onSelect(e, result)
                  }
              }
              break;
          case 38: 
              self.setState({hovered : Math.max(self.state.hovered - 1, 0)})
              break;
          case 40: 
              const maxAllowed = self.state.results.length
              self.setState({hovered : Math.min(self.state.hovered + 1, maxAllowed)})
              break;
        }
    };
  }
  static propTypes = {
      search_results: PropTypes.array.isRequired,
      selectManager: PropTypes.func.isRequired,
      searchManager: PropTypes.func.isRequired,
  };
  componentWillReceiveProps(props){
    if(props.search_results){
      this.setState({ results : props.search_results })
    }
  }
  onSelect(manager){
    if(!this.props.selected || this.props.selected.id != manager.id){
        this.clear()
        this.props.selectManager(manager)
    }
  }
  onAdd(manager){

  }
  handleChange(){
    var value = this.refs.searchRef.value
    this.setState({'search' : value})
    
    var self = this 
    if(value && value.trim() !== ""){
      this.setState({ show_results : true })
      this.props.searchManager(value)
    }
    else{
      self.setState({'results' : [], 'show_results' : false})
    }
  }
  clear(){
    this.setState({ show_results : false })
  }
  onFocus(){
    //this.enableManualPan()
  }
  onBlur(){
    this.setState({ hovered : 0 })
  }
  back(e){
    console.log('Back Button Temporarily Disabled...')
    return 

    // To Do: Need to Have Active Selected Manager To Know Current Index of Where We Are
    if(this.props.searches && this.props.searches.length != 0){
      if(this.props.manager){
        var lastSearch = _.findWhere(this.props.searches, { id : this.props.manager.id})
        var lastInd = _.indexOf(this.props.searches, lastSearch)
        // var most_recent = this.props.searches[this.props.searches.length - 2]
        // this.clear()
        // this.props.onSelect(e, most_recent)
      } 
    }
  }
  render() {
    return (
      <div className="search-container">
        <div className="search-bar-container">
          <a className="btn btn-back" onClick={this.back.bind(this)}>
              <span className="back-button-icon">
                <FontAwesomeIcon icon={faArrowLeft}/> 
              </span>
          </a>
          <div className="search-bar-form">
            <input 
                className="manager-search" 
                ref="searchRef"
                type="text" 
                placeholder="Search for a Manager..." 
                value={this.state.search}
                onChange={this.handleChange.bind(this)}
                onFocus={this.onFocus.bind(this)} 
                onBlur={this.onBlur.bind(this)} 
                search={this.state.search}
              />
          </div>
        </div>

        {this.state.show_results && 
          <SearchResults
            results={this.state.results}
            clear={this.clear.bind(this)}
            hovered={this.state.hovered}
            onSelect={this.onSelect.bind(this)}
            onAdd={this.onAdd.bind(this)}
          />
        }
      </div>
    );
  }
}



