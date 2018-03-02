import React from 'react';
import _ from 'underscore'
import moment from 'moment'

import Utilities from '../../../utilities.js'
import './returnsTable.css'

const MONTHS = [1,2,3,4,5,6,7,8,9,10,11,12]
const YEARS = [2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018]

class ReturnsTableCell extends React.Component{
  value(){
    var val = Utilities.round(this.props.returns[this.props.month-1], 3)
    return val
  }
  indicatorClass(){
    if(this.value()){
      if(this.value() > 0.0){
        return 'positive_return'
      }
      else if(this.value() < 0.0){
        return 'negative_return'
      }
    }
    return ''
  }
  render(){
    var className = "return-table-cell-wrap " + this.indicatorClass()
    return (
      <td className='return-cell'><div className={className}>{this.value()}</div></td>
    )
  }
}
class ReturnsTableRow extends React.Component{
  render(){
    return (
        <tr>  
          <td style={{minWidth:75, maxWidth:75, width:75, paddingLeft: 0, paddingRight:0}} key={'year'}>{this.props.year}</td>
          {this.props.months.map((monthInt) => {
              return <ReturnsTableCell key={monthInt} returns={this.props.returns} month={monthInt} />
          })}
        </tr>
    )
  }
}

class ReturnsTableHeader extends React.Component{
    get all_years(){
      var years = YEARS.slice()
      years.reverse()
      return years
    }
    render(){
      return (
        <div className="returns-table-flex-header">
          <div className="flex-grow">
            <div style={{float:'right', display : 'flex'}}>
              <p className='returns-table-date-control-text'> from </p>
              <select name="startYear" onChange={this.props.dateChanged.bind(this)} defaultValue={this.all_years[this.all_years.length-1]} style={{width: 120, marginRight: 5, marginLeft: 5}}>
                  {this.all_years.map((year) => {
                    return <option key={year} value={year}> {year} </option>
                  })}
              </select>
              <p className='returns-table-date-control-text'> to </p>
              <select name="endYear"  onChange={this.props.dateChanged.bind(this)} defaultValue={this.all_years[0]} style={{width: 120, marginRight: 5, marginLeft: 5}}>
                  {this.all_years.map((year) => {
                    return <option key={year} value={year}> {year} </option>
                  })}
              </select>
            </div>
          </div>
        </div>
      )
    }
}

class ReturnsTableTable extends React.Component{
  render(){

    var month_names = {}
    _.each(MONTHS, function(index){
      var mmt = moment().month(index-1)
      var name = mmt.format('MMM')
      month_names[index] = name
    })

    var grid_returns = {}
    if(this.props.manager && this.props.manager.returns && this.props.manager.returns.series){
        _.each(this.props.manager.returns.series, function(ret){
            var mmt = new moment(ret.date)
            if(!grid_returns[mmt.year()]){
                grid_returns[mmt.year()] = {}
            }
            grid_returns[mmt.year()][mmt.month()] = ret.value
        })
    }

    return (
        <table className='table-condensed returns-table'>
          <thead>
              <tr> 
                  <th></th>
                  {this.props.months.map((monthInt) => {
                      return <th key={monthInt}>{month_names[monthInt]}</th>
                  })}
              </tr>
          </thead>
          <tbody>
              {this.props.years.map((year) => {
                  const returns = {};
                  return <ReturnsTableRow key={year} returns={grid_returns[year] || {}} year={year} months={this.props.months}/>
              })}
          </tbody>
        </table>
    )
  }
}

class ReturnsTable extends React.Component{
  constructor(){
    super()
    this.state = {'months' : MONTHS, 'startYear' : YEARS[0], 'endYear' : YEARS[YEARS.length - 1]}
  }
  dateChanged(e){
      var update = {}
      update[e.target.name] = e.target.value
      this.setState(update)
  }
  onClicked(){

  }
  get years(){
    var years = []
    for(var i = this.state.startYear; i<=this.state.endYear; i++){
      years.push(i)
    }
    years.reverse()
    return years 
  }
  render(){
    return (
      <div>
        <ReturnsTableHeader 
              manager={this.props.manager} 
              startYear={this.state.startYear} 
              endYear={this.state.endYear} 
              dateChanged={this.dateChanged} 
              returnsManagerType={this.props.returnsManagerType}
        />
        <ReturnsTableTable 
              manager={this.props.manager} 
              years={this.years}
              months={this.state.months} 
        />
      </div>
    ) 
  }
}

export default ReturnsTable;