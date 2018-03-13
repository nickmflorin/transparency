import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import _ from 'underscore'

import ReactTable from "react-table";
import "react-table/react-table.css";

import Loading from '../../actions'
import ManagerListActions from '../../actions/lists'
import './ManagerComparisonTable.css'

export class ManagerComparisonTable extends React.Component {
  constructor(props, context){
    super(props, context)
  }
  static propTypes = {
      stat_config: PropTypes.object.isRequired,
  };
  tdProps(state, rowInfo, column){
    var props = {style : {}}
    if(column.id == 'show' || column.id != 'name'){
      props.style.textAlign = 'center'
    }
    return props
  }
  getColumns(){
      // Flatten Stats and Remove Disabled
      var nameStat = this.props.stat_config.find('name')
      var typeStat = this.props.stat_config.find('type')
      var stratStrat = this.props.stat_config.find('strategy')

      var columns = [nameStat, typeStat, stratStrat]
      var numeric = this.props.stat_config.filter()
      columns = columns.concat(numeric)

      var self = this 
      const RemoveColumn = {
        Header : "Remove", 
        id: "remove", 
        Cell: function(row){
          return <a className='table-link manager-comparison-remove-link' id="remove" onClick={(e) => self.props.removeManager(row.original)}> Remove </a>
        }
      }
      columns.push(RemoveColumn)
      return columns
  }
  render(){
    var columns = this.getColumns()
    return(
        <ReactTable
            data={this.props.data}
            columns={columns}
            minRows={25}
            defaultPageSize={15}
            className="-striped -highlight react-table-condensed"

            getTdProps={(state, rowInfo, column, instance) => {
              var props = {style : {}}
              if(column.id == 'show' || column.id != 'name'){
                props.style.textAlign = 'center'
              }
              props.onClick = (e, handleOriginal) => {
                if(e.target.id != 'remove'){
                  if(rowInfo && rowInfo.original){
                    this.props.rowClicked(e, rowInfo.original)
                  }
                }
              }
              return props   
            }}
        />
    )
  }
}
export default ManagerComparisonTable;

