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
import * as ApiUrl from '../Constants.jsx';
import DeviceScan from './DeviceScan.jsx';
import DeviceList from './DeviceList.jsx';
import DeviceDetail from './DeviceDetail.jsx';

var WX_STATUS_STRING = {
  "none": "",
  "init": "正在初始化微信本地库...",
  "ok": "微信本地库加载成功！",
  "fail": "微信本地库加载失败！"
}

/* *
 * state:
 *    wx_config_status: flag of wx config, 
 *      none: init state, doing nothing.
 *      init: in progress.
 *      ok: config ok.
 *      fail: config fail.
 *    action: page indicator.
 *      none: default page.
 *      list: in list page.
 *      scan: in scan page.
 *      help: in help page. 
 * */

class IotPage2 extends Component {
  constructor (props) {
    super (props);
    this.state = {
      action: 'none',
      wx_config_status: 'none',
      detail_device: {}
    };
  }

  componentDidMount () {
    console.log ("IotPage2 componentDidMount window.location="+window.location);
    if (this.state.wx_config_status != 'ok') {
      console.log ("need to do WXConfig!");
      this.WXConfig ();
    } else {
      console.log ("no need to do WXConfig!");
    }
  }

  WXConfig () {
    this.setState ({wx_config_status: 'init'});
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

      //alert ("get location");
      wx.invoke('openWXDeviceLib', {}, function(res){
        console.log ("openWXDeviceLib: " + res.err_msg);
        if (res.err_msg.indexOf(":ok") >= 0) {
          console.log ("ok1");
          this.setState ({wx_config_status: 'ok'});
        } else {
          console.log ("fail1");
          this.setState ({wx_config_status: 'fail'});
        }
      }.bind(this));
      //alert ("openWXDeviceLib");
    }.bind(this));

    // jssdk注册失败时执行
    wx.error(function(){
      console.log ("jssdk register fail!");
      this.setState ({wx_config_status: 'fail'});
    }.bind (this));
  }

  invokeTest (action) {
    this.setState ({action: action});
  }

  viewDetail (device) {
    console.log ("viewDetail:");
    console.log (device);
    this.setState ({action:'detail', detail_device: device});
  }

  renderAction () {
    try {
    var comp;
    if (this.state.action == 'scan') {
      if (this.state.wx_config_status == 'ok')
        comp = (<DeviceScan />);
    } else if (this.state.action == 'list')
      comp = (<DeviceList gotoDeviceDetail={this.viewDetail.bind(this)}/>);
    else if (this.state.action == 'detail')
      comp = (<DeviceDetail device={this.state.detail_device}/>);
    else if (this.state.action == 'help')
      comp = (<DeviceScan />);
    else if (this.state.action == 'none') {
      if (this.state.wx_config_status == 'ok')
        comp = (<DeviceList gotoDeviceDetail={this.viewDetail.bind(this)}/>);
    }
    } catch (e) {
      console.log ("error:");
      console.log (e);
    }
    return comp;
  }

	render () {
    //console.log ("action="+this.state.action+",wx_config_status="+this.state.wx_config_status);
    console.log ("IotPage2 render state="+JSON.stringify(this.state));
	  return (
    <div>
      <div className="btn-group" role="group" aria-label="Menu">
        <button type="button" className="btn btn-default" onClick={this.invokeTest.bind(this, 'scan')}>扫描设备</button>
        <button type="button" className="btn btn-default" onClick={this.invokeTest.bind(this, 'list')}>设备列表</button>
        <button type="button" className="btn btn-default" onClick={this.invokeTest.bind(this, 'help')}>帮助</button>
      </div>
      <div id="wx_config_status">
        {WX_STATUS_STRING[this.state.wx_config_status]}
      </div>
      <div>
        {this.renderAction()}
      </div>

    </div>
	  );
	}
}

	ReactDOM.render(
	  <IotPage2 />,
	  document.body
	);

require("file?name=[name].[ext]!./iotPage2.html");
require("file?name=[name].[ext]!../charts.css");
require("file?name=[name].[ext]!../mqttws31.js");
require("file?name=[name].[ext]!../bootstrap.min.css");
require("file?name=[name].[ext]!../jquery.min.js");
require("file?name=[name].[ext]!../qrcode.js");

