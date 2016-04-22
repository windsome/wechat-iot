import React, { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';
import * as ApiUrl from '../Constants.jsx';

export default class TestDatax extends Component {
  constructor (props) {
    super (props);
    this.state = {
      deviceArray: [],
      devices: { },
      selectedDeviceArray: [],
      updateInterval:60,
      updating: false
    };
    this.initSensorData ();
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
  componentDidMount () {
    console.log ("window.location="+window.location);
    this.getDeviceList (0);
  }

  getDeviceList (pageIndex) {
    //alert ("try to get devices");
    console.log ("try to get devices");
    this.serverRequest = $.ajax({
      type: "POST",
      url: ApiUrl.URL_API_DEVICE_GETDEVICELIST,
      data: JSON.stringify({page:pageIndex}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {
        //console.log ("getDeviceList ok:"+JSON.stringify(data));
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
          this.setState({deviceArray:device_array, devices:device_data});
        } else {
          console.log ("got none device");
        }
      }.bind(this),
      failure: function (errMsg) {
        //alert(JSON.stringify(errMsg));
        console.log("getDeviceList failure: "+JSON.stringify(errMsg));
      }.bind(this)
    });
  }

  handleDeviceChange (e) {
    console.log ("handleDeviceChange:");
    console.log (e);
    var id = e && e.target && e.target.id;
    var checked = e && e.target && e.target.checked;
    
    var updated = null;
    if (checked) {
      if (this.state.selectedDeviceArray.indexOf(id) < 0) {
        updated = this.state.selectedDeviceArray.slice(0);
        updated.push (id);
      }
    } else {
      updated = this.state.selectedDeviceArray.reduce ((previous, current, index, array) => {
        if (current != id) {
          previous.push(current);
        }
        return previous;
      }, []);
      /*updated = this.state.selectedDeviceArray.map ((item, index) => {
        if (item != id)
          return item;
      });*/
    }
    if (updated != null) {
      console.log ("updated:"+JSON.stringify(updated));
      this.setState ({selectedDeviceArray: updated});
    }
  }

  handleIntervalChange (e) {
    console.log ("handleIntervalChange:");
    console.log (e);
    var value = e && e.target && e.target.value;
    console.log ("value="+value);
    this.setState({updateInterval:value});
  }

  handleInsertDatax () {
    var updating = !this.state.updating;
    this.intervals.map(clearInterval);
    this.setState ({updating:updating});
    
    if (updating) {
      this.setInterval ( () => {
        this.state.selectedDeviceArray.map ((id, index) => {
          var device = this.state.devices[id];
          this.insertDatax (device);
        });
      }, this.state.updateInterval*1000);
    }
  }

  initSensorData () {
    // data format:
    //  | 1     | temp |    22.5400 | 1460852405 |
    //  | 2     | hum  |    52.8900 | 1460852405 |
    //  | 3     | lx   |   853.0000 | 1460852405 |
    //  | 4     | co2  |     0.0000 | 1460852405 |
    //  | 5     | bat  |  3788.9200 | 1460852405 |
    this.sensorTemp = {subid:'1', type:'temp', val:11.0};
    this.sensorHumi = {subid:'2', type:'hum', val:22.0};
    this.sensorLM = {subid:'3', type:'lx', val:33.0};
    this.sensorCO2 = {subid:'4', type:'co2', val:44.0};
  }

  randomSensorData () {
    var sed = Math.random () - 0.5;
    var stepTemp = sed * 10;
    var stepHumi = sed * 10;
    var stepLM = sed * 100;
    var stepCO2 = sed * 100;

    this.sensorTemp.val += stepTemp;
    this.sensorHumi.val += stepHumi;
    this.sensorLM.val += stepLM;
    this.sensorCO2.val += stepCO2;
    if (this.sensorTemp.val < -30 || this.sensorTemp.val > 100) this.sensorTemp.val -= 2*stepTemp;
    if (this.sensorHumi.val < 0 || this.sensorHumi.val > 100 ) this.sensorHumi.val -= 2*stepHumi;
    if (this.sensorLM.val < 0 || this.sensorLM.val > 30000) this.sensorLM.val -= 2*stepLM;
    if (this.sensorCO2.val < 0 || this.sensorCO2.val > 30000) this.sensorCO2.val -= 2*stepCO2;
  }

  insertDatax (device) {
    // data format: 
    // {"deviceid":"12345678901234567890123456789032", "sensors":[{"subid":"1","type":"temp","val":21.0},{"subid":"2","type":"humi","val":24.0},{"subid":"3","type":"co2","val":23224.0},{"subid":"4","type":"lm","val":11224.0}]}
    console.log ("insertDatax");
    this.randomSensorData ();
    var data = {deviceid: device.deviceid, sensors:[this.sensorTemp, this.sensorHumi,this.sensorLM, this.sensorCO2]};
    $.ajax({
      type: "POST",
      url: ApiUrl.URL_API_DEVICE_DATAX,
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {
        console.log ("insertDatax ok:"+JSON.stringify(data));
        //alert ("getDeviceList ok:"+JSON.stringify(data));
      }.bind(this),
      failure: function (errMsg) {
        //alert(JSON.stringify(errMsg));
        console.log("insertDatax failure: "+JSON.stringify(errMsg));
      }.bind(this)
    });
  }

  renderDeviceCheckBox (device) {
    var checked = (this.state.selectedDeviceArray.indexOf (device.id) >= 0);
    return (
      <div className="input-group" key={device.id}>
        <span className="input-group-addon">
          <input type="checkbox" id={device.id} checked={checked} onChange={this.handleDeviceChange.bind(this)}/>
        </span>
        <input type="text" className="form-control" disable="true" value={device.deviceid}/>
      </div>
    )
  }

	render () {
    var checkbox_list = this.state.deviceArray.map ((id)=>{
      var device = this.state.devices[id];
      return this.renderDeviceCheckBox(device);
    });
    var goOrStop = this.state.updating ? "Stop!" : "Go!";

	  return (
    <div>
      <form>
        <div>
          {checkbox_list}
        </div>
        <div>
          <div className="input-group"> 
            <input className="form-control" placeholder="set datax update interval..." type="text" onChange={this.handleIntervalChange.bind(this)} value={this.state.updateInterval}/>
            <span className="input-group-btn"> 
              <button className="btn btn-default" type="button" onClick={this.handleInsertDatax.bind(this)}>{goOrStop}</button>
            </span>
          </div>
        </div>
      </form>
    </div>
	  );
	}
}

