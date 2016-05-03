import React, { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';
import Chart from './Chart.jsx';
import ChartLine from './ChartLine.jsx';
import * as ApiUrl from '../Constants.jsx';
var classNames = require('classnames');


export default class DeviceDetail extends Component {
  static defaultProps = {
    device: { },
  }
  static propTypes = {
    device: React.PropTypes.object.isRequired,
  }
  state = {
    sensors: [],
    dayDistance: 1,
    endtime: Date.parse(new Date())/1000 - 24*60*60
  }

  constructor (props) {
    console.log ("DeviceDetail");
    super (props);

    this.gaugeCharts = {};
    this.lineCharts = {};

    this.endtime = Date.parse(new Date())/1000 - 3*24*60*60;
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
    console.log("device:"+JSON.stringify(this.props.device));

    this.getDataxHistory ();
    this.setInterval(this.getDataxHistory.bind(this), 10000);
  }

  getDataxHistory () {
    try {
    //let url = "http://lancertech.net/farm/douchat/index.php?s=/Home/Device/getDatax/deviceid/gh_9e62dd855eff_d73d6a1d7b8553d9/begintime/1460700000";
    var deviceid = this.props.device && this.props.device.deviceid;
    if (!deviceid) {
      console.log ("no deviceid, not to getDataxHistory");
      return;
    }

    let url = ApiUrl.URL_API_DEVICE_GETDATAXHISTORY+"/deviceid/"+deviceid+"/begintime/"+this.endtime;
    this.serverRequest = $.get(url, function (result) {
      // update sensors. then trick a timed reget.
      console.log ("getDataxHistory:");
      console.log (result);
      if (result.response == 'success') {
        this.endtime = result.endtime;
        //this.setState ({sensors2:result.sensors});
        //this.setInterval(this.updateSensorData.bind(this), 10000);

        // merge sensors.
        if (result.sensors && result.sensors.length > 0) {
          var sensors_update= Object.assign([], this.sensors);
          result.sensors.map ((sensor, i) => {
            var subid = sensor.subid;
            var type = sensor.type;
            /*if (sensor.data && sensor.data.length > 0) {
              var value = sensor.data.map ((item) => {
                return [item[0]*1000, item[1]];
              });
              sensor.data = value;
            }*/
            var dest_sensor = -1;
            for (var i = 0; i< sensors_update.length; i++) {
              if (sensors_update[i].subid == subid) {
                dest_sensor = i;
                break;
              }
            }
            if (dest_sensor >= 0) {
              sensors_update[i].data = sensors_update[i].data.concat (sensor.data);
              // merge
            } else {
              // insert
              sensors_update.push (sensor);
            }
          });
          this.setState ({sensors: sensors_update});
        }
      }
    }.bind(this));
    } catch (e) {
      console.log ("error-getDataxHistory:");
      console.log (e);
    }
  }

  renderDeviceBaseInfo() {
    // id | productid | deviceid | uuid | qrcode | mac | openid | info  
    var device = this.props.device;
    return (
      <div>
        <h3>设备信息</h3>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <tbody>
              <tr>
                <td>设备名称</td>
                <td>{(device.info && device.info.name) || "未命名"}<sub>点击修改</sub></td>
              </tr>
              <tr>
                <td>设备微信ID</td>
                <td>{device.deviceid}</td>
              </tr>
              <tr>
                <td>设备UUID</td>
                <td>{device.uuid}</td>
              </tr>
              <tr>
                <td>产品类型</td>
                <td>{device.productid}</td>
              </tr>
              <tr>
                <td>二维码</td>
                <td>{device.qrcode}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    );
  }

  renderSensors () {
    try {
    var sensors = this.state.sensors && this.state.sensors.map ((sensor, index) => {
      var last_data = sensor.data && sensor.data.length > 0 && sensor.data[sensor.data.length - 1];
      var data_value = last_data && (last_data[1]) || "无数据";
      var data_time = last_data && (new Date(last_data[0]*1000));
      var data_time_str = "";
      if (data_time) {
        data_time_str = (data_time.getMonth()+1)+"-"+data_time.getDate()+" "+data_time.getHours()+":"+data_time.getMinutes()+":"+data_time.getSeconds();
      }
      return (
        <tr key={index}>
          <td>{sensor.type}-{sensor.subid} </td>
          <td>{data_value} <sub>{data_time_str}</sub></td>
        </tr>
      );
    });
    return (
    <div>
      <h3>传感器数据 </h3>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <tbody>
            {((sensors.length > 0) && sensors) || (<tr><td><div>无数据</div></td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
    );
    } catch (e) {
      console.log ("error-renderSensors:");
      console.log (e);
    }
  }
  
  setDayDistance (days) {
    if(this.serverRequest) this.serverRequest.abort();
    //endtime = Date.parse(new Date())/1000 - days*24*60*60;
    this.endtime = Date.parse(new Date())/1000 - days*24*60*60;
    this.setState({dayDistance: days, sensors: []});
  }

  renderLines () {
    var start = Date.parse(new Date())/1000 - this.state.dayDistance*24*60*60;
    var duration = this.state.dayDistance*24*60*60;
    var lines = this.state.sensors.map ((sensor, index) => {
      return (
        <ChartLine start={start} duration={duration} dataset={sensor.data}/>
      );
    });

    return (
      <div>
        <h3>传感器曲线</h3>
        <div className="btn-group" role="group" aria-label="Menu">
          <button type="button" className={classNames("btn", this.state.dayDistance==1?"btn-primary":"btn-default")} onClick={this.setDayDistance.bind(this, 1)}>1天</button>
          <button type="button" className={classNames("btn", this.state.dayDistance==10?"btn-primary":"btn-default")} onClick={this.setDayDistance.bind(this, 10)}>10天</button>
          <button type="button" className={classNames("btn", this.state.dayDistance==30?"btn-primary":"btn-default")} onClick={this.setDayDistance.bind(this, 30)}>30天</button>
          <button type="button" className={classNames("btn", this.state.dayDistance==365?"btn-primary":"btn-default")} onClick={this.setDayDistance.bind(this, 365)}>365天</button>
        </div>
        <div>
          {(lines.length>0 && lines) || '无曲线数据'}
          {/*<ChartLine />
          <ChartLine />
          <ChartLine />*/}
        </div>
      </div>
    );
  }

  render () {
    try {
    console.log ("DeviceDetail render()");
    return (
      <div>
        <div>
          {this.renderDeviceBaseInfo()}
        </div>
        <div> <Chart /> </div>
        <div> {this.renderSensors()} </div>
        <div> {this.renderLines()} </div>
      </div>
    );
    } catch (e) {
      console.log ("error-render:");
      console.log (e);
    }
  }

}

