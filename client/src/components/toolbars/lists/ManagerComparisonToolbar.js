import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSave from '@fortawesome/fontawesome-free-regular/faSave'
import faFile from '@fortawesome/fontawesome-free-regular/faFile'
import faEraser from '@fortawesome/fontawesome-free-solid/faEraser'
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload'

import { ButtonToolbar, FormGroup, FormControl, ControlLabel, Input, Checkbox } from 'react-bootstrap';
import { ToolbarDropdown, ToolbarCheckableDropdown } from '../../dropdowns'
import { ToolbarButton, ToolbarRadioButtons } from '../../inputs'

const group_stats = function(stats){
	var grouped = []
	_.each(stats, function(stat){
		if(stat.group_id){
			var group = _.findWhere(grouped, { id : stat.group_id })
			if(!group){
				group = { id : stat.group_id, label : stat.group_label, children : [] }
				group.children.push(stat)
				grouped.push(group)
			}
			else{
				group.children.push(stat)
			}
		}
		else{
			grouped.push(stat)
		}
	})
	return grouped
}

export class ManagerComparisonToolbar extends React.Component {
	constructor(props, context) {
        super(props, context)
        this.state = {
        	download_type : 'selected'
        }
    }
    static propTypes = {
      onStatChange: PropTypes.func.isRequired,
      onDownload: PropTypes.func.isRequired,
      onSave: PropTypes.func.isRequired,
      onSaveAs: PropTypes.func.isRequired,
      onNew: PropTypes.func.isRequired,
      clearManagerList: PropTypes.func.isRequired,
      getManagerList: PropTypes.func.isRequired,
      stats: PropTypes.array.isRequired,
      lists: PropTypes.array.isRequired,
      dates: PropTypes.object.isRequired,
  	};
  	// Use List ID to Reget List from API Instead of Loading Managers from Object Just in Case in Future
  	// List Info Populated in Dropdown is Not Complete (i.e. Just Name and ID)
  	onSelect(id, toolbarId, object){
  		if(toolbarId == 'lists'){
  			this.props.getManagerList(id, { complete : true, 
  				start_date : this.props.dates.start,
            	end_date : this.props.dates.end,
  			})
  		}
  	}
  	onDownloadOptionChange(e, id, option, isChecked){
		this.setState({ download_type : option })
	}
	render(){
		const stats = group_stats(this.props.stats)

		const download_options = [
			{ id : 'all', label : 'All Fields'},
			{ id : 'selected', label : 'Filtered Fields'}
		]
		var item = _.findWhere(download_options, { id : this.state.download_type})
		item.checked = true;

		var disabled = true;
		if(this.props.list){
			if(this.props.list.managers.length != 0){
				disabled = false;
			}
		}
	    return (
	        <ButtonToolbar className="base-toolbar">
	        	<ButtonToolbar>
	        		<div className="toolbar-item-group">
						<ToolbarCheckableDropdown 
			          		id="stats" 
			          		key='stats' 
			          		label='Table Statistics' 
			          		flush={true} 
			          		style='primary' 
			          		onClick={this.props.onStatChange}
			          		items={stats}
				         />
				     </div>
				     <div className="toolbar-item-group">
						<ToolbarDropdown 
			          		id="lists" 
			          		key='lists' 
			          		label='Saved Lists' 
			          		flush={true} 
			          		style='default' 
			          		active={this.props.list}
			          		items={this.props.lists || []} 
			          		onSelect={this.onSelect.bind(this)}
				         />
			         </div>
			    </ButtonToolbar>

			    <ButtonToolbar className="flex-grow flex-center">
			         {this.props.list && 
			         	  <div className="toolbar-item-group">
					         <div className="toolbar-text-container">
					          	  <p className="toolbar-label"> List :  </p>
					              <p className="toolbar-text">{this.props.list.name}</p>
					         </div>	
					         {this.props.list.user && 
					          	    <div className="toolbar-text-container">
						          	     <p className="toolbar-label"> Owner :  </p>
						                 <p className="toolbar-text">{this.props.list.user.username}</p>
						             </div>	
					         }
					         <div className="toolbar-item-group">
								<ToolbarButton 
									disabled={disabled}
									label="Save" 
									icon={faSave}  
									onClick={this.props.onSave} 
									flush={true}
								/>
							</div>
							<div className="toolbar-item-group">
								<ToolbarButton 
									disabled={disabled}
									label="Save As" 
									icon={faSave}  
									onClick={this.props.onSaveAs} 
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

				<ButtonToolbar>
					<div className="toolbar-item-group" style={{marginRight:15}}>
						<ToolbarRadioButtons 
							id='download-type'
							onChange={this.onDownloadOptionChange.bind(this)}
							items={download_options}
						/>
					</div>
					<div className="toolbar-item-group">
						<ToolbarButton 
							id="download"
							label="CSV" 
							icon={faDownload}  
							disabled={disabled}
							onClick={(e) => this.props.onDownload(this.state.download_type)} 
							flush={true}
						/>
					</div>
					<div className="toolbar-item-group">
						<ToolbarButton 
							id="clear"
							label="Clear" 
							icon={faEraser}  
							disabled={disabled}
							onClick={this.props.clearManagerList} 
							flush={true}
						/>
					</div>
				</ButtonToolbar>
			</ButtonToolbar>
	    )
	}
}

export default ManagerComparisonToolbar;