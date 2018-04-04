import React from 'react';
import PropTypes from 'prop-types';
import { SearchResult } from './SearchResult'

export class SearchResults extends React.Component{
  static propTypes = {
    results: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
  };
  render(){
    return (
      <div className='scroll-search-results-container'>
        <div className='search-results-container'>
            <div className="search-list-group">
              {this.props.results.map((result, i) => {
                  return (
                    <SearchResult
                        key={result.id}
                        index={i}
                        hovered={this.props.hovered} 
                        result={result}
                        onSelect={this.props.onSelect}
                        onAdd={this.props.onAdd}
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
