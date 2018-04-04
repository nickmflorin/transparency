import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'underscore'

import { QueryTableToolbar } from '../../components/toolbars'
import { QueryTable } from '../../components/tables'

import { user, Actions, Api } from '../../store'

class QuerySelection extends React.Component {
  constructor(props, context){
    super(props, context)
    this.state = {
        database : null,
        display : 'tables',
        query_display : 'personal',
    }
  }
  static propTypes = {
      openTableQuery: PropTypes.func.isRequired,
      openQuery: PropTypes.func.isRequired,
      removeQuery: PropTypes.func.isRequired,
      getDatabases: PropTypes.func.isRequired,
      getQueries: PropTypes.func.isRequired,
  };
  componentWillMount() {
      this.props.getDatabases()
      this.props.getQueries()
  }
  componentWillReceiveProps(props){
    // Set Default Database if Not Specified
    if(props.databases && props.databases.length != 0){
        if(!this.state.database){
          const defaultDB = props.databases[0]
          this.setState({ database : defaultDB })
        }
    }
  }
  onDatabaseSelect(id, toolbarId, database){
    this.setState({ 
      database : database, 
      display : 'tables'
    })
  }
  onQuerySelect(id, toolbarId, query){
    this.setState({
      query_display : id,
      display : 'saved'
    })
  }
  render(){
    var user = this.props.user 
    if(!user){
      throw new Error('User Not Present')
    }

    var queries = this.props.queries 
    if(this.state.query_display == 'personal'){
      queries = _.filter(queries, function(que){
          return que.user.id == user.id
      })
    }

    var tables = []
    if(this.state.database){
      tables = this.state.database.tables
    }

    var query_options = [
      {id : 'all', name : 'All'},
      {id : 'personal', name : user.username}
    ]

    return (  
      <div className="query-table-container">
         <QueryTableToolbar 
            database={this.state.database} 
            databases={this.props.databases} 
            onDatabaseSelect={this.onDatabaseSelect.bind(this)} 
            onQuerySelect={this.onQuerySelect.bind(this)} 
            query_options={query_options} 
         />
         <div className="query-table-table-container">
            <QueryTable 
                database={this.state.database} 
                tables={tables}
                displayQueries={queries}
                displayTables={tables}
                display={this.state.display}
                removeQuery={this.props.removeQuery}
                openTableQuery={this.props.openTableQuery}
                openQuery={this.props.openQuery}
                user={this.props.user}
            />
          </div>
        </div>
    )
  }
}


const DataStateToProps = (state, ownProps) => {  
  return {
    query : state.db.query,
    user : user(state),
    databases : state.db.databases,
    queries : state.db.queries,
  };
};

const DataDispatchToProps = (dispatch, ownProps) => {
  return {
    getDatabases: () =>  dispatch(Actions.databases.getDatabases()),
    getQueries : () => dispatch(Actions.query.getQueries()),
    createTempQuery : () => dispatch(Actions.query.createTempQuery()),
    removeQuery : (id) => dispatch(Actions.query.removeQuery(id)),
    openQuery : (id, options) => dispatch(Actions.query.openQuery(id, options)),
    openTableQuery : (id, options) => dispatch(Actions.query.openTableQuery(id, options)),
  }
};

export default connect(DataStateToProps, DataDispatchToProps)(QuerySelection);  
