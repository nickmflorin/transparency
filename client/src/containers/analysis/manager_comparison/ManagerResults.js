import React from 'react';  
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import _ from 'underscore'
import moment from 'moment'

import SweetAlert from 'sweetalert2-react';

import { DateRangeToolbar, ManagerComparisonToolbar } from '../../../components/toolbars'
import { SaveListModal } from '../../../components/modals'
import { CustomReactTable } from "../../../components/tables";
import Actions from '../../../actions'

class ManagerResults extends React.Component {
  constructor(props, context){
    super(props, context)
    this.state = {
      confirm_save : false,
      save_error : null,
      save_as_error : null,
      modalIsOpen : false,
    }
  }
  toggleModal(){
    this.setState({modalIsOpen: !this.state.modalIsOpen});
  }
  removeManager(id){
    this.props.removeManager(id)
    this.props.findAnotherActiveManager(id)
  }
  onDownload(download_type){
    var columns = null;
    if(download_type != 'selected'){
      columns = this.props.stats.map( (stat) => {
          return {
            id : stat.id,
            Header: stat.label,
            accessor: stat.accessor,
          }
      })
    }
    this.refs['comparison-table'].download(columns)
  }
  onSave(){
    var self = this 

    const user = this.props.user
    if (!user){
      throw new Error('User Must be Present')
    }
    if(this.props.list){
      if (this.props.list.id == 'new') {
        this.setState({ modalIsOpen: true })
      }
      else{
        if (this.props.list.user.id == user.id) {
          this.props.dispatch(Actions.list.save_Async()).then(function(action, error){
            if(action.error){
              self.setState({ save_error : action.error })
            }
            else{
              self.setState({ confirm_save : true })
            }
          })
        }
        else{
          self.setState({ modalIsOpen: true })
        }
      }
    }
    return
  }
  onSaveAs(){
      const user = this.props.user
      if(!user){
        throw new Error('User Must be Present')
      }
      if(this.props.list){
        this.setState({ modalIsOpen: true })
      }
  }
  onModalSubmit(data){
    var self = this 
    this.props.dispatch(Actions.list.saveNew_Async(data.name)).then(function(action, error){
      if(action.error){
        self.setState({save_as_error : action.error})
      }
      else{
        self.setState({ modalIsOpen: false, save_as_error : null })
      }
    })
  }
  // Active Manager Selected from Comparison Table Has Sliced Returns, Want to Get Main Manager with All Returns
  // Have to Get Full Manager from API
  setActiveManager(manager){
    this.props.getManager(manager.id)
  }
  render() {

    const managers = this.props.list ? this.props.list.managers : []
    const numeric = _.filter(this.props.stats, function(stat){
      return stat.type == 'numeric' 
    })

    var self = this 
    const enabled = _.filter(this.props.stats, ( stat ) => stat.enabled === true)
    var columns = enabled.map( (stat) => {
        return {
          id : stat.id,
          Header: stat.label,
          accessor: stat.accessor,
        }
    })
    
    columns.push({
      Header : "Remove", 
      id: "remove", 
      type : 'action',
      Cell: function(row){
        return(
          <a 
            className='table-link manager-comparison-remove-link' 
            id="remove" 
            onClick={(e) => self.removeManager(row.original.id)}> 
            Remove 
          </a>
        )
      }
    })

    var show_error_alert = false;
    if(this.state.save_error){
      show_error_alert = true 
    }
    var active_id = null;
    if(this.props.active){
      active_id = this.props.active.id 
    }

    return (
      <div>
        <SweetAlert
          show={this.state.confirm_save}
          title="Saved"
          type='success'
          text="Your list was saved successfully."
          onConfirm={() => this.setState({ confirm_save : false })}
        />

        <SweetAlert
          show={show_error_alert}
          title="Error"
          type='error'
          text={this.state.save_error}
          onConfirm={() => this.setState({ error_save : false })}
        />

        <SaveListModal 
          list={this.props.list}
          user={this.props.user}
          show={this.state.modalIsOpen} 
          error={this.state.save_as_error}
          successes={this.props.successes}
          onClose={this.toggleModal.bind(this)}
          onSubmit={this.onModalSubmit.bind(this)}
        />

        <div style={{marginBottom:25, marginTop: 15}}>
          <DateRangeToolbar 
            dates={this.props.dates} 
            changeDate={this.props.changeDate} 
          />
        </div>
        
        <ManagerComparisonToolbar 
            stats={numeric} // Include All Stats
            onSave={this.onSave.bind(this)}
            onSaveAs={this.onSaveAs.bind(this)}
            onNew={this.props.createNewManagerList}
            onDownload={this.onDownload.bind(this)}
            {...this.props}
          />

          <CustomReactTable
            ref="comparison-table"
            data={managers}
            active={active_id}
            target={(this.props.list && this.props.list.name) || "untitled"}
            columns={columns}
            rowClicked={this.setActiveManager.bind(this)}
          />
      </div>
    )
  }
}

const StateToProps = (state, ownProps) => {  
  return {
    list : state.lists.list,
    user : state.auth.user,
    dates : state.dates,
  };
};

const DispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch : (action) => dispatch(action),
    createNewManagerList: () =>  dispatch(Actions.list.new()),

    changeDate : (changes) => dispatch(Actions.changeDate(changes)),
    getManager: (id) => dispatch(Actions.manager.get(id)),

    updateManagerListDates: (dates) => dispatch(Actions.list.updateDates(dates)),
    clearManagerList: () =>  dispatch(Actions.list.clear()),
    removeManager: (id) => dispatch(Actions.list.managers.remove(id)),
  }
};

export default connect(StateToProps, DispatchToProps)(ManagerResults);  

