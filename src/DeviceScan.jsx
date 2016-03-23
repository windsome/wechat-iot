import React, { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';
import * as ApiUrl from './Constants.jsx';

class DeviceScan extends Component {
  constructor (props) {
    super (props);

  }

  scanQRCode () {
    wx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res) {
        var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
        alert ("result="+result);
      }
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
    	        <input type="text" className="form-control" id="deviceID" placeholder="0001 160302 00001"/>
    	      </div>
    	      <div className="col-xs-4">
    	        <input type="button" className="btn btn-info" onClick={this.scanQRCode} value="扫描二维码"/>
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
    	        <input type="button" className="btn btn-primary" value="填写完确认提交"/>
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

