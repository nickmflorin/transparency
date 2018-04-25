import React from 'react';
import PropTypes from 'prop-types';
import CustomModal from './CustomModal'

export class SaveQueryModal extends React.Component {
	constructor(props, context){
		super(props, context)
	}
	static propTypes = {
	     query: PropTypes.object,
	     error: PropTypes.string,
	     onSubmit: PropTypes.func.isRequired,
	     onClose: PropTypes.func.isRequired,
	     show: PropTypes.bool.isRequired,
	     user: PropTypes.object.isRequired,
	};
	onSubmit(){
		var name = this.refs.queryname.value 
		this.props.onSubmit({name : name})		
	}
	render(){

		var notification = null, subnotification = null;
		if(this.props.query){
			if(this.props.user.id != this.props.query.user.id){
				notification = "Cannot overwrite query created by " + this.props.query.user.username + "..."
				subnotification = "Must save the query as another name."
			}
		}

		return (
		    <CustomModal
		      title={this.props.overwrite ? "Save As Query" : "Save Query"}
	          show={this.props.show}
	          error={this.props.error}
	          notification={notification}
	          subnotification={subnotification}
	          onClose={this.props.onClose}
	          finishButtonName={this.props.overwrite ? "Save As" : "Save"}
	          onSubmit={this.onSubmit.bind(this)}
	        >
	          	<form>
	              <div className="modal-input-group">
	                  <label>Query Name:</label>
	                  <input name="name" type="text" ref="queryname" placeholder="Create a name for your query"></input>
	                  <p className='help'>e.g. Recent Manager Performance</p>
	              </div>
	            </form>
	        </CustomModal>
		)
	}
}


