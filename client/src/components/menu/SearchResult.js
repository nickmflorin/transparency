import React from 'react';
import PropTypes from 'prop-types';

class ManagerAddButton extends React.Component {
  static propTypes = {
    result: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
  };
  onClick(event){
    this.props.clear()
    this.props.onClick(event, this.props.result)
  }
  render(){
    return (
      <div className="search-button-container">
        <a className='search-link search-link-add-on' 
          key={this.props.id} 
          onClick={this.onClick.bind(this)}>
          {this.props.label}
        </a>
      </div>
    )
  }
}
class SearchButtons extends React.Component {
  static propTypes = {
    result: PropTypes.object.isRequired,
    onAdd: PropTypes.func.isRequired,
  };
  render(){
    return (
        <div className="search-buttons-container">
          {this.props.onAdd && 
            <ManagerAddButton 
              label="Add" 
              result={this.props.result} 
              onClick={this.props.onAdd} 
            />
          }
        </div>
    )
  }
}
export class SearchResult extends React.Component{
    static propTypes = {
      result: PropTypes.object.isRequired,
      onSelect: PropTypes.func.isRequired,
    };
    // Sometimes Components Might Not Want On Select Behavior (i.e. Data Component)
    onClick(event){
      this.props.onSelect(this.props.result)
    }
    render() {
      var className = 'search-link search-link-manager'
      if(this.props.hovered == this.props.index){
          className = className + ' ' + 'auto-focus'
      }
      return (
          <div className="search-item clearfix" id={this.props.result.id}>
            <a className={className} 
                onClick = {this.onClick.bind(this)} 
                ref={(link) => { this.item = link; }} >
                    <span className='light medium search-link-id'> {this.props.result.id} </span> 
                    <span className='heavy black medium search-link-name'> {this.props.result.name} </span> 
            </a>
            <SearchButtons 
              {...this.props}
            />
          </div>
      )
    }
}
