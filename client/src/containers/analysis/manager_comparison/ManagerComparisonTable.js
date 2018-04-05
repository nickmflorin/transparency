import React from 'react';  
import PropTypes from 'prop-types';

import _ from 'underscore'
import moment from 'moment'

import SweetAlert from 'sweetalert2-react';
import { Types } from '../../../store/lists'

import { DateRangeToolbar, ManagerComparisonToolbar } from '../../../components/toolbars'
import { SaveListModal } from '../../../components/modals'
import { DownloadTable } from "../../../components/tables";

class ManagerComparisonTable extends React.Component {
  constructor(props, context){
    super(props, context)
    this.state = {
      confirm_save : false,
      modalIsOpen : false,
    }
  }
  toggleModal(){
    this.setState({modalIsOpen: !this.state.modalIsOpen});
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
    const user = this.props.user
    if (!user) {
        throw new Error('User Must be Present')
    }

    if(this.props.list && this.props.list.managers.length != 0){
      if (this.props.list.id == 'new') {
          this.setState({ modalIsOpen: true })
      } else {
          if (this.props.list.user.id == user.id) {
              this.props.saveManagerList()
            }

          //     .then((action) => {
          //         if (action.type == Types.list.save.success) {
          //             this.setState({ confirm_save: true })
          //         } else {
          //             this.setState({ error_save: true })
          //         }
          //     })
          // } else {
          //     // Save As Situation
          //     this.setState({ modalIsOpen: true })
          // }
      }
    }
    return
  }
  onSaveAs(){
      const user = this.props.user
      if(!user){
        throw new Error('User Must be Present')
      }

      if(this.props.list && this.props.list.managers.length != 0){
        this.setState({ modalIsOpen: true })
      }
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
            onClick={(e) => self.props.removeManager(row.original.id)}> 
            Remove 
          </a>
        )
      }
    })

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
          show={this.state.error_save}
          title="Error"
          type='error'
          text="There was an error saving your list."
          onConfirm={() => this.setState({ error_save : false })}
        />

        <SaveListModal 
          list={this.props.list}
          user={this.props.user}
          show={this.state.modalIsOpen} 
          onClose={this.toggleModal.bind(this)}
          saveNewManagerList={this.props.saveNewManagerList}
        />

        <div style={{marginTop: 0, marginBottom: 30}}>
          <DateRangeToolbar 
            dates={this.props.dates} 
            changeDate={this.props.changeDate} 
          />
        </div>

        <ManagerComparisonToolbar 
            stats={numeric} // Include All Stats
            onSave={this.onSave.bind(this)}
            onSaveAs={this.onSaveAs.bind(this)}
            onNew={this.props.createTempManagerList}
            onDownload={this.onDownload.bind(this)}
            {...this.props}
          />

          <DownloadTable
            ref="comparison-table"
            data={managers}
            target={(this.props.list && this.props.list.name) || "untitled"}
            columns={columns}
            rowClicked={this.props.rowClicked}
          />
      </div>
    )
  }
}

export default ManagerComparisonTable;
