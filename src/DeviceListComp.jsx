import React, { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';

export default class DeviceListComp extends Component {
  static defaultProps = {
    deviceArray: [],
    devices: [],
    datax: {},
  }
  static propTypes = {
    deviceArray: React.PropTypes.array.isRequired,
    devices: React.PropTypes.object.isRequired,
    datax: React.PropTypes.object.isRequired,
    showDetail: React.PropTypes.func,
    gotoDeviceScan: React.PropTypes.func,
  }
  state = {
    count: this.props.deviceArray.length
  }

  constructor (props) {
    super (props);
    //this.devices = props.devices;
  }

  showDetail(device) {
    if (this.props.showDetail)
      this.props.showDetail(device);
    else {
      console.log ("showDetail default, do nothing.");
    }
  }

  renderDevice (device, index) {
    var uuid = device.uuid;
    var sensor_html = [];
    var sensor_data = this.props.datax[uuid];
    if (sensor_data != null) {
      //console.log ("render:");
      for (var prop in sensor_data) {
        if(!sensor_data.hasOwnProperty(prop)) continue; 
        //console.log ("sensor "+index+"["+prop+"]="+sensor_data[prop]);
        sensor_html.push (<span key={prop} className="text-nowrap">{prop}：{sensor_data[prop]} <br/></span>);
      }
    }
    return (
      <tr key={index}>
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
          <td><a className="text-nowrap">删除</a><a className="text-nowrap" onClick={this.props.gotoDeviceDetail.bind(this, device)}>查看</a></td>
      </tr>
    );
  }
  renderDeviceList () {
    var deviceList2 = this.props.deviceArray.map((deviceid, index) => {
      if (this.props.devices[deviceid])
        return this.renderDevice (this.props.devices[deviceid], index);
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
    var deviceList = this.renderDeviceList ();
	  return (
	  <div>
    	<a href="#" className="btn btn-primary btn-xs active" role="button" onClick={this.props.gotoDeviceScan}>扫描设备</a>
  	  <h1 className="text-center">设备列表</h1>
      {deviceList}
	  </div>
	  );
	}
}

