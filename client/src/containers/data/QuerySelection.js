import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'underscore'

import SweetAlert from 'sweetalert2-react';
import { SelectionTable } from '../../components/tables'
import { TablesQueryTableColumns, SavedQueryTableColumns } from './SelectionTableConfig'
import Actions from '../../actions'

class QuerySelection extends React.Component {
  constructor(props, context){
    super(props, context)
    this.state = {
        database : null,
        confirm_delete : false,
        to_delete : null,
    }
  }
  componentWillMount() {
      this.props.getDatabases()
      this.props.getQueries()
  }
  onDelete(id){
      this.setState({ confirm_delete : true, to_delete : id })
  }
  onDatabaseSelect(id, database){
    this.props.openDatabase(database)
  }
  deleteConfirmed(){
    const to_delete = this.state.to_delete 
    if(!to_delete){
      throw new Error('Delete ID Not Stored in State')
    }
    this.setState({ to_delete : null, confirm_delete : false })
    this.props.removeQuery(to_delete)
  }
  deleteCancelled(){
    this.setState({ to_delete : null, confirm_delete : false })
  }
  render(){
    var user = this.props.user 
    if(!user){
      throw new Error('User Not Present')
    }
    var tables = []
    if(this.props.database){
      tables = this.props.database.tables
    }

    var self = this 
    return (  
      <div className="query-table-container">
        <SweetAlert
          show={this.state.confirm_delete}
          title="Warning"
          type='warning'
          text="Are you sure you would like to delete this query?"
          showCancelButton={true}
          showConfirmButton={true}
          reverseButtons={true}
          onConfirm={this.deleteConfirmed.bind(this)}
          onCancel={this.deleteCancelled.bind(this)}
        />
        <SelectionTable 
          display="databases"
          selectedLabel="Database"
          selected={this.props.database}
          selections = {[
            {
              id : 'queries',
              noDataText : "No Saved Queries",
              loadingText : "Loading Queries...",
              data : this.props.queries || [],
              columns : SavedQueryTableColumns({
                ...self.props,
                onDelete : self.onDelete.bind(self),
              }),
              dropdown : {
                label : 'Saved Queries',
                style : 'primary',
                items : [
                    {id : 'all', name : 'All'},
                    {id : 'personal', name : user.username,
                      filter : function(items){
                        return _.filter(items, (item) => {
                          return item.user.id == user.id
                        })
                    },
                  }
                ],
              },
            },
            {
              id : 'databases',
              noDataText : "No Tables Found",
              loadingText : "Loading Tables...",
              columns : TablesQueryTableColumns({
                ...self.props,
              }),
              data : tables,
              dropdown : {
                label : 'Databases',
                style : 'default',
                items : this.props.databases.map((database) => {
                  return {
                    ...database,
                    onSelect : this.onDatabaseSelect.bind(this)
                  }
                }),
              },
            }
          ]}
        />
      </div>
    )
  }
}

const DataStateToProps = (state, ownProps) => {  
  return {
    query : state.db.query,
    user : state.auth.user,
    databases : state.db.databases,
    database : state.db.database,
    queries : state.db.queries,
  };
};

const DataDispatchToProps = (dispatch, ownProps) => {
  return {
    getDatabases: () => dispatch(Actions.databases.get()),
    openDatabase: (database) => dispatch(Actions.database.open(database)),
    getQueries : () => dispatch(Actions.queries.get()),
    createTempQuery : () => dispatch(Actions.query.temp()),
    removeQuery : (id) => dispatch(Actions.query.remove(id)),
    openQuery : (id, options) => dispatch(Actions.query.open(id, options)),
    openTableQuery : (id, options) => dispatch(Actions.query.openTable(id, options)),
  }
};

export default connect(DataStateToProps, DataDispatchToProps)(QuerySelection);  
