import React, { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';
import * as ApiUrl from '../Constants.jsx';

class Datax extends Component {
  static defaultProps = {
    deviceid: ''
  }
  constructor (props) {
    super (props);

    this.state = {
      sensors2: [],
      endtime: Date.parse(new Date())/1000
    };
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
    console.log("deviceid:"+this.props.deviceid);
    this.setInterval(this.updateSensorData.bind(this), 5000);
  }
  updateSensorData() {
    let url = ApiUrl.URL_API_DEVICE_GETDATAXHISTORY+"/deviceid/"+this.props.deviceid+"/begintime/"+this.state.endtime;
    console.log ("Datax url="+url);
    this.serverRequest = $.get(url, function (result) {
      // update sensors. then trick a timed reget.
      console.log ("Datax updateSensorData getDataxHistory:"+JSON.stringify(result));
      //console.log (result);
      if (result.response == 'success') {
    try {
        //console.log ("result.sensors="+JSON.stringify(result.sensors)+", length="+result.sensors.length);
        if (result.sensors && result.sensors.length > 0) {
          var sensors2 = Object.assign([], this.state.sensors2);
          result.sensors.map ((sensor, index)=>{
            //console.log ("windsome sensor="+JSON.stringify(sensor));
            var found = sensors2.reduce ((previous, current, index, arr) => {
              if (current.subid == sensor.subid) {
                return current;
              }
              return previous;
            }, null);
            //console.log ("found="+JSON.stringify(found));

            if (found) {
              if (found.data)
                found.data = found.data.concat (sensor.data);
              else
                found['data'] = sensor.data;
            } else {
              sensors2.push (sensor);
            }
          });
          this.setState ({sensors2:sensors2, endtime: result.endtime});
        } else {
          this.setState ({endtime: result.endtime});
        }
    } catch (e) {
      console.log ("err msg="+JSON.stringify(e));
    }
      }
    }.bind(this));
  }

  render () {
    var sensors = this.state.sensors2.map ((sensor, index) => {
      var datas = sensor.data.map ((data, index) => {
        return (
          <div key={index}>{data[0]} => {data[1]} </div>
        );
      });
      return (
        <div key={index}>
          <div>{sensor.subid}-{sensor.type} => </div>
          <div>{datas}</div>
        </div>
      );
    });
    return (
    <div>
      {sensors}
    </div>
    );
  }
}

var SCAN_STRING = {
  "none": "",
  "init": "正在扫描",
  "scanok": "扫描成功！",
  "ok": "获取设备成功！",
  "fail": "扫描失败！"
};

var LOCATION_STRING = {
  "none": "",
  "init": "正在定位",
  "ok": "定位成功！",
  "fail": "定位失败！"
};

var BIND_STRING = {
  "none": "",
  "init": "正在绑定",
  "ticketok": "ticket已获得，继续绑定",
  "ticketfail": "ticket失败，绑定失败",
  "dbfail": "绑定成功，数据入库失败，可重新扫描绑定",
  "ok": "绑定成功！",
  "fail": "绑定失败！可重新扫描绑定"
};

export default class DeviceScan extends Component {
  constructor (props) {
    super (props);

    this.state = {
      device: {
        id: 0,
        qrcode:''
      },
      scan_status: 'none',
      location_status: 'none',
      bind_status: 'none'
    };
  }

  componentDidMount () {
    console.log ("DeviceScan componentDidMount");
    this.handleScanQRCode();
  }

  handleScanQRCode () {
    try {
    this.setState ({scan_status: 'init', location_status:'none', bind_status:'none', device: {}});
    wx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res) {
        var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
        console.log ("scan ok: result="+ result);
        //this.setState ({scan_status:'scanok', deivce:{qrcode: result}});
        this.setState ({scan_status:'scanok'});

        $.ajax({
          type: "POST",
          url: ApiUrl.URL_API_DEVICE_GETBYQRCODE,
          data: JSON.stringify({qrcode:result}),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (data) {
            //alert(JSON.stringify(data));
            console.log ("get device info by qrcode ok!");
            var device = data.devices && data.devices[0];
            if (device) {
              this.setState ({scan_status:'ok', device:device});
              console.log ("scanQRCode:");
              console.log (device);

              //setTimeout(this.getLocation.bind(this), 10);
              this.getLocation();
            } else {
              console.log ("not find device, get device fail!");
              this.setState ({scan_status:'fail'});
            }
          }.bind(this),
          failure: function (errMsg) {
            console.log ("get device info fail! "+JSON.stringify(errMsg));
            this.setState ({scan_status:'fail'});
          }.bind(this)
        });
      }.bind(this),
      cancel: function() {
        console.log ("you cancel scan!");
        this.setState ({scan_status:'none'});
      }.bind(this)
    });
    } catch (err) {
      console.log ("err:"+JSON.stringify(err));
    }
  }

  getLocation () {
    console.log ("try to getLocation");
    this.setState ({location_status:'init'});
    wx.getLocation({
      type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      success: function (res) {
        console.log ("getLocation ok! res="+JSON.stringify(res));
        //alert ("success get location");
        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        var speed = res.speed; // 速度，以米/每秒计
        var accuracy = res.accuracy; // 位置精度
        var device_info = Object.assign ({}, this.state.device.info || {}, {latitude:latitude, longitude:longitude, speed:speed, accuracy:accuracy});
        var device = Object.assign ({}, this.state.device, {info:device_info});
        this.setState({location_status:'ok', device:device});
      }.bind(this)
    });
    console.log ("after getLocation, check whether async.");
  }

  handleBindDevice () {
    //alert ("postData="+this.state.deviceid);
    if (this.state.device.deviceid == '') {
      alert ("you must scan qrcode first!");
      return;
    }
    this.setState({bind_status:'init'});
    wx.invoke('getWXDeviceTicket', {"deviceId":this.state.device.deviceid,"type":1}, function(res){
        var err_msg = res.err_msg;
        if (err_msg.indexOf(":ok") >= 0) {
          //alert ("get ticket1 = "+ res.ticket);
          this.setState({bind_status:'ticketok'});
          $.ajax({
            type: "POST",
            url: ApiUrl.URL_API_DEVICE_BINDTOUSER2,
            //data: JSON.stringify({qrcode:"http://we.qq.com/d/AQCucyi-lj3pE2_Zon5LVu2SJLr4IGZrMDcDtuvO", name:"dapeng1", latitude:"11.111111", longitude:"22.222222"}),
            //data: JSON.stringify({ticket:res.ticket, deviceid:this.state.deviceid, qrcode:this.state.qrcode, name:this.state.name, latitude:this.state.latitude, longitude:this.state.longitude}),
            data: JSON.stringify({ticket:res.ticket, device:this.state.device}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
              //alert(JSON.stringify(data));
              if (data.errcode == 0) {
                console.log ("bind device ok:"+JSON.stringify(data));
                this.setState ({bind_status:'ok'});
              } else {
                if (data.errcode > 40000) {
                  console.log ("weixin bind error!");
                  this.setState ({bind_status:'fail'});
                } else if (data.errcode >=10000) {
                  console.log ("save to database error!");
                  this.setState ({bind_status:'dbfail'});
                } else if (data.errcode < 0) {
                  console.log ("system error!");
                  this.setState ({bind_status:'fail'});
                }
              }
            }.bind(this),
            failure: function (errMsg) {
              console.log ("bind fail: "+JSON.stringify(errMsg));
              this.setState ({bind_status:'fail'});
            }.bind(this)
          });
        } else {
          this.setState ({bind_status:'ticketfail'});
          console.log("get ticket fail!");
          alert("get ticket fail!");
        }
      }.bind(this)
    );
  }

  handleChangeName(event) {
    var device_info = Object.assign ({}, this.state.device.info || {}, {name:event.target.value});
    var device = Object.assign ({}, this.state.device, {info:device_info});
    this.setState({device:device});
  }

  render() {
    console.log ("DeviceScan render state="+JSON.stringify(this.state));
    var device = this.state.device;

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
    	        <input type="button" className="btn btn-info" onClick={this.handleScanQRCode.bind(this)} value="扫描二维码"/>
    	      </div>
    	    </div>
    	    <div className="form-group">
    	      <label htmlFor="longitude" className="col-xs-3 control-label text-nowrap">地理位置</label>
    	      <div className="col-xs-5 no-padding-horizontal">
    	        <input type="text" className="form-control" id="longitude" placeholder="111.111111" value={(device.info && device.info.longitude)||""} readOnly/>
    	        <input type="text" className="form-control" id="latitude" placeholder="22.222222" value={(device.info && device.info.latitude)||""} readOnly/>
    	      </div>
    	      <div className="col-xs-4">
    	        <input type="button" className="btn btn-info text-wrap" value="进入地图手动选择位置"/>
    	      </div>
    	    </div>
    	    <div className="form-group">
    	      <label htmlFor="deviceid" className="col-xs-3 control-label text-nowrap">设备名称</label>
    	      <div className="col-xs-5 no-padding-horizontal">
    	        <input type="text" className="form-control" id="devicename" placeholder="大棚1/清河大棚" value={device.info && device.info.name} onChange={this.handleChangeName.bind(this)}/>
    	      </div>
    	    </div>
    	    <div className="form-group">
    	      <div className="col-xs-12 text-center">
    	        <input type="button" className="btn btn-primary" onClick={this.handleBindDevice.bind(this)} value="填写完确认提交"/>
    	      </div>
    	    </div>
          <div className="form-group">
    	      <div className="col-xs-12 text-center">
    	        <span>{SCAN_STRING[this.state.scan_status]}</span>
    	        <span>{LOCATION_STRING[this.state.location_status]}</span>
    	        <span>{BIND_STRING[this.state.bind_status]}</span>
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
        { this.state.bind_status == 'ok' &&
        (<div>
          <h4>等待设备消息上报</h4>
          <p>您可以重启设备，看是否有消息出现，有消息则表示扫描设备成功，否则可能有网络问题存在</p>
          <Datax deviceid={this.state.device.deviceid}> </Datax>
        </div>)
        }
	    </div>
	  );
  }
}

