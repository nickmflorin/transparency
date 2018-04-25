import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'underscore'

import SweetAlert from 'sweetalert2-react';
import { SelectionTable } from '../../../components/tables'
import { ListTableColumns } from './SelectionTableConfig'
import Actions from '../../../actions'

class ListSelection extends React.Component {
  constructor(props, context){
    super(props, context)
    this.state = {
        database : null,
        confirm_delete : false,
        to_delete : null,
    }
  }
  componentWillMount() {
      this.props.getLists()
  }
  onDelete(id){
      this.setState({ confirm_delete : true, to_delete : id })
  }
  deleteConfirmed(){
    const to_delete = this.state.to_delete 
    if(!to_delete){
      throw new Error('Delete ID Not Stored in State')
    }
    this.setState({ to_delete : null, confirm_delete : false })
    this.props.removeList(to_delete)
  }
  deleteCancelled(){
    this.setState({ to_delete : null, confirm_delete : false })
  }
  render(){
    var user = this.props.user 
    if(!user){
      throw new Error('User Not Present')
    }
    
    const lists = this.props.lists || []

    return (  
      <div className="list-table-container">
        <SweetAlert
          show={this.state.confirm_delete}
          title="Warning"
          type='warning'
          text="Are you sure you would like to delete this list?"
          showCancelButton={true}
          showConfirmButton={true}
          reverseButtons={true}
          onConfirm={this.deleteConfirmed.bind(this)}
          onCancel={this.deleteCancelled.bind(this)}
        />
        <SelectionTable 
          display="lists"
          selectedLabel="Opened List"
          selected={this.props.list}
          active={(this.props.list && this.props.list.id)}
          defaultPageSize={10}
          minRows={13}
          selections = {[
            {
              id : 'queries',
              noDataText : "No Saved Lists",
              loadingText : "Loading Lists...",
              data : lists,
              columns : ListTableColumns({
                user : this.props.user,
                onOpen : this.props.openList,
                onDelete : this.onDelete.bind(this),
              }),
              dropdown : {
                label : 'Saved Lists',
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
            }
          ]}
        />
      </div>
    )
  }
}

const DataStateToProps = (state, ownProps) => {  
  return {
    lists : state.lists.lists, 
    list : state.lists.list,
    user : state.auth.user,
  };
};

const DataDispatchToProps = (dispatch, ownProps) => {
  return {
    openList: (id, options) =>  dispatch(Actions.list.get(id, options)),
    getLists: () =>  dispatch(Actions.lists.get()),
    removeList : (id) => dispatch(Actions.list.remove(id))
  }
};

export default connect(DataStateToProps, DataDispatchToProps)(ListSelection);  
