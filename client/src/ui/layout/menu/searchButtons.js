import React from 'react';
import './search.css'

class ManagerAddButton extends React.Component {
	// Have to Externalize On Click to Also Clear Search Results
	onClick(event){
		this.props.clear()
		this.props.onClick(event, this.props.result)
	}
	render(){
		return (
			<a className='search-link search-link-add-on' key={this.props.id} onClick={this.onClick.bind(this)}>
		      {this.props.label}
		    </a>
		)
	}
}
export default ManagerAddButton;