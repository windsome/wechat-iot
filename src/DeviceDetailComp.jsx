import React, { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';

import { DefaultGaugeConfig, DefaultLineConfig } from './ChartConfig.jsx'
//import { ReactHighcharts } from 'react-highcharts';
var ReactHighcharts = require('react-highcharts');
var HighchartsMore = require('highcharts-more');
// We tell HighchartsMore to use the same Highcharts object as ReactHighcharts
HighchartsMore(ReactHighcharts.Highcharts);
var HighchartsSolidGauge = require('highcharts/modules/solid-gauge');
HighchartsSolidGauge(ReactHighcharts.Highcharts);

export default class DeviceDetailComp extends Component {
  static defaultProps = {
    device: {id:'', info:{} },
    images: ["1.jpg"],
    sensors: {},
  }
  static propTypes = {
    device: React.PropTypes.object.isRequired,
    images: React.PropTypes.array,
    sensors: React.PropTypes.object.isRequired,
    gotoDeviceList: React.PropTypes.func.isRequired,
  }
  state = {
    count: this.props.sensors.length,
    currentImage: 0,
    lineTimeInterval: 86400
  }

  constructor (props) {
    super (props);

    this.gaugeCharts = {};
    this.lineCharts = {};
  }

  // lastTimestamp: latest timestamp of chart
  // sensors: 
  // {
  //   'temp': {'gauge': 23.23, 'line':[[1459700795, 22.11], [1459700795, 23.21], [1459700795, 24.21]]},
  //   'humi': {'gauge': 63.23, 'line':[[1459700795, 62.11], [1459700795, 53.21], [1459700795, 74.21]]},
  // }
  updateCharts (sensors, lastTimestamp) {
    console.log ("updateCharts:"+lastTimestamp);
    console.log (this.gaugeCharts);
    console.log (this.lineCharts);
    //console.log (sensors);

    for (var prop in sensors) {
      if (!sensors.hasOwnProperty(prop)) continue;
      var gaugeData = sensors[prop].gauge;
      var lineData = sensors[prop].line;
      console.log ("prop="+prop+", gaugeData="+gaugeData);
      if (gaugeData) {
        if (this.gaugeCharts[prop]) {
          var chart = this.gaugeCharts[prop].getChart();
          console.log ("get chart");
          if (chart) {
            console.log ("update to "+gaugeData);
            var point = chart.series[0].points[0];
            point.update(gaugeData);
            // todo: need update timestamp.
          }
          var chart2 = this.lineCharts[prop].getChart();
          if (chart2) {
            chart2.series[0].addPoint([lastTimestamp, gaugeData]);
          }
        }
      }
      if (lineData) {
        if (this.lineCharts[prop]) {
          var chart = this.lineCharts[prop].getChart();
          if (chart) {
            if (lineData.length > 0) {
              for (var i = 0; i < lineData.length; i++) {
                chart.series[0].addPoint(lineData[i], false);
              }
            }
            var remove_index = -1;
            var old_data = chart.series[0].data;
            var startTime = lastTimestamp - (this.state.lineTimeInterval*1000);
            for (var i = 0; i < old_data.length; i++) {
              if (old_data[i].x < startTime) {
                remove_index = i;
                break;
              }
            }
            for (var i = remove_index; i >= 0; i--) {
              chart.series[0].removePoint(i, false);
            }
            chart.redraw();
          }
        }
      }
    }
  }

  renderGauges () {
    var sensors = [];
    for (var sensorid in this.props.sensors) {
      //var value = this.props.sensors[sensorid];
      sensors.push(sensorid);
    }
    return sensors.map ((sensorid, index) => {
      var value = this.props.sensors[sensorid];
      var id = sensorid; //sensor.id;
      var type = sensorid; //sensor.type;
      var gaugeCfg = Object.assign ({}, DefaultGaugeConfig, {title: {text: type}, series:[{name:type, data:[value]}] });
      console.log ("id="+id+", value="+value);
      return (
        <div className="col-xs-6 col-sm-3" key={id} ><ReactHighcharts config={gaugeCfg} ref={(c) => {this.gaugeCharts[id]=c; console.log("id="+id);} }></ReactHighcharts></div>
      );
    });
  }

  renderGauges2 () {
    var htmls = [];
    for (var sensorid in this.props.sensors) {
      var value = this.props.sensors[sensorid];
      var id = sensorid; //sensor.id;
      var type = sensorid; //sensor.type;
      var gaugeCfg = Object.assign ({}, DefaultGaugeConfig, {series:[{name:type, data:[value]}] });
      console.log ("id="+id+", value="+value);
      htmls.push (
        <div className="col-xs-6 col-sm-3"><ReactHighcharts config={gaugeCfg} key={id} ref={(c) => {this.gaugeCharts[id]=c; console.log("id="+id);} }></ReactHighcharts></div>
      );
    }
    return htmls;
  }

  renderLines () {
    var sensors = [];
    for (var sensorid in this.props.sensors) {
      //var value = this.props.sensors[sensorid];
      sensors.push(sensorid);
    }
    return sensors.map ((sensorid, index) => {
      var value = this.props.sensors[sensorid];
      var id = sensorid; //sensor.id;
      var type = sensorid; //sensor.type;
      var lineCfg = Object.assign ({}, DefaultLineConfig, {title:{text:type},series:[{name:type, data:[]}]});
      console.log ("id="+id+", value="+value);
      return (
        <div className="col-xs-12 col-sm-6" key={id}><ReactHighcharts config={lineCfg} ref={(c) => {this.lineCharts[id]= c; console.log("id="+id+",ref="+c)} }></ReactHighcharts></div>
      );
    });

  }

  render() {
    var imgUrl = null;
    if (this.props.images.length > 0) {
      if (this.state.currentImage < 0 || this.state.currentImage > this.props.images.length)
        imgUrl = this.props.images[this.state.currentImage];
    }
    return (
      <div>
        <ol className="breadcrumb">
          <li><a href="#" onClick={this.props.gotoDeviceList}>设备列表</a></li>
          <li className="active">设备详情（{ this.props.device.info && this.props.device.info.name || 'noname'}）</li>
        </ol>
        <div>
          { imgUrl && 
          (<img src={imgUrl} className="img-responsive" alt="Responsive image"/>)
          }
        </div>
        <div className="row" key={1}>
          { this.renderGauges ()}
          {/*<div className="col-xs-6 col-sm-3"><ReactHighcharts config={DefaultGaugeConfig} ref="gauge1"></ReactHighcharts></div>*/}
          { /*this.props.device.sensors && this.props.device.sensors.map((sensorid, i) => {
            var sensor = this.props.sensors[sensorid];
            var id = sensor.id;
            var type = sensor.type;
            var gaugeCfg = Object.assign ({}, DefaultGaugeConfig);
            return (
              <div className="col-xs-6 col-sm-3"><ReactHighcharts config={gaugeCfg} ref={(ref) => {this.gaugeCharts[id]= ref; console.log("id="+id+",ref="+ref)} }></ReactHighcharts></div>
            )
          } ) */}
        </div>
        <div className="row" key={2}>
          {this.renderLines()}
          {/*<div className="col-xs-12 col-sm-6"><ReactHighcharts config={DefaultLineConfig} ref="line1"></ReactHighcharts></div>*/}
          {/* this.props.device.sensors && this.props.device.sensors.map((sensorid, i) => {
            var sensor = this.props.sensors[sensorid];
            var id = sensor.id;
            var type = sensor.type;
            var lineCfg = Object.assign ({}, DefaultLineConfig);
            return (
              <div className="col-xs-12 col-sm-6"><ReactHighcharts config={lineCfg} key={id} ref={(ref) => {this.lineCharts[id]= ref; console.log("id="+id+",ref="+ref)} }></ReactHighcharts></div>
            )
          } ) */}
        </div>
      </div>
    );
  }
}

