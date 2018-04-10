import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'

const ResultLimit = 200

export const TablesQueryTableColumns = function(props){
	return [
		{ Header: "Table Name", id : "name",
			accessor: function(d){
				return d.db + '.' + d.handle + '.' + d.name
			}
	  	},
	    { Header: "Type", id: "type", accessor: "type"},
	    { Header : "Open", id: "open", 
	    	Cell: row => (
	    	  <a className='table-link' onClick={
	    	  	(e) => props.openTableQuery(
	    	  		row.row._original
	    	  	)}
	    	  > 
	    	  Open 
	    	  </a>
	    	)
		},
	    { Header : "Preview", id: "run", 
	    	Cell: row => (
	    	  <a className='table-link' onClick={
	    	  	(e) => props.openTableQuery(
	    	  		row.row._original,
	    	  		{ run : true, limit : 5 }
	    	  	)}
	    	  > 
	    	  Preview 
	    	  </a>
	    	)
		}
	]
}

export const SavedQueryTableColumns = function(props){
	return [
		{ Header: "Name", id : "name",
	  		accessor: function(datum){
	  			return datum.name
	  		}
	  	},
	    { Header: "Created By", id: "user", 
	    	accessor: function(datum){
	    		if(datum.user && datum.user.username){
	    			return datum.user.username
	    		}
	  		}
	  	},
	    { Header: "Created At", id: "createdAt", 
			accessor: function(datum){
	    		if(datum.createdAt){
	    			var mmt = new moment(datum.createdAt)
	    			return mmt.format('YYYY-MM-DD')
	    		}
	  		}
	  	},
	  	{ Header : "Open", id: "open", 
	    	Cell: row => (
	    	  <a className='table-link' onClick={
	    	  	(e) => props.openQuery(
	    	  		row.row._original.id
	    	  	)}
	    	  > 
	    	  Open 
	    	  </a>
	    	)
		},
	    { Header : "Run", id: "run", 
	    	Cell: row => (
	    	  <a className='table-link' onClick={
	    	  	(e) => props.openQuery(
	    	  		row.row._original.id,
	    	  		{ run : true, limit : ResultLimit }
	    	  	)}
	    	  > 
	    	  Run 
	    	  </a>
	    	)
		},
		{ Header : "Remove", id: "remove", 
	    	Cell: function(row){
	    		if(row.original.user){
	    			if(row.original.user.id == props.user.id){
		    			return (
		    			   <a className='table-link' onClick={
					    	 	(e) => props.onDelete(
					    	 	 	row.original.id
						    	 )}> 
				    	  	 Remove 
		    	  	 		</a>
		    			)
		    		}
	    		}
	    	}
		}
	]
}

