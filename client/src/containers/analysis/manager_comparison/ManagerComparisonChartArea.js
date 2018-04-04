import React from 'react';  
import PropTypes from 'prop-types';

import _ from 'underscore'
import moment from 'moment'

import { SelectToolbar } from '../../../components/toolbars'
import { ManagerComparisonBubbleChart } from '../../../components/charts'

class ManagerComparisonChartArea extends React.Component {
  static propTypes = {
      dimensions: PropTypes.object.isRequired,
      stats: PropTypes.array.isRequired,
      list: PropTypes.object,
      onDimensionChange: PropTypes.func.isRequired,
  };
  generateSeries(){
      var stats = {}
      stats.x = _.findWhere(this.props.stats, { id : this.props.dimensions.x.id })
      stats.y = _.findWhere(this.props.stats, { id : this.props.dimensions.y.id })
      stats.z = _.findWhere(this.props.stats, { id : this.props.dimensions.z.id })

      var series ={data : []}
      if(this.props.list){
        _.each(this.props.list.managers, function(manager){
          var point = { name : manager.name }

          point.x = stats.x.value(manager)
          point.y = stats.y.value(manager)
          point.z = stats.z.value(manager)

          series.data.push(point)
        })
      }
      return [series]
  }
  render() {
    // Stats Passed In Are Enabled... Want Only Numeric Enabled
    const stats = _.filter(this.props.stats, function(stat){
      return stat.type == 'numeric' && stat.enabled === true
    })
    const managers = this.props.list ? this.props.list.managers : []
    const series = this.generateSeries()

    return (
      <div>
        <SelectToolbar
          id="dimensions"
          onChange={this.props.onDimensionChange}
          items={[
              {'id' : 'x', 'label' : 'X Axis', 'children' : stats, value : this.props.dimensions.x.id},
              {'id' : 'y', 'label' : 'Y Axis', 'children' : stats, value : this.props.dimensions.y.id},
              {'id' : 'z', 'label' : 'Z Axis', 'children' : stats, value : this.props.dimensions.z.id}
          ]}
        />
        <ManagerComparisonBubbleChart 
          series={series}
          dimensions={this.props.dimensions}
        />
      </div>
    )
  }
}

export default ManagerComparisonChartArea;