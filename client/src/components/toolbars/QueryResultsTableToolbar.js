import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload'

import { ButtonToolbar } from 'react-bootstrap';
import { ToolbarCheckableDropdown } from '../dropdowns'
import { ToolbarButton, ToolbarRadioButtons } from '../inputs'

export class QueryResultsTableToolbar extends React.Component {
	constructor(props, context) {
    	super(props, context)
    	this.state = {
    		download_type : 'selected'
    	}
  	}
  	static propTypes = {
		onDownload: PropTypes.func.isRequired,
		toggle: PropTypes.func.isRequired,
		columns: PropTypes.array.isRequired,
	};
	onChange(e, id, option, isChecked){
		this.setState({ download_type : option })
	}
	render(){
		const items = [
			{ id : 'all', label : 'All Fields'},
			{ id : 'selected', label : 'Filtered Fields'}
		]
		var item = _.findWhere(items, { id : this.state.download_type})
		item.checked = true;

	    return (
	        <ButtonToolbar className="base-toolbar">
		      	<ButtonToolbar>
		      		<ToolbarCheckableDropdown
		      			id="columns"
		      			label="Columns" 
		      			style="primary"
		            	onClick={this.props.toggle} 
		            	items={this.props.columns}
		            	flush={true} 
		      		/>
				</ButtonToolbar>

				<ButtonToolbar className="btn-toolbar-extra">
					<div className="toolbar-item-group">
						<ToolbarRadioButtons 
							id='download-type'
							onChange={this.onChange.bind(this)}
							items={items}
						/>
					</div>
					<div className="toolbar-item-group-extra">
						<ToolbarButton 
			            	label="Download" 
			            	icon={faDownload}  
			            	onClick={(e) => this.props.onDownload(this.state.download_type)} 
			            	flush={true} 
			            />
		            </div>
				</ButtonToolbar>
			</ButtonToolbar>
		)
	 }
}