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
      longitude:''
    };
  }
  componentDidMount () {

  }

  scanQRCode () {
    let that = this;
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
            alert(JSON.stringify(data));
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
    $.ajax({
      type: "POST",
      //url: ApiUrl.URL_API_DEVICE_BINDTOUSER+"/token/gh_9e62dd855eff",
      url: ApiUrl.URL_API_DEVICE_BINDTOUSER,
      data: JSON.stringify({openid:page_config.openid,qrcode:"http://we.qq.com/d/AQCucyi-lj3pE2_Zon5LVu2SJLr4IGZrMDcDtuvO", name:"dapeng1", latitude:"11.111111", longitude:"22.222222"}),
      //data: JSON.stringify({qrcode:""+this.state.qrcode, name:""+this.state.name, latitude:""+this.state.latitude, longitude:""+this.state.longitude}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {alert(JSON.stringify(data));},
      failure: function (errMsg) {alert(JSON.stringify(errMsg));}
    });
  }

  render() {
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
    	        <input type="text" className="form-control" id="longitude" placeholder="121.419947" readOnly/>
    	        <input type="text" className="form-control" id="latitude" placeholder="31.207947" readOnly/>
    	      </div>
    	      <div className="col-xs-4">
    	        <input type="button" className="btn btn-info text-wrap" value="进入地图手动选择位置"/>
    	      </div>
    	    </div>
    	    <div className="form-group">
    	      <div className="col-xs-12 text-center">
    	        <input type="button" className="btn btn-primary" onClick={this.postData} value="填写完确认提交"/>
    	      </div>
    	    </div>
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

