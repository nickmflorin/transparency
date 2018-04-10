import React from 'react';  
import PropTypes from 'prop-types';

import { HistoricalExposureBarChart, ExposurChartExplorer } from '../../../components/charts'
import { ExposureExploreChartToolbar } from '../../../components/toolbars'
import { Panel, HomeContent } from '../../../components/layout'

import '../home.css'

export class HistoricalExposures extends React.Component {
  constructor(props, context){
    super(props, context)
    this.state = {
      selected_id : null, // Keeps Track of Active Manager So Multiple API Requests Not Performed
      exposures : null,
      date : null,
    }
  }
  static propTypes = {
    selected: PropTypes.object,
    dates: PropTypes.object,
    exposures: PropTypes.object,
    getManagerExposures: PropTypes.func.isRequired,
  };
  componentWillMount(){
    if(this.props.selected){
      this.setState({ selected_id : this.props.selected.id })
      if(!this.state.exposures || this.state.exposures.id != this.props.selected.id){
          this.props.getManagerExposures(this.props.selected.id)
      }
    }
  }
  componentWillReceiveProps(props){
    // Will Only Update if shouldComponentUpdate Notices Difference
    if(props.selected){
      if(!this.state.selected_id || this.state.selected_id != props.selected.id){
        this.props.getManagerExposures(props.selected.id)
        this.setState({selected_id : props.selected.id})
      }
    }
    if(props.exposures){
      if(!this.state.exposures || this.state.exposures.id != props.exposures.id ){
        this.setState({exposures : props.exposures})
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.exposures){
      if(!this.state.exposures || this.state.exposures.id != nextState.exposures.id){
        return true 
      }
    }
    return false 
  }

  render() {
    return (
       <HomeContent
        warning={this.props.warnings.exposures}
        error={this.props.errors.exposures}
        manager={this.props.selected}
       >

          <Panel title="Long/Short Historical Exposures">
              <HistoricalExposureBarChart 
                tiers={['long','short']}
                exposures={this.state.exposures}
                title="Long/Short Historical Exposures"
              />
          </Panel>
          <Panel title="Gross/Net Historical Exposures">
            <HistoricalExposureBarChart 
              tiers={['gross','net']}
              exposures={this.state.exposures}
              title="Gross/Net Historical Exposures"
            />
          </Panel>
        </HomeContent>
    )
  }
}

export default HistoricalExposures;
