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
      updateInterval:60,
      updating: false
    };
  }

  componentDidMount () {
    console.log ("window.location="+window.location);
    this.getDeviceList (0);
  }

  getDeviceList (pageIndex) {
    try {
    //alert ("try to get devices");
    console.log ("try to get devices");
    this.serverRequest = $.ajax({
      type: "POST",
      url: ApiUrl.URL_API_DEVICE_FW_LIST,
      data: JSON.stringify({page:pageIndex}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {
        //console.log ("getDeviceList ok:"+JSON.stringify(data));
        //alert ("getDeviceList ok:"+JSON.stringify(data));
        var devices = data.datas;
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
        self.getDeviceList (0);
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
        self.getDeviceList (0);
      }, 
      failure: function(res) {
        alert ("result: "+JSON.stringify(res));
        self.getDeviceList (0);
      }
    });
    } catch (e) {
      console.log (e);
    }
  }

  renderDeviceCheckBox (device) {
    return (
      <tr key={device.id}>
          <td scope="row">1</td>
          <td className="wordbreak">
            <a href={device.filepath}>{device.desc}</a>
          </td>
          <td>
            <button type="button" className="btn btn-default" onClick={this.deleteFirmware.bind(this,device.id)}>删除</button>
          </td>
      </tr>
    )
  }

	render () {
    try {
    var list = this.state.deviceArray.map ((id)=>{
      var device = this.state.devices[id];
      return this.renderDeviceCheckBox(device);
    });

	  return (
    <div>
      <div>
        <input ref="file" type="file" name="file" accept="application/*,image/*"/>
        <input type="button" onClick={this.uploadFile.bind(this)} value="上传" />
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
            <tbody>
              {list}
            </tbody>
        </table>
      </div>
    </div>
	  );
    } catch (e) {
      console.log (e);
    }
	}
}

