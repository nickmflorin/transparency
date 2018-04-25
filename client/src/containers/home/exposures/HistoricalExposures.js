import React from 'react';  
import PropTypes from 'prop-types';
import _ from 'underscore'
import moment from 'moment'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCaretRight from '@fortawesome/fontawesome-free-solid/faCaretRight'
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload'

import { ButtonToolbar } from 'react-bootstrap';

import { HistoricalExposureBarChart, ExposurChartExplorer } from '../../../components/charts'
import { PanelToolbar, TableToolbar } from '../../../components/toolbars'
import { CustomReactTable } from '../../../components/tables'
import { Panel, Page, PanelOptions, ManagerHeader } from '../../../components/layout'

function parseTableData(exposures){
  var points = []
  _.each(exposures, function(exposure){
    var dt = new moment(exposure.date)
    if(dt.isValid()){
      var date = dt.format('YYYY-MM-DD')

      var pt = _.findWhere(points, { date : date })
      if(!pt){
        pt = { 'date' : date }
        points.push(pt)
      }
      pt[exposure.tier] = exposure.value 
    }
    else{
      console.log('Warning: Found Invalid Date in Exposure Data...')
    }
  })
  return points 
}

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
  download(){
    console.log('download')
  }
  toggleTable(){
    console.log('toggling table')
  }
  downloadTableData(){
    this.refs['all-exposure-data'].download()
  }
  render() {
    var data = parseTableData(this.props.exposures.exposures)
    return (
       <Page
        notificationTypes={[
          'GET_MANAGER_EXPOSURES'
        ]}
        header={(
          <ManagerHeader {...this.props} />
        )}
        manager={this.props.selected}
        {...this.props}
       >
          <Panel title="Long/Short Historical Exposures">
            <PanelToolbar 
              pushRight={true}
              buttons={[
                { id : 'long-short', label : 'Download', icon : faDownload, onClick: this.downloadTableData.bind(this) }
              ]}
            />
            <HistoricalExposureBarChart 
              tiers={['long','short']}
              exposures={this.state.exposures}
              title="Long/Short Historical Exposures"
            />
          </Panel>

          <Panel title="Gross/Net Historical Exposures">
            <PanelToolbar 
              pushRight={true}
              buttons={[
                { id : 'long-short', label : 'Download', icon : faDownload, onClick: this.downloadTableData.bind(this) }
              ]}
            />
            <HistoricalExposureBarChart 
              tiers={['gross','net']}
              exposures={this.state.exposures}
              title="Gross/Net Historical Exposures"
            />
          </Panel>

          <TableToolbar 
            className="margin bottom ten"
            pushRight={true}
            buttons={[
              { id : 'long-short', label : 'Download', icon : faDownload, onClick: this.downloadTableData.bind(this) }
            ]}
          />

          <CustomReactTable
            data={data}
            target={"historical-exposures"}
            ref='all-exposure-data'
            height="400px"
            minRows={data.length}
            defaultPageSize={data.length}
            showPaginationBottom={false}
            columns={[
              { Header: "Date", id : "date", accessor : 'date' },
              { Header: "% Gross", id : "pct_gross", accessor : 'pct_gross' },
              { Header: "Gross", id : "gross", accessor : 'gross' },
              { Header: "Net", id : "net", accessor : 'net' },
              { Header: "Long", id : "long", accessor : 'long' },
              { Header: "Short", id : "short", accessor : 'short' }
            ]}
          />
        </Page>
    )
  }
}

export default HistoricalExposures;
