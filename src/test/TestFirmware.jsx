import React, { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';
import * as ApiUrl from '../Constants.jsx';

export default class TestFirmware extends Component {
  constructor (props) {
    super (props);
    this.state = {
      deviceArray: [],
      devices: { },
      selectedDeviceArray: [],

      firmwareArray: [],
      firmwares: { },
    };
  }

  componentDidMount () {
    console.log ("window.location="+window.location);
    this.getFirmwareList (0);
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

  getFirmwareList (pageIndex) {
    try {
    //alert ("try to get firmwares");
    console.log ("try to get firmwares");
    this.serverRequest = $.ajax({
      type: "POST",
      url: ApiUrl.URL_API_DEVICE_FW_LIST,
      data: JSON.stringify({page:pageIndex}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {
        //console.log ("getFirmwareList ok:"+JSON.stringify(data));
        //alert ("getFirmwareList ok:"+JSON.stringify(data));
        var firmwares = data.datas;
        if (firmwares !== null && firmwares !== undefined && firmwares.length > 0) {
          console.log ("got firmwares:"+firmwares.length);
          console.log (firmwares);
          //this.setState({firmwares:firmwares});

          var firmware_array = new Array();
          var firmware_data = {};
          for (var i in firmwares) {
            var firmware = firmwares[i];
            firmware_array.push (firmware.id);
            firmware_data[firmware.id] = firmware;
          }
          console.log (firmware_array);
          console.log (firmware_data);
          this.setState({firmwareArray:firmware_array, firmwares:firmware_data});
        } else {
          console.log ("got none firmware");
        }
      }.bind(this),
      failure: function (errMsg) {
        //alert(JSON.stringify(errMsg));
        console.log("getFirmwareList failure: "+JSON.stringify(errMsg));
      }.bind(this)
    });
    } catch (e) {
      console.log (e);
    }
  }

  uploadFile () {
    try {
    console.log ("uploadFile:");
    var self = this;
    var formData = new FormData();
    //formData.append('file', $('#file')[0].files[0]);
    formData.append('file', this.refs.file.files[0]);
    console.log (formData);
    $.ajax({
      url: ApiUrl.URL_API_DEVICE_FW_UPLOAD,
      type: 'POST',
      cache: false,
      data: formData,
      processData: false,
      contentType: false,
      success: function(res) {
        alert ("result: "+JSON.stringify(res));
        self.getFirmwareList (0);
      }, 
      failure: function(res) {
        alert ("result: "+JSON.stringify(res));
      }
    });
    } catch (e) {
      console.log (e);
    }
  }

  deleteFirmware (id) {
    try {
    var self = this;
    $.ajax({
      type: "POST",
      url: ApiUrl.URL_API_DEVICE_FW_DELETE,
      data: JSON.stringify({id:id}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",

      success: function(res) {
        alert ("result: "+JSON.stringify(res));
        self.getFirmwareList (0);
      }, 
      failure: function(res) {
        alert ("result: "+JSON.stringify(res));
        self.getFirmwareList (0);
      }
    });
    } catch (e) {
      console.log (e);
    }
  }

  handleUpgrade (url) {
    console.log ("selectedDeviceArray:"+JSON.stringify(this.state.selectedDeviceArray)+", url = "+url);
    try {
    var self = this;
    var devices = this.state.selectedDeviceArray.map((id, index)=>{
      var device = this.state.devices[id];
      return device && device.deviceid;
    });
    $.ajax({
      type: "POST",
      url: ApiUrl.URL_API_DEVICE_CMD_UPDATE,
      data: JSON.stringify({devices:devices, cmds:{update:url} }),
      //data: JSON.stringify({devices:devices, cmds:{update:url, setinterval:300} }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",

      success: function(res) {
        alert ("result: "+JSON.stringify(res));
      }, 
      failure: function(res) {
        alert ("result: "+JSON.stringify(res));
      }
    });
    } catch (e) {
      console.log (e);
    }
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

  renderFirmwareCheckBox (firmware) {
    return (
      <tr key={firmware.id}>
          <td scope="row">{firmware.id}</td>
          <td className="wordbreak">
            <a href={firmware.filepath}>{firmware.desc}</a>
          </td>
          <td>
            <button type="button" className="btn btn-default" onClick={this.deleteFirmware.bind(this,firmware.id)}>删除</button>
            <button type="button" className="btn btn-default" onClick={this.handleUpgrade.bind(this,firmware.filepath)}>升级</button>
          </td>
      </tr>
    )
  }

  renderDeviceCheckBox (device) {
    var checked = (this.state.selectedDeviceArray.indexOf (device.id) >= 0);
    return (
      <div className="input-group" key={device.id}>
        <span className="input-group-addon">
          <input type="checkbox" id={device.id} checked={checked} onChange={this.handleDeviceChange.bind(this)}/>
        </span>
        <input type="text" className="form-control" disable="true" value={device.info && device.info.name || device.deviceid}/>
      </div>
    )
  }

	render () {
    try {
    var list = this.state.firmwareArray.map ((id)=>{
      var firmware = this.state.firmwares[id];
      return this.renderFirmwareCheckBox(firmware);
    });

    var device_list = this.state.deviceArray.map ((id)=>{
      var device = this.state.devices[id];
      return this.renderDeviceCheckBox(device);
    });

	  return (
    <div>
      <div>
        <input ref="file" type="file" name="file"/>
        <input type="button" onClick={this.uploadFile.bind(this)} value="上传" />
      </div>
      <div><h3>升级文件列表</h3></div>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
            <tbody>
              {list}
            </tbody>
        </table>
      </div>
        <div><h3>设备列表</h3></div>
      <div>
        {device_list}
      </div>
    </div>
	  );
    } catch (e) {
      console.log (e);
    }
	}
}

