import React, { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';
import * as ApiUrl from './Constants.jsx';

if (typeof Object.assign != 'function') {
  (function () {
	Object.assign = function (target) {
	 'use strict';
	 if (target === undefined || target === null) {
	   throw new TypeError('Cannot convert undefined or null to object');
	 }
	
	 var output = Object(target);
	 for (var index = 1; index < arguments.length; index++) {
	   var source = arguments[index];
	   if (source !== undefined && source !== null) {
	     for (var nextKey in source) {
	       if (source.hasOwnProperty(nextKey)) {
	         output[nextKey] = source[nextKey];
	       }
	     }
	   }
	 }
	 return output;
	};
  })();
}


var reconnectTimeout = 2000;
var host = 'lancertech.net', port = 8888;
//var clientId = "web_" + parseInt(Math.random() * 100,10);
var clientId = "web_" + Date.now();
var topic = 'am/#', useTLS = false, username = null, password = null, cleansession = true;

class DeviceList extends Component {
  constructor (props) {
    super (props);
    console.log ("url:"+page_config.pageDetail);
    //alert ("url:"+page_config.pageDetail);
    console.log ("mqtt: try to connect to " + host + ":" + port + "/" + clientId);
    this.mqtt = new Paho.MQTT.Client(host, port, clientId);
    this.state = {
      devices:[ ],
      datax:{ }
    };
  }

  componentDidMount () {
    console.log ("window.location="+window.location);
    this.getDeviceList (0);
    this.MQTTconnect ();
  }
/*
  mqttSuccess () {
    //console.log ("connected to topic=" + topic);
    //alert ("connected: " + topic);
    //this.mqtt.subscribe ("am/1550/c860c49307925831792/p/sensors", {qos: 0});
    //this.mqtt.subscribe ("am/1550/c860c49307841d31784/p/sensors", {qos: 0});
    this.mqtt.subscribe (topic, {qos: 0});
  }
  mqttFailure (res) {
    console.log("Connection failed: " + res.errorMessage + "Retrying");
    setTimeout(this.MQTTconnect, reconnectTimeout);
  }
  mqttConnectLost (res) {
    setTimeout(this.MQTTconnect, reconnectTimeout);
    console.log ("connection lost: " + res.errorMessage + ". Reconnecting");
  }
  mqttMessageArrived (res) {
    var topic = res.destinationName;
    var payload = res.payloadString;
    console.log ("recv: "+topic+ " / "+ payload);
    //alert ("recv: "+topic+ " / "+ payload);
    // recv: am/1550/c860c49307925831792/p/sensors
    // payload: [{"battery":0.0, "temp":22.62, "humi":37.38, "co2":475, "lm":0}]

    var product_id = '', device_uuid = '';
    var result = topic.split ('/');
    for (var i = 0; i < result.length; i++) {
      if (result[i] == 'am') {
        if (result[i+1] != undefined && result[i+1] != null)
          product_id = result [i+1];
        if (result[i+2] != undefined && result[i+2] != null)
          device_uuid = result [i+2];
        break;
      }
    }
    console.log ("result:"+result);
    var sensor_data = JSON.parse (payload);
    if (sensor_data.length > 0) {
      var datax = object.assign ({}, this.state.datax);
      datax[device_uuid] = sensor_data[0];
      console.log (datax);
      this.setState ({datax: datax});
    }
  }
*/
  MQTTconnect () {
    var options = {
        timeout: 3,
        useSSL: useTLS,
        cleanSession: cleansession,
        onSuccess: () => {
          //console.log ("connected to topic=" + topic);
          //alert ("connected: " + topic);
          //this.mqtt.subscribe ("am/1550/c860c49307925831792/p/sensors", {qos: 0});
          //this.mqtt.subscribe ("am/1550/c860c49307841d31784/p/sensors", {qos: 0});
          this.mqtt.subscribe (topic, {qos: 0});
        },
        onFailure: function (res) {
            console.log("Connection failed: " + res.errorMessage + "Retrying");
            setTimeout(this.MQTTconnect, reconnectTimeout);
        }
    };

    this.mqtt.onConnectionLost = (res) => {
      setTimeout(this.MQTTconnect, reconnectTimeout);
      console.log ("connection lost: " + res.errorMessage + ". Reconnecting");
    };
    this.mqtt.onMessageArrived = (res) => {
      var topic = res.destinationName;
      var payload = res.payloadString;
      // recv topic: am/1550/c860c49307925831792/p/sensors
      // recv payload: [{"battery":0.0, "temp":22.62, "humi":37.38, "co2":475, "lm":0}]

      var product_id = '', device_uuid = '';
      var result = topic.split ('/');
      for (var i = 0; i < result.length; i++) {
        if (result[i] == 'am') {
          if (result[i+1] != undefined && result[i+1] != null)
            product_id = result [i+1];
          if (result[i+2] != undefined && result[i+2] != null)
            device_uuid = result [i+2];
          break;
        }
      }
      var sensor_data = JSON.parse (payload);
      console.log ("recv:"+topic+" / "+payload+", product_id="+product_id+", device_uuid="+device_uuid);
      if (sensor_data.length > 0) {
        var datax = Object.assign ({}, this.state.datax);
        datax[device_uuid] = sensor_data[0];
        console.log (datax);
        this.setState ({datax: datax});
      }
    };

    if (username != null) {
        options.userName = username;
        options.password = password;
    }
    //console.log("Host="+ host + ", port=" + port + " TLS = " + useTLS + " username=" + username + " password=" + password);
    this.mqtt.connect(options);
  }
  MQTTmessage (tp, val) {
	  var message = new Paho.MQTT.Message(val);
	  message.destinationName = tp;
	  message.qos=0;
	  this.mqtt.send(message);
    console.log ("send: "+tp+ " / "+ val);
    //		mqtt.publish(tp, 0, val);
    //$('#ws').prepend('<li>' + tp + ' = ' + val+ '</li>');
  }

  getDeviceList (pageIndex) {
    //alert ("try to get devices");
    console.log ("try to get devices");
    $.ajax({
      type: "POST",
      url: ApiUrl.URL_API_DEVICE_GETDEVICELIST,
      data: JSON.stringify({page:pageIndex}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {
        //alert(JSON.stringify(data));
        var devices = data.device_list;
        if (devices !== null && devices !== undefined && devices.length > 0) {
          console.log ("got devices:"+devices.length);
          console.log (devices);
          this.setState({devices:devices});
        }
      }.bind(this),
      failure: function (errMsg) {
        alert(JSON.stringify(errMsg));
      }.bind(this)
    });
  }

  renderDevice (device, index) {
    return (
      <div className="row">
          <div className="col-xs-3">{device.id}</div>
          <div className="col-xs-6">
              <span className="text-nowrap">温度：26C </span>
              <span className="text-nowrap">湿度：30% </span>
              <span className="text-nowrap">光照：34200LM </span>
              <span className="text-nowrap">CO2: 12223 </span>
          </div>
          <div className="col-xs-3"><a className="text-nowrap">删除</a><a className="text-nowrap">查看</a></div>
      </div>
    );
  }
  renderDeviceList () {
    var deviceList = this.state.devices.map((device, index) => {
      return this.renderDevice (device, index);
    });
    return (
        <div className="container-fluid">
          <div className="row">
              <div className="col-xs-3"><strong>设备名称</strong></div>
              <div className="col-xs-6"><strong>设备状态</strong></div>
              <div className="col-xs-3"><strong>操作</strong></div>
          </div>
          {deviceList}
        </div>
    );
  }

  renderDevice2 (device, index) {
    var uuid = device.uuid;
    var sensor_html = [];
    var sensor_data = this.state.datax[uuid];
    if (sensor_data != null) {
      //console.log ("render:");
      for (var prop in sensor_data) {
        if(!sensor_data.hasOwnProperty(prop)) continue; 
        //console.log (prop);
        //console.log (sensor_data[prop]);
        sensor_html.push (<span className="text-nowrap">{prop}：{sensor_data[prop]} <br/></span>);
      }
      //console.log (sensor_html);
    }
    return (
      <tr>
          <td scope="row">1</td>
          <td className="wordbreak">{device.deviceid}</td>
          <td>
          {sensor_html}
          </td>
          {/*<td>
              <span className="text-nowrap">温度：26C </span><br/>
              <span className="text-nowrap">湿度：30% </span><br/>
              <span className="text-nowrap">光照：34200LM </span><br/>
              <span className="text-nowrap">CO2: 12223 </span><br/>
          </td>*/}
          <td><a className="text-nowrap">删除</a><a className="text-nowrap" href={page_config.pageDetail+"/id/"+device.id}>查看</a></td>
      </tr>
    );
  }
  renderDeviceList2 () {
    var deviceList2 = this.state.devices.map((device, index) => {
      return this.renderDevice2 (device, index);
    });
    return (
        <div className="table-reponsive">
            <table className="table table-bordered table-striped">
                <thead><tr>
                  <th>#</th>
                  <th className="text-nowrap">设备名称</th>
                  <th className="text-nowrap">设备状态</th>
                  <th>操作</th>
                </tr></thead>
                <tbody>
                  {deviceList2}
                </tbody>
            </table>
        </div>
    );
  }

	render () {
    var deviceList = this.renderDeviceList2 ();
	  return (
	  <div>
  	  <h1 className="text-center">设备列表</h1>
      {deviceList}
	  </div>
	  );
	}
}

	ReactDOM.render(
	  <DeviceList />,
	  document.body
	);

require("file?name=[name].[ext]!./deviceList.html");
require("file?name=[name].[ext]!./charts.css");
require("file?name=[name].[ext]!./mqttws31.js");
require("file?name=[name].[ext]!./bootstrap.min.css");
require("file?name=[name].[ext]!./jquery.min.js");

