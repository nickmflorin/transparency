import PropTypes from 'prop-types'
import {Modal, Button, closeButton} from 'react-bootstrap';
import { AlertControl } from '../alerts'
import React from 'react';

class CustomModal extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			'show' : false
		}
	}
	static propTypes = {
		title : PropTypes.string.isRequired,
		notification : PropTypes.string,
		subnotification : PropTypes.string,
		show : PropTypes.bool.isRequired,
		onClose : PropTypes.func.isRequired,
		finish : PropTypes.func.isRequired,
		finishButtonName : PropTypes.string.isRequired,
	}
	static defaultProps = {
		finishButtonName : 'Save'
	}
	componentWillReceiveProps(nextProps){
		this.setState({'show' : nextProps.show})
	}
	render(){
		return (
		    <Modal show={this.state.show} onHide={this.props.onClose}>
		        <Modal.Header closeButton>
		            <Modal.Title>{this.props.title}</Modal.Title>
		        </Modal.Header>

		        <Modal.Body>
		        	{this.props.notification &&
			        	<div className="modal-notification">
				        	{this.props.notification && 
				        		<p className="notification">
			        				{this.props.notification}
			        			</p>
				        	}
				        	{this.props.notification && this.props.subnotification && 
			        			<p className="sub-notification">
			        				{this.props.subnotification}
			        			</p>
			        		}
			        	</div>
			        }
		          	{this.props.children}
		          	<AlertControl warning={this.props.warning} error={this.props.error} />
		        </Modal.Body>

		        <Modal.Footer>
	            	<button className="btn btn-default" onClick={this.props.onClose}>Close</button>
	            	<button className="btn btn-primary" onClick={this.props.finish}>{this.props.finishButtonName}</button>
	          	</Modal.Footer>
	        </Modal>
		)
	}
}

export default CustomModal;