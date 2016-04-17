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

import React, { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';
import * as ApiUrl from './Constants.jsx';
import DeviceListComp from './DeviceListComp.jsx';
import DeviceScanComp from './DeviceScanComp.jsx';
import DeviceDetailComp from './DeviceDetailComp.jsx';


var reconnectTimeout = 2000;
var host = 'lancertech.net', port = 8888;
//var clientId = "web_" + parseInt(Math.random() * 100,10);
var clientId = "web_" + Date.now();
var topic = 'am/#', useTLS = false, username = null, password = null, cleansession = true;

class IotPage extends Component {
  constructor (props) {
    super (props);
    console.log ("url:"+page_config.pageDetail);
    //alert ("url:"+page_config.pageDetail);
    console.log ("mqtt: try to connect to " + host + ":" + port + "/" + clientId);
    this.mqtt = new Paho.MQTT.Client(host, port, clientId);
    this.coms = {};
    this.state = {
      device_scan: { },
      scan_result: '',
      deviceArray: [],
      devices: { },
      datax: { },
      current_component: {name:"list"},
      //current_component: {name:"detail", id: '1'},
    };
  }

  componentDidMount () {
    console.log ("window.location="+window.location);
    this.getDeviceList (0);
    this.MQTTconnect ();
    this.WXConfig ();
  }

  WXConfig () {
    wx.config({
      beta:true,
      debug: false,
      appId: page_config.appId,
      timestamp: page_config.timestamp,
      nonceStr: page_config.nonceStr,
      signature: page_config.signature,
      jsApiList: [
          // 所有要调用的 API 都要加到这个列表中
          'checkJsApi',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareWeibo',
          'hideMenuItems',
          'showMenuItems',
          'hideAllNonBaseMenuItem',
          'showAllNonBaseMenuItem',
          'translateVoice',
          'startRecord',
          'stopRecord',
          'onRecordEnd',
          'playVoice',
          'pauseVoice',
          'stopVoice',
          'uploadVoice',
          'downloadVoice',
          'chooseImage',
          'previewImage',
          'uploadImage',
          'downloadImage',
          'getNetworkType',
          'openLocation',
          'getLocation',
          'hideOptionMenu',
          'showOptionMenu',
          'closeWindow',
          'scanQRCode',
          'chooseWXPay',
          'openProductSpecificView',
          'addCard',
          'chooseCard',
          'openCard',
          'openWXDeviceLib',
          'getWXDeviceTicket'
      ]
    });

    // jssdk注册成功后执行
    wx.ready(function () {
      console.log ("jssdk register ok!");
      wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
          //alert ("success get location");
          var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
          var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
          var speed = res.speed; // 速度，以米/每秒计
          var accuracy = res.accuracy; // 位置精度
          //alert("latitude="+latitude+", longitude="+longitude+", speed="+speed+", accuracy="+accuracy);
          this.setState({latitude:latitude, longitude:longitude});
        }.bind(this)
      });

      //alert ("get location");
      wx.invoke('openWXDeviceLib', {}, function(res){
        //alert(res.err_msg);
      });
      //alert ("openWXDeviceLib");
    }.bind(this));

    // jssdk注册失败时执行
    wx.error(function(){
      console.log ("jssdk register fail!");
      alert("error");
    });
  }

  scanQRCode () {
    //this.setState ({qrcode:"aadfadsfdsfsd" });
    wx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res) {
        var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
        this.setState ({qrcode:result});
        $.ajax({
          type: "POST",
          url: ApiUrl.URL_API_DEVICE_GETBYQRCODE,
          data: JSON.stringify({qrcode:result}),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (data) {
            //alert(JSON.stringify(data));
            var devices = data.devices;
            if (devices !== null && devices !== undefined && devices.length > 0) {
              this.setState({deviceid:devices[0].deviceid});
            }
          }.bind(this),
          failure: function (errMsg) {
            alert(JSON.stringify(errMsg));
          }
        });
      }.bind(this)
    });
  }

  bindDevice () {
    //alert ("postData="+this.state.deviceid);
    if (this.state.deviceid == '') {
      alert ("you must scan qrcode first!");
      return;
    }
    this.setState ({scanStatus:'commit'});
    wx.invoke('getWXDeviceTicket', {"deviceId":this.state.deviceid,"type":1}, function(res){
        var err_msg = res.err_msg;
        if (err_msg.indexOf(":ok") >= 0) {
          //alert ("get ticket1 = "+ res.ticket);
          $.ajax({
            type: "POST",
            url: ApiUrl.URL_API_DEVICE_BINDTOUSER,
            //data: JSON.stringify({qrcode:"http://we.qq.com/d/AQCucyi-lj3pE2_Zon5LVu2SJLr4IGZrMDcDtuvO", name:"dapeng1", latitude:"11.111111", longitude:"22.222222"}),
            data: JSON.stringify({ticket:res.ticket, deviceid:this.state.deviceid, qrcode:this.state.qrcode, name:this.state.name, latitude:this.state.latitude, longitude:this.state.longitude}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
              //alert(JSON.stringify(data));
              console.log ("insert device ok:"+JSON.stringify(data));
              this.setState ({scanStatus:'ok'});
            }.bind(this),
            failure: function (errMsg) {
              alert(JSON.stringify(errMsg));
              this.setState ({scanStatus:'fail'});
            }.bind(this)
          });
        } else {
          this.setState ({scanStatus:'fail'});
          alert ("get ticket fail!");
        }
      }.bind(this)
    );
  }

  MQTTconnect () {
    var options = {
        timeout: 3,
        useSSL: useTLS,
        cleanSession: cleansession,
        onSuccess: () => {
          console.log ("success connect to topic=" + topic);
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
        var comp_name = this.state.current_component && this.state.current_component.name || '';
        if (comp_name == 'list') {
          this.setState ({datax: datax});
        } else if (comp_name == 'scan'){
        } else if (comp_name == 'detail'){
          var device = this.state.current_component.id && this.state.devices && this.state.devices[this.state.current_component.id];
          var comp = this.coms['detail'];
          if (comp && device && (device.uuid == device_uuid)) {
            var sensors = {};
            var sensorX = sensor_data[0];
            for (var prop in sensorX) {
              sensors[prop] = {'gauge': sensorX[prop]}
            }
            comp.updateCharts (sensors, Date.parse(new Date()));
          }
        }
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
        console.log ("getDeviceList ok:"+JSON.stringify(data));
        //alert ("getDeviceList ok:"+JSON.stringify(data));
        var devices = data.device_list;
        if (devices !== null && devices !== undefined && devices.length > 0) {
          console.log ("got devices:"+devices.length);
          console.log (devices);
          //this.setState({devices:devices});

          var device_array = new Array();
          var device_data = {};
          for (var i in devices) {
            var device = devices[i];
            device_array.push (device.id);
            device_data[device.id] = device;
          }
          console.log (device_array);
          console.log (device_data);
          this.setState({deviceArray:device_array, devices:device_data, current_component: {name: "list" } });
        } else {
          console.log ("got no devices");
          alert ("got no devices!");
        }
      }.bind(this),
      failure: function (errMsg) {
        alert(JSON.stringify(errMsg));
      }.bind(this)
    });
  }

  gotoDeviceDetail (device) {
    console.log ("gotoDeviceDetail:");
    console.log (device);
    this.setState ({ current_component: {name: "detail", id: device.id} });
  }
  gotoDeviceScan () {
    console.log ("gotoDeviceScan:");
    this.setState ({ current_component: {name: "scan"} });
  }
  gotoDeviceList () {
    console.log ("gotoDeviceList:");
    this.setState ({ current_component: {name: "list"} });
  }

  renderDeviceDetail () {
    var device = this.state.current_component &&  this.state.current_component.name == 'detail' && this.state.current_component.id && this.state.devices[this.state.current_component.id];
    if (device) {
      var sensors = this.state.datax[device.uuid];
      return (<DeviceDetailComp device={device} sensors={sensors} ref={(ref) => { this.coms['detail'] = ref; } } gotoDeviceList={this.gotoDeviceList.bind(this)}/>)
    }
  }

	render () {
    console.log ("com name:"+(this.state.current_component &&  this.state.current_component.name));
	  return (
    <div>
      { this.state.current_component &&  this.state.current_component.name == 'scan' &&
      (<DeviceScanComp device={this.state.device_scan} scanResult={this.state.scan_result} onScanQRCode={this.scanQRCode.bind(this)} onBindDevice={this.bindDevice.bind(this)} gotoDeviceList={this.gotoDeviceList.bind(this)}/>)
      }
      { this.state.current_component &&  this.state.current_component.name == 'list' &&
      (<DeviceListComp deviceArray={this.state.deviceArray} devices={this.state.devices} datax={this.state.datax} gotoDeviceDetail={this.gotoDeviceDetail.bind(this)} gotoDeviceScan={this.gotoDeviceScan.bind(this)}/>)
      }
      {
        this.renderDeviceDetail()
      }
    </div>
	  );
	}
}

	ReactDOM.render(
	  <IotPage />,
	  document.body
	);

require("file?name=[name].[ext]!./iotPage.html");
require("file?name=[name].[ext]!./charts.css");
require("file?name=[name].[ext]!./mqttws31.js");
require("file?name=[name].[ext]!./bootstrap.min.css");
require("file?name=[name].[ext]!./jquery.min.js");

