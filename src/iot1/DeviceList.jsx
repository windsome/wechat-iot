import React, { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';
import * as ApiUrl from '../Constants.jsx';

export default class DeviceList extends Component {
  state = {
    list_status:'none',
    list_status_str:'',
    bind_status:'none',
    bind_status_str:'',
    devices: {},
    deviceArray: [],
    devices_datax: {},
    datax: {},
    endtime: Date.parse(new Date())/1000 - 24*60*60
  }

  constructor (props) {
    super (props);
    console.log ("DeviceList constructor");
    //this.devices = props.devices;
  }

  setInterval() {
    this.intervals.push(setInterval.apply(null, arguments));
  }
  componentWillMount() {
    this.intervals = [];
  }
  componentWillUnmount() {
    this.intervals.map(clearInterval);
    if(this.dataxRequest) this.dataxRequest.abort();
    if(this.deviceRequest) this.deviceRequest.abort();
  }
  componentDidMount() {
      try {
    //this.setInterval(this.updateSensorData.bind(this), 5000);
    this.getDeviceList();
      } catch (e) {
        console.log ("err msg="+JSON.stringify(e));
      }
  }
  updateSensorData() {
    try {
    //let url = ApiUrl.URL_API_DEVICE_GETDATAXLATESTLIST+"/deviceid/"+this.props.deviceid+"/begintime/"+this.state.endtime;
    let url = ApiUrl.URL_API_DEVICE_GETDATAXLATESTLIST+"/begintime/"+this.state.endtime;
    //console.log ("Datax url="+url);
    this.dataxRequest = $.ajax({
      type: "POST",
      url: url,
      data: JSON.stringify({devices:this.state.deviceArray}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (result) {
        console.log ("Datax updateSensorData:");
        console.log (result);
        if (result.response == 'success') {
          //console.log ("result.sensors="+JSON.stringify(result.sensors)+", length="+result.sensors.length);
          if (result.datax && result.datax.length > 0) {
            var datax = {};
            var devices_datax= {};

            result.datax.map ((data, index)=>{
              datax[data.id] = data;
              if (devices_datax[data.deviceid])
                devices_datax[data.deviceid].push(data.id);
              else {
                devices_datax[data.deviceid] = {};
                devices_datax[data.deviceid] = new Array (data.id);
              }
            });

            devices_datax = Object.assign ({}, this.state.devices_datax, devices_datax);
            datax = Object.assign ({}, this.state.datax, datax);
            console.log ("datax:");
            console.log (datax);
            this.setState ({datax:datax, devices_datax: devices_datax, endtime: result.endtime});
          } else {
            this.setState ({endtime: result.endtime});
          }
        } else {
          console.log ("Datax updateSensorData getDataxLatestList fail!");
        }
      }.bind(this),
      failure: function (errMsg) {
        console.log("fail:"+JSON.stringify(errMsg));
        this.setState({list_status:'fail',list_status_str:JSON.stringify(errMsg)});
      }.bind(this)
    });
    } catch (e) {
      console.log (e);
    }
  }

  getDeviceList () {
    try {
    //alert ("try to get devices");
    console.log ("try to get devices");
    this.setState({list_status:'init'});
    this.deviceRequest = $.ajax({
      type: "POST",
      url: ApiUrl.URL_API_DEVICE_GETDEVICELIST,
      data: JSON.stringify({page:0, start:0, count:10}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {
        console.log ("getDeviceList ok:"+JSON.stringify(data));
        //alert ("getDeviceList ok:"+JSON.stringify(data));
        var device_list = data.device_list;
        if (device_list && device_list.length > 0) {
          //console.log ("got devices:"+device_list.length);
          console.log (device_list);

          var deviceArray = new Array();
          var devices= {};
          device_list.map ((device, index)=>{
            var id = device.deviceid;
            deviceArray.push (id);
            devices[id] = device;
          });
          /*for (var i in devices) {
            var device = devices[i];
            deviceArray.push (device.id);
            devices[device.id] = device;
          }
          console.log (deviceArray);
          console.log (devices);*/
          this.setState({list_status:'ok', deviceArray:deviceArray, devices:devices});
          // get sensor data.
          this.updateSensorData();
          this.setInterval(this.updateSensorData.bind(this), 5000);
        } else {
          console.log ("got no devices");
          this.setState({list_status:'fail', list_status_str:data.response_str || ''});
        }
      }.bind(this),
      failure: function (errMsg) {
        console.log("fail:"+JSON.stringify(errMsg));
        this.setState({list_status:'fail', list_status_str:JSON.stringify(errMsg)});
      }.bind(this)
    });
    } catch (e) {
      console.log (e);
    }
  }

  handleUnbindDevice (device) {
    try {
    this.setState({bind_status:'init', bind_status_str:'begin unbind...'});
    wx.invoke('getWXDeviceTicket', {"deviceId":device.deviceid,"type":2}, function(res){
        var err_msg = res.err_msg;
        if (err_msg.indexOf(":ok") >= 0) {
          //alert ("get ticket1 = "+ res.ticket);
          this.setState({bind_status:'ticketok', bind_status_str:'get ticket ok'});
          $.ajax({
            type: "POST",
            url: ApiUrl.URL_API_DEVICE_UNBINDTOUSER2,
            data: JSON.stringify({ticket:res.ticket, device:device}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
              //alert(JSON.stringify(data));
              if (data.errcode == 0) {
                console.log ("unbind device ok:"+JSON.stringify(data));
                this.setState ({bind_status:'ok', bind_status_str:'unbind ok!'});
                this.getDeviceList ();
              } else {
                if (data.errcode > 40000) {
                  console.log ("weixin unbind error!");
                  this.setState ({bind_status:'fail', bind_status_str:'unbind fail'});
                } else if (data.errcode >=10000) {
                  console.log ("save to database error!");
                  this.setState ({bind_status:'dbfail', bind_status_str:'db fail'});
                } else if (data.errcode < 0) {
                  console.log ("system error!");
                  this.setState ({bind_status:'fail', bind_status_str:'system error!'});
                }
              }
            }.bind(this),
            failure: function (errMsg) {
              console.log ("bind fail: "+JSON.stringify(errMsg));
              this.setState ({bind_status:'fail', bind_status_str:JSON.stringify(errMsg)});
            }.bind(this)
          });
        } else {
          this.setState ({bind_status:'ticketfail', bind_status_str:errMsg.err_msg});
          console.log("get ticket fail!");
          //alert("get ticket fail!");
        }
      }.bind(this)
    );
    } catch (e) {
      console.log (e);
    }
  }

  showDetail(device) {
    if (this.props.showDetail)
      this.props.showDetail(device);
    else {
      console.log ("showDetail default, do nothing.");
    }
  }

  renderDevice (device, index) {
    try {
    var id = device.deviceid;
    var sensor_html = this.state.devices_datax[id] && 
      this.state.devices_datax[id].map ((dataxid, index)=>{
        var datax1 = this.state.datax[dataxid];
        var data_time = datax1 && datax1.time && (new Date(datax1.time*1000));
        var data_time_str = "";
        if (data_time) {
          data_time_str = (data_time.getMonth()+1)+"-"+data_time.getDate()+" "+data_time.getHours()+":"+data_time.getMinutes()+":"+data_time.getSeconds();
        }
        return (
          <span key={datax1.id} className="text-nowrap">{datax1.type}：{datax1.val}  <sub>{data_time_str}</sub> <br/></span>
        );
      });

    return (
      <tr key={index}>
        <td>
          <div>
            <a className="text-nowrap" onClick={(e)=>this.props.gotoDeviceDetail(device)}>{device.deviceid}</a>
          </div>
          <div>设备型号:{device.productid} -硬件版本：{device.hwver} -软件版本：{device.swver}</div>
          <div>{device.info && device.info.name || "未命名"} <a className="text-nowrap" onClick={this.handleUnbindDevice.bind(this,device)}>不再关注</a></div>

          <div>
            {sensor_html || "无数据"}
          </div>
        </td>
      </tr>
    );
    } catch (e) {
      console.log ("renderDevice");
      console.log (e);
    }
  }
  /*renderDevice2 (device, index) {
    try {
    var id = device.deviceid;
    var sensor_html = this.state.devices_datax[id] && 
      this.state.devices_datax[id].map ((dataxid, index)=>{
        // single sensor data.
        var datax1 = this.state.datax[dataxid];
        var data_time = datax1 && datax1.time && (new Date(datax1.time*1000));
        var data_time_str = "";
        if (data_time) {
          data_time_str = (data_time.getMonth()+1)+"-"+data_time.getDate()+" "+data_time.getHours()+":"+data_time.getMinutes()+":"+data_time.getSeconds();
        }
        return (
          <span key={datax1.id} className="text-nowrap">{datax1.type}：{datax1.val} - <sub>{data_time_str}</sub><br/></span>
        );
      });

    return (
      <tr key={index}>
          <td scope="row">1</td>
          <td className="wordbreak">{device.deviceid}</td>
          <td>
          {sensor_html}
          </td>
          <td><a className="text-nowrap">删除</a><a className="text-nowrap" onClick={(e)=>this.props.gotoDeviceDetail(device)}>查看</a></td>
      </tr>
    );
    } catch (e) {
      console.log ("renderDevice");
      console.log (e);
    }
  }*/
  renderDeviceList () {
    try {
    var deviceList2 = this.state.deviceArray.map((deviceid, index) => {
      if (this.state.devices[deviceid])
        return this.renderDevice (this.state.devices[deviceid], index);
    });
    return (
        <div className="table-responsive">
            <table className="table table-bordered table-striped">
                {/*<thead><tr>
                  <th>#</th>
                  <th className="text-nowrap">设备名称</th>
                  <th className="text-nowrap">设备状态</th>
                  <th>操作</th>
                </tr></thead>*/}
                <tbody>
                  {deviceList2}
                </tbody>
            </table>
        </div>
    );
    } catch (e) {
      console.log ("renderDeviceList");
      console.log (e);
    }
  }

	render () {
    //console.log ("DeviceList: render()");
    try {
    var deviceList = this.renderDeviceList ();
    var errMsg = '';
    if (this.state.list_status == 'fail')
      errMsg = "错误消息："+this.state.list_status_str;
    else
      errMsg = this.state.list_status_str;

    if (this.state.bind_status != 'none')
      errMsg += "  bind:"+this.state.bind_status_str;

	  return (
	  <div>
  	  <h1 className="text-center">设备列表</h1>
      {errMsg}
      {deviceList}
	  </div>
	  );
    } catch (e) {
      console.log ("render");
      console.log (e);
    }
	}
}

