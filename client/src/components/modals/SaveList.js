import React from 'react';
import CustomModal from './CustomModal'
import PropTypes from 'prop-types';
import _ from 'underscore'

export class SaveListModal extends React.Component {
	constructor(props, context){
		super(props, context)
		this.state = {
			warning : null
		}
	}
	static propTypes = {
		 onClose: PropTypes.func.isRequired,
		 errors: PropTypes.object.isRequired,
		 successes: PropTypes.object.isRequired,
		 show: PropTypes.bool.isRequired,
		 list: PropTypes.object,
		 user: PropTypes.object.isRequired,
		 saveNewManagerList: PropTypes.func.isRequired,
	};
	validate(){
		var name = this.refs.listname.value 
		if(!name || String(name).trim() == ""){
			this.setState({ error : 'Must Enter a Name to Save' })
			return false 
		}
		var list = this.props.list 
		if(!this.props.list || this.props.list.managers.length == 0){
			this.setState({ error : 'Cannot Save Empty or Missing List' })
			return false 
		}
		return true 
	}
	finish(){
		this.setState({ error : null })
		const valid = this.validate()
		if(valid){
			var name = this.refs.listname.value 
			this.props.saveNewManagerList(name)			
			// this.props.saveNewManagerList(name).then((action) => {
			// 	if (action.type != Types.list.new.success) {
			// 		self.setState({ error : action.error })
			// 	}
	  //           else{
	  //           	self.props.onClose()
	  //           }
			// })
		}
	}
	render(){
		var notification = null, subnotification = null;
		if(this.props.list){
			if(this.props.user.id != this.props.list.user.id){
				notification = "Cannot overwrite list created by " + this.props.list.user.username + "..."
				subnotification = "Must save the list as another name."
			}
		}
		
		var error = null;
		if(this.props.errors && this.props.errors.save){
			error = this.props.errors.save
		}

		return (
			<CustomModal
			  title="Save Manager List"
			  show={this.props.show}
			  error={error}
			  notification={notification}
			  subnotification={subnotification}
			  warning={this.state.warning}
			  onClose={this.props.onClose}
			  finishButtonName="Save"
			  finish={this.finish.bind(this)}
			>
				<form>
				  <div className="modal-input-group">
					  <label>List Name:</label>
					  <input name="name" type="text" ref="listname" placeholder="Create a name for this list"></input>
					  <p className='detail'>e.g. My New Manager List</p>
				  </div>
				</form>
			</CustomModal>
		)
	}
}

