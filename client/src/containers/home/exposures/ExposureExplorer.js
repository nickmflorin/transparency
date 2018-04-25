import React from 'react';  
import PropTypes from 'prop-types';
import _ from 'underscore'
import moment from 'moment'

import { ExposurChartExplorer } from '../../../components/charts'
import { ChartToolbar } from '../../../components/toolbars'
import { Panel, Page, ManagerHeader } from '../../../components/layout'

const findChange = function(exposures, config){
  const __attrs__ = ['id', 'level','category','tier']
  for(var i = 0; i<__attrs__.length; i++){
    const attr = __attrs__[i]

    if(exposures[attr] != config[attr]){
      return attr 
    }
  }
  return null 
}

class ExposureExplorer extends React.Component {
  constructor(props, context){
    super(props, context)
    this.state = {
      category : 'sector',
      level : 1,
      tier : 'gross',
      id : (props.selected && props.selected.id) || null,
      exposures : null,
      error : null,
      warning : null,
    }
    if(this.state.id){
      if(props.categorized_exposures && props.categorized_exposures.id == this.state.id){
        this.state.exposures = props.categorized_exposures
      }
    }
  }
  static propTypes = {
    selected: PropTypes.object,
    dates: PropTypes.object,
    categorized_exposures: PropTypes.object,
    getManagerCategoryExposures: PropTypes.func.isRequired,
  };
  // Cannot Set State in Mount, Only Call API if We Need Updated Exposuers for Initial Manager
  // If Selected ID Present Before Mount, Constructor Guarantees Exposures Will be Associated with ID or Null
  componentDidMount(){
    if(this.state.id){
      if(!this.state.exposures){
         this.props.getManagerCategoryExposures(this.state.id, { category : this.state.category, tier : this.state.tier, level : this.state.level })
      }
      else{
        // Check if Exposures for Another Manager, Category, Tier, Level
        var changed_attr = findChange(this.state.exposures, this.state)
        if(changed_attr){
          this.props.getManagerCategoryExposures(this.state.id, { category : this.state.category, tier : this.state.tier, level : this.state.level })
        }
      }
    }
  }
  componentWillReceiveProps(props){

    // Update Manager ID in State if Selection Changes
    if(props.selected){
      if(props.selected.id != this.state.id){
        this.setState({ 'id' : props.selected.id })

        // Dont Have to Check for Specific Change, but Double Check Just in Case
        if(!this.state.exposures || this.state.exposures.id != props.selected.id){
          this.props.getManagerCategoryExposures(props.selected.id, { category : this.state.category, tier : this.state.tier, level : this.state.level })
        }
      }
    }
    // Update Exposures in State If They Change
    if(props.categorized_exposures){
      if(!this.state.exposures){
        this.setState({ exposures : props.categorized_exposures })
      }
      else{
        // Check if Exposures Provided in Props Differ from Current Exposures
        const config = { id : this.state.exposures.id, category : this.state.exposures.category, tier : this.state.exposures.tier, level : this.state.exposures.level }
        var changed = findChange(props.categorized_exposures, config)
        if(changed){
          this.setState({ exposures : props.categorized_exposures })
          // Maybe Do This Too? => Set the Category, Level and Tier in State Based on Exposure Results Just In Case Returned Exposures Differ/There Was Error and Redux Reverted to Older Exposures
          //this.setState( { category : props.categorized_exposures.category, level : props.categorized_exposures.level, tier : props.categorized_exposures.tier })
        }
      }
    }
  }
  toggle(e, type, id){
    if(this.state[type] == undefined){
      throw new Error('Invalid Type Supplied')
    }
    if(this.state[type] != id){
      var state = this.state 
      state[type] = id 
      this.setState({ state })

      if(this.props.selected){
        this.props.getManagerCategoryExposures(this.props.selected.id, { category : this.state.category, tier : this.state.tier, level : this.state.level })
      }
    }
  }
  handleDateChange(){

  }
  render() {
    return (
       <Page
        manager={this.props.selected}
        header={(
          <ManagerHeader {...this.props} />
        )}
        notificationTypes={[
          'GET_MANAGER_CATEGORY_EXPOSURES'
        ]}
        {...this.props}
       >
        <Panel title="Exposure Explorer" classNames={{"chart-panel-body":true}}>
          <ChartToolbar 
            toggle={this.toggle.bind(this)}
            className="straight"
            separated={true}
            controls={[
              { id:"category",
                type:"button",
                value:this.state.category,
                options:[
                  { id : 'sector', label : 'Sector'},
                  { id : 'region', label : 'Region'},
                  { id : 'mkt_cap', label : 'Mkt Cap'},
                  { id : 'strategy', label : 'Strategy'},
                  { id : 'asset', label : 'Asset Class'}
                ]
              },
              { id:"level",
                type:"button",
                value:this.state.level,
                options:[
                  { id : 1, label : 'Level 1'},
                  { id : 2, label : 'Level 2'},
                  { id : 3, label : 'Level 3'},
                  { id : 4, label : 'Level 4'}
                ]
              },
              { id:"tier",
                type:"button",
                value:this.state.tier,
                options:[
                  { id : 'pct_gross', label : '% Gross'},
                  { id : 'gross', label : 'Gross'},
                  { id : 'net', label : 'Net'},
                  { id : 'long', label : 'Long'},
                  { id : 'short', label : 'Short'}
                ]
              }
            ]}
          />
          <div style={{marginTop: 20}}>
            <ExposureExplorerChartContainer 
              category={this.state.category}
              level={this.state.level}
              tier={this.state.tier}
              exposures={this.state.exposures}
            />
          </div>
      </Panel>
    </Page>
    )
  }
}

class ExposureExplorerChartContainer extends React.Component {
  constructor(props, context){
    super(props, context)
    this.state = {
      chart_type : 'bar',
    }
  }
  // Exposures At This Point Are List of Exposures, Not Exposures Object
  // Dont Filter Categories Since We Return Subset of Categories for Tier, Category and Level
  create_series(exposures, category, level, tier){
   
    const names = _.uniq(_.pluck(exposures, 'name'))

    var serieses = []
    _.each(names, function(name){
      var series = { 'name' : name, 'data' : [] }

      _.each(exposures, function(exposure){
        if(exposure.name == name){

          var date = new moment(exposure.date)
          if(date.isValid){
            
            var value = parseFloat(exposure.value)
            if(value !== undefined && value != 0.0){
              series.data.push([
                Date.UTC(date.year(), date.month(), date.day()), value 
              ])
            }
          }
          else{
            console.log('Warning: Found Invalid Date')
          }
        }
      })

      // Highcharts Requires Points be Sorted by Date
      series.data.sort(function(a, b){
          return a[0] - b[0];
      })
      serieses.push(series)
    })

    return serieses
  }
  shouldComponentUpdate(props, state){
    if(props.exposures){
      // If Exposures Present -> Check if Different, Else, Automatically Rerender
      if(this.props.exposures){
         var changed = findChange(props.exposures, { id : this.props.exposures.id, category : this.props.exposures.category, level : this.props.exposures.level, tier : this.props.exposures.tier })
         if(changed){
          return true 
         }
      }
      else{
        return true 
      }
    }
    return false 
  }
  render() {
    var series = []
    if(this.props.exposures){
      series = this.create_series(this.props.exposures.exposures, this.props.category, this.props.level, this.props.tier)
    }
    return (
      <ExposurChartExplorer 
        series={series}
        type={this.state.chart_type}
        title="Exposure Explorer"
      />
    )
  }
}

export default ExposureExplorer;