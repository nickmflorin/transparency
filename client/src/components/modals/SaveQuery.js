import React from 'react';
import PropTypes from 'prop-types';
import CustomModal from './CustomModal'

export class SaveQueryModal extends React.Component {
	constructor(props, context){
		super(props, context)
	}
	static propTypes = {
	     query: PropTypes.object,
	     saveNewQuery: PropTypes.func.isRequired,
	     onClose: PropTypes.func.isRequired,
	     show: PropTypes.bool.isRequired,
	     afterSave: PropTypes.func.isRequired,
	     user: PropTypes.object.isRequired,
	     errors: PropTypes.object.isRequired,
	};
	finish(){
		var name = this.refs.queryname.value 
		var sql = this.props.query.sql 
		this.props.saveNewQuery(name)
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
	          error={this.props.errors.create}
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


