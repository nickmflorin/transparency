import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import SearchResult from './result'
import './search.css'

class SearchResults extends React.Component{
  render(){
    return (
      <div className='scroll-search-results-container'>
        <div className='search-results-container'>
            <div className="search-list-group">
              {this.props.results.map((result) => {
                  return (
                    <SearchResult
                        key={result.id} 
                        result={result}
                        {...this.props}
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

const mapStateToProps = (state, ownProps) => {  
  return {
    managers: state.managers,
  };
};

export default connect(mapStateToProps)(SearchResults);  
