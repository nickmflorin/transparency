import React from 'react';
import PropTypes from 'prop-types';

import { ButtonToolbar } from 'react-bootstrap';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay'
import faEraser from '@fortawesome/fontawesome-free-solid/faEraser'
import faSave from '@fortawesome/fontawesome-free-solid/faSave'
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload'
import faFile from '@fortawesome/fontawesome-free-regular/faFile'

import { ToolbarButton } from '../inputs'

export class QueryFieldToolbar extends React.Component {
	constructor(props, context) {
		super(props, context)
  	}
	static propTypes = {
		run: PropTypes.func.isRequired,
		query: PropTypes.object,
		onNew: PropTypes.func.isRequired,
		onSave: PropTypes.func.isRequired,
		onSaveAs: PropTypes.func.isRequired,
		onExport: PropTypes.func.isRequired,
		saveDisabled: PropTypes.bool.isRequired,
	};
	render(){
		return (
			<ButtonToolbar>
				<div className="toolbar-item-group flex-grow">
					<div className="toolbar-item-group">
						<ToolbarButton label="Run" icon={faPlay}  onClick={this.props.run} flush={true} />
					</div>
					<div className="toolbar-item-group">
						<ToolbarButton label="Export" icon={faDownload}  onClick={this.props.onExport} flush={true} />
					</div>
				</div>
				{this.props.query && 
	         	  <div className="toolbar-item-group">
			         <div className="toolbar-text-container">
			          	  <p className="toolbar-label"> Query :  </p>
			              <p className="toolbar-text">{this.props.query.name}</p>
			         </div>	
			         {this.props.query.user && 
			          	    <div className="toolbar-text-container">
				          	     <p className="toolbar-label"> Owner :  </p>
				                 <p className="toolbar-text">{this.props.query.user.username}</p>
				             </div>	
			         }
					<div className="toolbar-item-group">
						<ToolbarButton 
							label="Save" 
							icon={faSave}  
							onClick={this.props.onSave} 
							disabled={this.props.saveDisabled}
							flush={true}
						/>
					</div>
					<div className="toolbar-item-group">
						<ToolbarButton 
							label="Save As" 
							icon={faSave}  
							onClick={this.props.onSaveAs} 
							disabled={this.props.saveDisabled}
							flush={true}
						/>
					</div>
					<div className="toolbar-item-group">
						<ToolbarButton 
							label="New" 
							icon={faFile}  
							onClick={this.props.onNew} 
							flush={true}
						/>
					</div>
				</div>
				}
			</ButtonToolbar>
		)
	}
}
