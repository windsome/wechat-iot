import React, { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';

export default class DeviceScanComp extends Component {
  static defaultProps = {
    device: {
      id:0,
      productid:'',
      deviceid:'',
      uuid:'',
      qrcode:'',
      mac:'',
      openid:''
    },
    scanResult: ''
  }
  static PropTypes = {
    device: React.PropTypes.object.isRequired,
    scanResult: React.PropTypes.string,
    onScanQRCode: React.PropTypes.func.isRequired,
    onBindDevice: React.PropTypes.func.isRequired,
    gotoDeviceList: React.PropTypes.func.isRequired 
  }

  constructor (props) {
    super (props);

  }

  render() {
    var device = Object.assign({}, {
      id:0,
      productid:'',
      deviceid:'',
      uuid:'',
      qrcode:'',
      mac:'',
      openid:'',
      info: {
        name:'',
        longitude:'0.0',
        latitude:'0.0'
      }
    },this.props.device);

	  return (
	    <div>
    	  <h1 className="text-center">设备扫描</h1>
    	  <p className="text-indent">设备序号：点击扫描二维码，使用微信扫码，如果二维码模糊不清或丢失，可以手动输入id（为15位数字，中间不用加空格）</p>
    	  <p className="text-indent">地理位置：是自动填充的，不能编辑，可以点击“进入地图手动选择位置”在地图上拖拽红点进行手动修改</p>
   	      <form className="form-horizontal">
    	    <div className="form-group">
    	      <label htmlFor="deviceid" className="col-xs-3 control-label text-nowrap">设备序号</label>
    	      <div className="col-xs-5 no-padding-horizontal">
    	        <input type="text" className="form-control" id="deviceid" placeholder="0001 160302 00001" value={device.deviceid}/>
    	      </div>
    	      <div className="col-xs-4">
    	        <input type="button" className="btn btn-info" onClick={this.props.onScanQRCode} value="扫描二维码"/>
    	      </div>
    	    </div>
    	    <div className="form-group">
    	      <label htmlFor="longitude" className="col-xs-3 control-label text-nowrap">地理位置</label>
    	      <div className="col-xs-5 no-padding-horizontal">
    	        <input type="text" className="form-control" id="longitude" placeholder="111.111111" value={device.info.longitude} readOnly/>
    	        <input type="text" className="form-control" id="latitude" placeholder="22.222222" value={device.info.latitude} readOnly/>
    	      </div>
    	      <div className="col-xs-4">
    	        <input type="button" className="btn btn-info text-wrap" value="进入地图手动选择位置"/>
    	      </div>
    	    </div>
    	    <div className="form-group">
    	      <div className="col-xs-12 text-center">
    	        <input type="button" className="btn btn-primary" onClick={this.props.onBindDevice} value="填写完确认提交"/>
    	      </div>
    	    </div>
    	    { this.props.scanResult == 'fail' &&
            (
          <div className="form-group">
    	      <div className="col-xs-12 text-center">
    	        <span>扫描失败，是否超时，可重新进入此页面</span>
    	      </div>
    	    </div>)
          }
    	    { this.props.scanResult == 'ok' &&
            (
          <div className="form-group">
    	      <div className="col-xs-12 text-center">
    	        <span>扫描成功</span>
    	      </div>
    	    </div>)
          }
    	    <div className="form-group">
    	      <div className="col-xs-4 col-xs-push-8">
    	        <a href="#" className="btn btn-primary btn-xs active" role="button" onClick={this.props.gotoDeviceList}>进入设备列表</a>
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

