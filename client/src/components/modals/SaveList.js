import React from 'react';
import CustomModal from './CustomModal'
import PropTypes from 'prop-types';
import _ from 'underscore'

export class SaveListModal extends React.Component {
	static propTypes = {
		 onClose: PropTypes.func.isRequired,
		 onSubmit: PropTypes.func.isRequired,
		 error: PropTypes.string,
		 show: PropTypes.bool.isRequired,
		 list: PropTypes.object,
		 user: PropTypes.object.isRequired,
	};
	onSubmit(){
		var name = this.refs.listname.value 
		this.props.onSubmit({ name : name })			
	}
	render(){
		var notification = null, subnotification = null;
		if(this.props.list){
			if(this.props.user.id != this.props.list.user.id){
				notification = "Cannot overwrite list created by " + this.props.list.user.username + "..."
				subnotification = "Must save the list as another name."
			}
		}
		
		return (
			<CustomModal
			  title="Save Manager List"
			  show={this.props.show}
			  error={this.props.error}
			  notification={notification}
			  subnotification={subnotification}
			  onClose={this.props.onClose}
			  finishButtonName="Save"
			  onSubmit={this.onSubmit.bind(this)}
			>
				<form>
				  <div className="modal-input-group">
					  <label>List Name:</label>
					  <input name="name" type="text" ref="listname" placeholder="Create a name for this list"></input>
					  <p className='help'>e.g. My New Manager List</p>
				  </div>
				</form>
			</CustomModal>
		)
	}
}

