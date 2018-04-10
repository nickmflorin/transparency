import React from 'react';  
import PropTypes from 'prop-types';
import _ from 'underscore'

import { Utilities, Dates } from '../../../utilities'
import { DateInput } from '../../../components/inputs'
import { SnapshotExposurePieChart } from '../../../components/charts'
import { Panel, HomeContent } from '../../../components/layout'

import '../home.css'

class SnapshotExposures extends React.Component {
  constructor(props, context){
    super(props, context)
    this.state = {
      tiers : ['gross','long','short'],
    }
  }
  static propTypes = {
    selected: PropTypes.object,
    dates: PropTypes.object.isRequired,
    exposures: PropTypes.object,
    getManagerCategoryExposure: PropTypes.func.isRequired,
  };
  componentWillMount(){
    if(this.props.selected){
      if(this.props.categorized_exposures && this.props.categorized_exposures.id != this.props.selected.id){
          var string = Dates.stringify_tuple(this.props.dates.date)
          this.props.getManagerCategoryExposure(this.props.selected.id, string)
      }
    }
  }
  componentWillReceiveProps(props){
    // If Selected -> Check if Dates Changed and Requires New Exposures to be Retrieved
    if(props.selected){
      const diffDates = Dates.different(props.dates, this.props.dates, 'date')
      if(diffDates || !this.props.selected || this.props.selected.id != props.selected.id){
          var string = Dates.stringify_tuple(props.dates.date)
          this.props.getManagerCategoryExposure(props.selected.id, string)
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState){
    const diffDates = Dates.different(nextProps.dates, this.props.dates, 'date')
    if(diffDates){
      return true 
    }
    if(nextProps.categorized_exposure && nextProps.selected){
      if(!this.props.categorized_exposure || this.props.categorized_exposure.id != nextProps.categorized_exposure.id){
        return true
      }
    }
    return false
  }
  render() {
    var exposures = [], indexed = {}, categories = []
    if(this.props.categorized_exposure && this.props.categorized_exposure.exposures){

        var self = this 
        exposures = _.filter(this.props.categorized_exposure.exposures, function(exposure){
          return _.contains(self.state.tiers, exposure.tier) && exposure.value != 0.0
        })
        indexed = _.groupBy(exposures, 'category')

        var categories = Object.keys(indexed)
        categories.sort(function(a, b){
          return indexed[b].length - indexed[a].length
        })
    }

    return (
        <HomeContent
          date={this.props.dates.date}
          manager={this.props.selected}
          changeDate={this.props.changeDate}
          warning={this.props.warnings.category}
          error={this.props.errors.category}
        > 
          {categories.map( (category) => {
            return(
              <SnapshotCategoryExposure 
                key={category} 
                exposures={indexed[category] || []}
                tiers={this.state.tiers}
                category={category} 
              />
            )
          })}
        </HomeContent>
    )
  }
}

class SnapshotCategoryExposure extends React.Component {
  constructor(props, context){
    super(props, context)
  }
  static propTypes = {
    exposures: PropTypes.array.isRequired,
    category: PropTypes.string.isRequired,
    tiers: PropTypes.array.isRequired,
  }
  render(){
    const indexed = _.groupBy(this.props.exposures, 'tier')
    const title = Utilities.toTitleCase(this.props.category) + ' Exposures'
    return (
         <Panel title={title}>
          <div className="flex">
            {this.props.tiers.map( (tier) => {
                return (
                  indexed[tier] && 
                  <SnapshotCategoryTierExposure 
                    key={tier} 
                    tier={tier} 
                    category={this.props.category} 
                    exposures={indexed[tier]} 
                  />
                )
              })}
          </div>
        </Panel>
    )
  }
}

class SnapshotCategoryTierExposure extends React.Component {
  constructor(props, context){
    super(props, context)
  }
  static propTypes = {
    exposures: PropTypes.array.isRequired,
    category: PropTypes.string.isRequired,
    tier: PropTypes.string.isRequired,
  }
  render(){
    const title = Utilities.toTitleCase(this.props.tier) + ' ' + Utilities.toTitleCase(this.props.category) + ' Exposures'
    var series = { data : [], name : this.props.category + '-' + this.props.tier }

    // Exposures Up Until Here Already Filtered by Tier and Category
    var filtered = _.filter(this.props.exposures, ( exposure ) => { 
      return exposure.value != 0.0
    })
    // In Future => Want to Adjust Name Retrieved Based on Level
    series.data = filtered.map( (exposure) => {
        return { name : exposure.name_1, y : exposure.value }
    })

    return (
        <div style={{maxWidth:"33%", minWidth:"33%"}}>
          <SnapshotExposurePieChart 
            height={300}
            key={this.props.tier}
            series={series} 
            title={title}
          />
        </div>
    )
  }
}

export default SnapshotExposures;