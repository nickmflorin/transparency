import React from 'react';
import PropTypes from 'prop-types';
import CustomModal from './CustomModal'
import store from '../../store'
import { Types } from '../../store/db'

export class SaveQueryModal extends React.Component {
	constructor(props, context){
		super(props, context)
		this.state = {
			error : null, 
			warning : null
		}
	}
	static propTypes = {
	     query: PropTypes.object,
	     saveNewQuery: PropTypes.func.isRequired,
	     onClose: PropTypes.func.isRequired,
	     show: PropTypes.bool.isRequired,
	     afterSave: PropTypes.func.isRequired,
	     user: PropTypes.object.isRequired,
	};
	validate(){
		var name = this.refs.queryname.value 
		if(!name || String(name).trim() == ""){
			this.setState({ error : 'Must Enter a Query Name to Save' })
			return false 
		}
		if(!this.props.query){
			throw new Error('Query Reference Object Missing from Modal')
		}
		const value = this.props.query.sql
		if(!value && value.trim() == ""){
			this.setState({ error : 'Cannot Save a Blank Query' })
			return false 
		}
		return true 
	}
	finish(){
		var self = this 
		self.setState({ error : null })

		const valid = this.validate()
		if(valid){
			var name = this.refs.queryname.value 
			this.props.saveNewQuery(name).then((action) => {
				if (action.type != Types.query.save.success) {
					self.setState({ error : action.error })
				}
	            else{
	            	self.props.onClose()
	            	self.props.afterSave()
	            }
			})
		}		
	}
	render(){
		var notification = null, subnotification = null;
		if(this.props.query && this.props.overwrite === false){
			if(this.props.user.id != this.props.query.user.id){
				notification = "Cannot overwrite query created by " + this.props.query.user.username + "..."
				subnotification = "Must save the query as another name."
			}
		}
		return (
		    <CustomModal
		      title={this.props.overwrite ? "Save As Query" : "Save Query"}
	          show={this.props.show}
	          error={this.state.error}
	          warning={this.state.warning}
	          notification={notification}
	          subnotification={subnotification}
	          onClose={this.props.onClose}
	          finishButtonName={this.props.overwrite ? "Save As" : "Save"}
	          finish={this.finish.bind(this)}
	        >
	          	<form>
	              <div className="modal-input-group">
	                  <label>Query Name:</label>
	                  <input name="name" type="text" ref="queryname" placeholder="Create a name for your query"></input>
	                  <p className='detail'>e.g. Recent Manager Performance</p>
	              </div>
	            </form>
	        </CustomModal>
		)
	}
}


