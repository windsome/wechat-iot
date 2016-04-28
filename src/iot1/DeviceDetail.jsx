import React, { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';
import Chart from './Chart.jsx';

import { DefaultGaugeConfig, DefaultLineConfig } from '../ChartConfig.jsx'
//import { ReactHighcharts } from 'react-highcharts';
var ReactHighcharts = require('react-highcharts');
var HighchartsMore = require('highcharts-more');
// We tell HighchartsMore to use the same Highcharts object as ReactHighcharts
HighchartsMore(ReactHighcharts.Highcharts);
var HighchartsSolidGauge = require('highcharts/modules/solid-gauge');
HighchartsSolidGauge(ReactHighcharts.Highcharts);

export default class DeviceDetail extends Component {
  static defaultProps = {
    device: { },
  }
  static propTypes = {
    device: React.PropTypes.object.isRequired,
  }
  state = {
    currentImage: 0,
    sensors2: [],
    lineTimeInterval: 86400
  }

  constructor (props) {
    super (props);

    this.gaugeCharts = {};
    this.lineCharts = {};
    this.endtime = Date.parse(new Date())/1000 - 3*24*60*60;
  }

  setInterval() {
    this.intervals.push(setInterval.apply(null, arguments));
  }
  componentWillMount() {
    this.intervals = [];
  }
  componentWillUnmount() {
    this.intervals.map(clearInterval);
    if(this.serverRequest) this.serverRequest.abort();
  }
  componentDidMount() {
    console.log("device:"+JSON.stringify(this.props.device));
    //let url = "http://lancertech.net/farm/douchat/index.php?s=/Home/Device/getDatax/deviceid/gh_9e62dd855eff_d73d6a1d7b8553d9/begintime/1460700000";
    let url = "http://lancertech.net/farm/douchat/index.php?s=/Home/Device/getDataxHistory/deviceid/"+this.props.device.deviceid+"/begintime/"+this.endtime;
    this.serverRequest = $.get(url, function (result) {
      // update sensors. then trick a timed reget.
      console.log ("componentDidMount getDataxHistory:");
      console.log (result);
      if (result.response == 'success') {
        this.endtime = result.endtime;
        this.setState ({sensors2:result.sensors});
        //this.setInterval(this.updateSensorData.bind(this), 10000);
      }
    }.bind(this));
  }

  renderDeviceBaseInfo() {
    var device = this.props.device;
    return (
      <div>
        <div>{device.deviceid} - {device.info && device.info.name || "未命名"}</div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-4"> 大棚1 </div>
            <div className="col-xs-4"> 
              <div />
            </div>
            <div className="col-xs-4"> 大棚1 </div>
          </div>
        </div>

      </div>
    );
  }

  render () {
    let a = 1;
    return (
      <div>
        <div>
          {this.renderDeviceBaseInfo()}
        </div>
        <div>
          <Chart />
        </div>
      </div>
    );
  }

}

