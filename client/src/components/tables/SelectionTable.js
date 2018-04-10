import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'
import _ from 'underscore'

import ReactTable from "react-table";
import "react-table/react-table.css";

import { SelectionTableToolbar } from '../toolbars'
import './selection_table.css'

export class SelectionTable extends React.Component {
	constructor(props, context){
		super(props, context)
		var display = props.display 
		if(props.display){
			display = props.selections[0].id 
		}

		var active = _.findWhere(props.selections, { id : display })
		if(!active){
			throw new Error('Invalid Display Provided')
		}
		this.state = {
			display : display,
			active : active,
			filtered : null,
		}
	}
	static propTypes = {
      selections: PropTypes.array.isRequired,
      selected: PropTypes.object,
      selectedLabel: PropTypes.string,
  }
  onSelect(id, toolbarId, object){
    this.setState({ display : toolbarId })
    const active = _.findWhere(this.props.selections, { id : toolbarId })
    if(!active){
    	throw new Error('Invalid Display')
    }
    const selector = _.findWhere(active.dropdown.items, { id : id })
    if(!selector){
    	throw new Error('Invalid Selection ID')
    }
    if(selector.filter){
    	var filtered = selector.filter(active.data)
    	this.setState({ filtered : filtered })
    }
    else{
    	this.setState({ filtered : null })
    }
    if(selector.onSelect){
   		selector.onSelect(id, object)
   	}
  }
  render(){
  		const active = _.findWhere(this.props.selections, { id : this.state.display })
  		if(!active){
  			throw new Error('Invalid Display')
  		}
  		var data = active.data 
  		if(this.state.filtered){
  			data = this.state.filtered 
  		}
	    return (
	         <div className="selection-table-container">
			    <SelectionTableToolbar 
			    	onSelect={this.onSelect.bind(this)}
		            {...this.props}
		        />
				<ReactTable
			          data={data}
			          columns={active.columns}
			          minRows={25}
			          loadingText={active.loadingText || 'Loading Results...'}
					  noDataText={active.noDataText || "No Data Found"}
			          defaultPageSize={15}
			          className="-striped -highlight react-table-condensed"
			          defaultPageSize={20}
				/>
			</div>
	   )
 	}
}
