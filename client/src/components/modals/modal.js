import {Modal, Button, closeButton} from 'react-bootstrap';
import React from 'react';

class CustomModal extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			'show' : false
		}
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
		          	{this.props.content}
		          	{this.props.error && 
				        <div className="error">
				        	{this.props.error}
				        </div>
				    }
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