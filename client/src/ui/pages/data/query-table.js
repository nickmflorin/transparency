import React from 'react';
import { DropdownButton, ButtonToolbar, MenuItem } from 'react-bootstrap';
import ReactTable from "react-table";
import "react-table/react-table.css";

class SavedQueryDropdown extends React.Component {
  render(){
    return(
      <DropdownButton
      	className="query-table-dropdown-button"
        bsStyle={this.props.style}
        title={this.props.title}
        key={this.props.id}
        id={`database-dropdown-${this.props.id}`}
      >
      {this.props.saved.map((savedQuery) => {
          return <MenuItem key={savedQuery.id} eventKey="1">savedQuery.name</MenuItem>
      })}
      </DropdownButton>
    )
  }
}

class QueryTableDropdown extends React.Component {
  render(){
    return(
      <DropdownButton
      	className="query-table-dropdown-button"
        bsStyle={this.props.style}
        title={this.props.title}
        key={this.props.id}
        id={`database-dropdown-${this.props.id}`}
      >
      {this.props.databases.map((database) => {
          return <MenuItem key={database.id} eventKey="1" onSelect={ (e) => this.props.databaseSelected(e, database) }>{database.name}</MenuItem>
      })}
      </DropdownButton>
    )
  }
}

class QueryTableMenu extends React.Component {
  render(){
    return (
      <div className="query-table-menu-container">
        <ButtonToolbar>
          <SavedQueryDropdown id="saved" key='saved' title='Saved Queries' style='default' saved={this.props.saved || []}/>
          <QueryTableDropdown id="structure" key='structure' title='Database Structure' style='primary' databases={this.props.databases || []} databaseSelected={this.props.databaseSelected} />
        </ButtonToolbar>
      </div>
    )
  }
}

class QueryTable extends React.Component {
	tdProps(state, rowInfo, column){
		var props = {style : {}}
		if(column.id == 'show' || column.id == 'type'){
			props.style.textAlign = 'center'
      	}
      	return props
	}
  	render(){
	    return (
	      <div className="data-right-col">
	      	  <div className="query-table-menu-container">
		      	<QueryTableMenu database={this.props.database} databases={this.props.databases || []} saved={this.props.saved || []} databaseSelected={this.props.databaseSelected}/>
		      </div>
		      <ReactTable
		          data={this.props.tables}
		          columns={[
		          	{ Header: "Table Name", id : "name",
		          		accessor: function(d){
		          			return d.db + '.' + d.handle + '.' + d.name
		          		}
		          	},
			        { Header: "Type", id: "type", accessor: "type"},
			        { Header : "Show", id: "show", 
			        	Cell: row => (
			        	  <a className='table-link' onClick={(e) => this.props.showTop5(e, row.row._original)}> Show Top 5 Rows </a>
			        	)
			    	}
		          ]}
		          defaultPageSize={20}
		          className="-striped -highlight"
		          getTdProps={this.tdProps}
		      />
		  </div>
	    )
 	}
}

export default QueryTable;