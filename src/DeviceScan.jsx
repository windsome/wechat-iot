import React, { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';
import * as ApiUrl from './Constants.jsx';

class DeviceScan extends Component {
  constructor (props) {
    super (props);

    this.state = {
      deviceid:'',
      qrcode:'',
      name:'',
      latitude:'',
      longitude:'',
      scanStatus:'free'
    };
  }
  componentDidMount () {
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

    // get_bind_device

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

  postData () {
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

  render() {
    console.log ("scanStatus:"+this.state.scanStatus);
	    return (
	    <div>
    	  <h1 className="text-center">设备扫描</h1>
    	  <p className="text-indent">设备序号：点击扫描二维码，使用微信扫码，如果二维码模糊不清或丢失，可以手动输入id（为15位数字，中间不用加空格）</p>
    	  <p className="text-indent">地理位置：是自动填充的，不能编辑，可以点击“进入地图手动选择位置”在地图上拖拽红点进行手动修改</p>
   	      <form className="form-horizontal">
    	    <div className="form-group">
    	      <label htmlFor="deviceID" className="col-xs-3 control-label text-nowrap">设备序号</label>
    	      <div className="col-xs-5 no-padding-horizontal">
    	        <input type="text" className="form-control" id="deviceID" placeholder="0001 160302 00001" value={this.state.deviceid}/>
    	      </div>
    	      <div className="col-xs-4">
    	        <input type="button" className="btn btn-info" onClick={this.scanQRCode.bind(this)} value="扫描二维码"/>
    	      </div>
    	    </div>
    	    <div className="form-group">
    	      <label htmlFor="longitude" className="col-xs-3 control-label text-nowrap">地理位置</label>
    	      <div className="col-xs-5 no-padding-horizontal">
    	        <input type="text" className="form-control" id="longitude" placeholder="111.111111" value={this.state.longitude} readOnly/>
    	        <input type="text" className="form-control" id="latitude" placeholder="22.222222" value={this.state.latitude} readOnly/>
    	      </div>
    	      <div className="col-xs-4">
    	        <input type="button" className="btn btn-info text-wrap" value="进入地图手动选择位置"/>
    	      </div>
    	    </div>
    	    <div className="form-group">
    	      <div className="col-xs-12 text-center">
    	        <input type="button" className="btn btn-primary" onClick={this.postData.bind(this)} value="填写完确认提交"/>
    	      </div>
    	    </div>
    	    { this.state.scanStatus == 'fail' &&
            (
          <div className="form-group">
    	      <div className="col-xs-12 text-center">
    	        <span>扫描失败，是否超时，可重新进入此页面</span>
    	      </div>
    	    </div>)
          }
    	    { this.state.scanStatus == 'ok' &&
            (
          <div className="form-group">
    	      <div className="col-xs-12 text-center">
    	        <span>扫描成功</span>
    	      </div>
    	    </div>)
          }
    	    <div className="form-group">
    	      <div className="col-xs-4 col-xs-push-8">
    	        <a href="#" className="btn btn-primary btn-xs active" role="button">进入设备列表</a>
    	      </div>
    	    </div>
    	    {/*<div className="form-group">
    	      <label htmlFor="longitude" className="col-xs-3 control-label text-nowrap">GPS经纬度</label>
    	      <div className="col-xs-4 no-padding-left">
    	        <input type="text" className="form-control" id="longitude" placeholder="121.419947"/>
    	      </div>
    	      <div className="col-xs-4 no-padding-left">
    	        <input type="text" className="form-control" id="latitude" placeholder="31.207947"/>
    	      </div>
    	      <div className="col-xs-offset-3 col-xs-9 no-padding-left">
    	        <input type="button" className="btn btn-primary" value="进入地图手动选择位置"/>
    	      </div>
    	    </div>*/}
    	  </form>
	    </div>
	    );
  }
}

	ReactDOM.render(
	  <DeviceScan />,
	  document.body
	);

require("file?name=[name].[ext]!./deviceScan.html");
require("file?name=[name].[ext]!./charts.css");

