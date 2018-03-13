import React from 'react';
import PropTypes from 'prop-types';

class ManagerAddButton extends React.Component {
  static propTypes = {
    result: PropTypes.object.isRequired,
    clear: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired
  };
  onClick(event){
    this.props.clear()
    this.props.onClick(event, this.props.result)
  }
  render(){
    return (
      <div className="search-button-container">
        <a className='search-link search-link-add-on' key={this.props.id} onClick={this.onClick.bind(this)}>
          {this.props.label}
        </a>
      </div>
    )
  }
}
class SearchButtons extends React.Component {
  static propTypes = {
    result: PropTypes.object.isRequired,
    clear: PropTypes.func.isRequired,
  };
  render(){
    return (
        <div className="search-buttons-container">
          {this.props.onAdd && 
            <ManagerAddButton label="Add" result={this.props.result} onClick={this.props.onAdd} clear={this.props.clear} />
          }
        </div>
    )
  }
}
class SearchResult extends React.Component{
    static propTypes = {
      result: PropTypes.object.isRequired,
      clear: PropTypes.func.isRequired,
      onSelect: PropTypes.func.isRequired
    };
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
            <SearchButtons 
              {...this.props}
            />
          </div>
      )
    }
}

export default SearchResult;