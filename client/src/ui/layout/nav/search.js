import React from 'react';
import axios from 'axios';
import './search.css'

function ManagerAddButton(props){
  console.log('Creating Button for : ',props.label)
  return(
    <a className='manager-search-add-link' onClick={props.onAdd}>
      {props.label}
    </a>
  )
}

// To Do: We Probably Eventually Want to Make This So That Page Components Pass in Buttons by Including
// Header on Their Own Render Functions -> Would Need to Rearrange Content Component to Do This
function SearchButtonConfig(path){
  var config = {
    '/' : [
      {id : 'add', label : 'Add'}
    ],
    '/data' : [
      {id : 'add', label : 'Add'}
    ]
  }
  return config[path]
}

class SearchButtons extends React.Component {
  get buttons(){
    var buttons = SearchButtonConfig(this.props.path)
    return buttons
  }
  render(){
    return (
        <div className="search-buttons-container">
          {this.buttons && this.buttons.map((button) => {
              return <ManagerAddButton key={button.id} label={button.label} onAdd={this.props.onAdd} />
          })}
        </div>
    )
  }
}

// To Do: Make Buttons That Are Appended Onto Search Bar Dynamic
class SearchResultElement extends React.Component{
    render() {
      return (
          <div className="manager-search-item clearfix" id={this.props.result.id}>
            <a className='manager-search-link' onClick = {(event) => this.props.onSelect(event, this.props.result)}>
                <p className='light medium manager-search-link-id'> {this.props.result.id} </p> 
                <p className='heavy black medium manager-search-link-name'> {this.props.result.name} </p> 
            </a>
            {this.props.path && 
              <SearchButtons 
                path={this.props.path} 
                onAdd = {(event) => this.props.onAdd(event, this.props.result)}
              />
            }
          </div>
      )
    }
}

class SearchBarResults extends React.Component{
  render(){
    return (
      <div className='scroll-search-results-container'>
        <div className='search-results-container'>
            <div className="manager-list-group">
              {this.props.results.map((result) => {
                  return (
                    <SearchResultElement 
                        key={result.id} 
                        result={result}
                        onSelect={this.props.onSelect} 
                        onAdd={this.props.onAdd}
                        path={this.props.path}
                    />
                  )
                })
              }
            </div>  
          </div>
        </div>
    )
  }
}

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
        <input type="text" placeholder="Search for a Manager..." value={this.state.search} ref="searchInput" onChange={this.handleChange.bind(this)}/>
      </form>
    )
  }
}

class SearchBar extends React.Component{
  constructor(){
    super()
    this.state = {'results' : [], 'showResults' : false}
  }
  onSelect(e, result){
    this.setState({'results' : []})
    if(this.props.onSelect){
      this.props.onSelect(e, result)
    }
  }
  onChange(value) {
    this.setState({'showResults' : true})

    var self = this 
    if(value && value.trim() !== ""){
      var promiseObj = axios.get('http://localhost:8000/api/managers/?search=' +  value)
      promiseObj.then(function(response){
          self.setState({results : response.data})
      });
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
          <SearchBarResults
            results={this.state.results}
            onSelect={this.onSelect.bind(this)}
            onAdd={this.props.onAdd}
            path={this.props.path}
          />
        }
      </div>
    );
  }
}

export class MenuSearchNavigation extends React.Component {
  constructor(props){
    super(props)
    this.state = {'showResults' : false}
  }
  render(){
    return (
        <div className='menu-search-navigation'>
          <SearchBar 
            onAdd={this.props.onAdd}
            showResults={this.state.showResults} 
            onSelect={this.props.onSelect}
            path={this.props.path}
          />
        </div>
    )
  }
}

export default MenuSearchNavigation

