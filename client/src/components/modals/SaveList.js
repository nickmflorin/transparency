import React from 'react';
import { connect } from 'react-redux'
import _ from 'underscore'

import CustomModal from './modal'
import { apiSaveManagerList } from '../../api'

var qs = require('qs');

export class SaveListModal extends React.Component {
	constructor(props, context){
		super(props, context)
		this.state = {
			error : null
		}
	}
	finish(){
		var name = this.refs.listname.value 
		if(!name || String(name).trim() == ""){
			console.log('Must Enter a Name to Save')
			return
		}
		var managers = this.props.managers 
		if(!managers || managers.length == 0){
			console.log('Cannot Save Empty or Missing List')
			return
		}
		var ids = _.pluck(managers, 'id')

		apiSaveManagerList(ids, name).then(response => {
            if(response.error){
                console.log('Error Saving Manager List')
                this.setState({ error : response.error })
            }
            else{
            	this.props.onClose()
                this.props.addManagerList(response)
            }
        }).catch(error => {
            throw (error);
        });
	}
	render(){
		return (
		    <CustomModal
		      title="Save Manager List"
	          show={this.props.show}
	          error={this.state.error}
	          onClose={this.props.onClose}
	          finishButtonName="Save"
	          finish={this.finish.bind(this)}
	          content={
	            <form id='new-client-form'>
                  <div className="modal-input-group-vertical">
                      <label>List Name:</label>
                      <input name="name" type="text" ref="listname" placeholder="Create a name for this list"></input>
                      <p className='detail'>e.g. My New Manager List</p>
                  </div>
                </form>
	          }
	        />
		)
	}
}

export default SaveListModal;