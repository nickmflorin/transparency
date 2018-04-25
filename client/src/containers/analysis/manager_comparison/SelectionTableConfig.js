import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'

export const ListTableColumns = function(props){
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
	  	{ Header: "Num Managers", id: "numManagers", 
			accessor: function(datum){
	    		if(datum.managers){
	    			return datum.managers.length
	    		}
	  		}
	  	},
	  	{ Header: "Last Updated", id: "updatedAt", 
			accessor: function(datum){
	    		if(datum.updatedAt){
	    			var mmt = new moment(datum.updatedAt)
	    			return mmt.format('YYYY-MM-DD h:mm a')
	    		}
	  		}
	  	},
	  	{ Header : "Open", id: "open", 
	    	Cell: row => (
	    	  <a className='table-link' onClick={
	    	  	(e) => props.onOpen(
	    	  		row.row._original.id
	    	  	)}
	    	  > 
	    	  Open 
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
