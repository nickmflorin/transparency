import React from 'react';
import _ from 'underscore'
import moment from 'moment'

import { Utilities } from '../../utilities'
import './ReturnsTable.css'

class ReturnGridConstants {
  static get MONTHS(){
    return [0,1,2,3,4,5,6,7,8,9,10,11]
  }
  static get YEARS(){
    return [2002, 2003, 2004, 2005, 2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018]
  }

  static get startYear(){
    return ReturnGridConstants.YEARS[0]
  }
  static get endYear(){
    return ReturnGridConstants.YEARS[ReturnGridConstants.YEARS.length - 1]
  }

  static get years(){ 
    var years = []
    for(var i = this.startYear; i<=this.endYear; i++){
      years.push(i)
    }
    years.reverse()
    return years 
  }
  static monthName(index){
    var mmt = moment().month(index)
    var name = mmt.format('MMM')
    return name
  }
}

class GridReturnPoint {
  constructor(month, year, value, inRange = false){
    this.month = month 
    this.year = year 
    this.value = value 
    this.inRange = inRange
  }
}

class ReturnsTableCell extends React.Component{
  render(){
    var className = "return-table-cell-wrap"
    var tdClassName = 'return-cell'
    if(this.props.highlighted){
      tdClassName += ' in_range_cell'
    }
    if(this.props.point && this.props.point.value){
      if(this.props.point.value > 0.0){
        className += ' positive_return'
      }
      else if(this.props.point.value < 0.0){
        className += ' negative_return'
      }
    }
    
    return (
      <td className={tdClassName}>
        <div className={className}>
          {this.props.point && Utilities.round(this.props.point.value, 3)}
        </div>
      </td>
    )
  }
}
class ReturnsTableRow extends React.Component{
  isHighlighted(month){
    var highlighted = this.props.highlighted || []
    highlighted = _.filter(highlighted, (point) => { return point.year == this.props.year })
    highlighted = _.findWhere(highlighted, { month : month })

    if(highlighted){
      return true 
    }
    return false 
  }
  render(){
    return (
        <tr>  
          <td style={{minWidth:75, maxWidth:75, width:75, paddingLeft: 0, paddingRight:0}} key={'year'}>
            {this.props.year}
          </td>
          {ReturnGridConstants.MONTHS.map((monthInt) => {
              return(
                <ReturnsTableCell 
                  key={monthInt} 
                  point={this.props.grid[monthInt]} 
                  year={this.props.year} 
                  highlighted={this.isHighlighted(monthInt)}
                  month={monthInt} 
                />
              )
          })}
        </tr>
    )
  }
}

export class ReturnsTable extends React.Component{
  get highlighted_dates(){
    if(this.props.dates){
  
      var start_mmt = moment({ 
        year : this.props.dates.start.year, 
        month : this.props.dates.start.month, 
        day : 1
      })

      var end_mmt = moment({ 
        year : this.props.dates.end.year, 
        month : this.props.dates.end.month, 
        day : 1
      })
      var series = Utilities.generateMonthSeries(start_mmt, end_mmt, 'parsed')
      return series
    }
    return []
  }
  get returns_grid(){
    var grid_returns = {}
    var self = this 

    if(this.props.complete){
      _.each(this.props.complete, function(ret){
          var mmt = new moment(ret.date)
          var year = mmt.year()
          var month = mmt.month()

          var point = new GridReturnPoint(month, year, ret.value)
          if(self.props.in_range){
              var rangeReturn = _.findWhere(self.props.in_range, {date : ret.date})
              if(rangeReturn){
                  point.inRange = true;
              }
          }

          if(!grid_returns[mmt.year()]) grid_returns[mmt.year()] = {}
          grid_returns[mmt.year()][mmt.month()] = point
      })
    }
    return grid_returns
  }
  render(){
    return (
        <table className='table-condensed returns-table'>
          <thead>
              <tr> 
                  <th></th>
                  {ReturnGridConstants.MONTHS.map((monthInt) => {
                      return <th key={monthInt}> {ReturnGridConstants.monthName(monthInt)}</th>
                  })}
              </tr>
          </thead>
          <tbody>
              {ReturnGridConstants.years.map((year) => {
                  return(<ReturnsTableRow 
                      key={year} 
                      grid={this.returns_grid[year] || {}} 
                      year={year} 
                      highlighted={this.highlighted_dates}
                    />)
              })}
          </tbody>
        </table>
    )
  }
}

export default ReturnsTable;