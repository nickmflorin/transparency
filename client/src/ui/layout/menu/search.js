import React from 'react';
import axios from 'axios';
import './search.css'

class SearchButtons extends React.Component {
  // Generates Button Component from Button Obj = {cls : ... label : ... id : ... onClick : ...}
  createButtonComponent(buttonObj){
    const ButtonComponent = buttonObj.cls 
    return <ButtonComponent id={buttonObj.id} label={buttonObj.label} result={this.props.result} onClick={buttonObj.onClick} clear={this.props.clear}/>
  }
  render(){
    var buttonComponents = []
    if(this.props.buttons){
      buttonComponents = this.props.buttons.map((button, i) => {
        return this.createButtonComponent(button)
      })
    }

    return (
        <div className="search-buttons-container">
          {buttonComponents.map((component, i) => {
              return (
                <div className="search-button-container" key={i}>
                    {component}
                </div>
              )
          })}
        </div>
    )
  }
}

// To Do: Make Buttons That Are Appended Onto Search Bar Dynamic
class SearchResultElement extends React.Component{
    // Have to Externalize On Click to Also Clear Search Results
    onClick(event){
      this.props.clear()
      this.props.onSelect(event, this.props.result)
    }
    render() {
      return (
          <div className="search-item clearfix" id={this.props.result.id}>
            <a className='search-link search-link-manager' onClick = {this.onClick.bind(this)}>
                <span className='light medium search-link-id'> {this.props.result.id} </span> 
                <span className='heavy black medium search-link-name'> {this.props.result.name} </span> 
            </a>
            <SearchButtons buttons={this.props.buttons} result={this.props.result} clear={this.props.clear}/>
          </div>
      )
    }
}

class SearchBarResults extends React.Component{
  render(){
    return (
      <div className='scroll-search-results-container'>
        <div className='search-results-container'>
            <div className="search-list-group">
              {this.props.results.map((result) => {
                  return (
                    <SearchResultElement 
                        key={result.id} 
                        result={result}
                        onSelect={this.props.onSelect} 
                        buttons={this.props.buttons}
                        clear={this.props.clear}
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
  clear(){
    this.setState({'results' : []})
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
            buttons={this.props.buttons}
            onSelect={this.props.onSelect}
            clear={this.clear.bind(this)}
          />
        }
      </div>
    );
  }
}

export default SearchBar

