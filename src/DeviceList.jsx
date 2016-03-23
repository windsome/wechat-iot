import React, { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';
import * as ApiUrl from './Constants.jsx';

class DeviceList extends Component {
  constructor (props) {
    super (props);

  }

	render () {
	  return (
	  <div>
  	  <h1 className="text-center">设备列表</h1>
        <div className="container-fluid">
          <div className="row">
              <div className="col-xs-3"><strong>设备名称</strong></div>
              <div className="col-xs-6"><strong>设备状态</strong></div>
              <div className="col-xs-3"><strong>操作</strong></div>
          </div>
          <div className="row">
              <div className="col-xs-3">大棚1</div>
              <div className="col-xs-6">
                  <span className="text-nowrap">温度：26C </span>
                  <span className="text-nowrap">湿度：30% </span>
                  <span className="text-nowrap">光照：34200LM </span>
                  <span className="text-nowrap">CO2: 12223 </span>
              </div>
              <div className="col-xs-3"><a className="text-nowrap">删除</a><a className="text-nowrap">查看</a></div>
          </div>
          <div className="row">
              <div className="col-xs-3">大棚1</div>
              <div className="col-xs-6">
                  <span className="text-nowrap">温度：26C </span>
                  <span className="text-nowrap">湿度：30% </span>
                  <span className="text-nowrap">光照：34200LM </span>
                  <span className="text-nowrap">CO2: 12223 </span>
              </div>
              <div className="col-xs-3"><a className="text-nowrap">删除</a><a className="text-nowrap">查看</a></div>
          </div>
        </div>
        <div className="table-reponsive">
            <table className="table table-bordered table-striped">
                <thead>
                  <th>#</th>
                  <th className="text-nowrap">设备名称</th>
                  <th className="text-nowrap">设备状态</th>
                  <th>操作</th>
                </thead>
                <tbody>
                  <tr>
                      <th scope="row">1</th>
                      <td>大棚1</td>
                      <td>
                          <span className="text-nowrap">温度：26C </span>
                          <br/>
                          <span className="text-nowrap">湿度：30% </span>
                          <br/>
                          <span className="text-nowrap">光照：34200LM </span>
                          <br/>
                          <span className="text-nowrap">CO2: 12223 </span>
                          <br/>
                      </td>
                      <td><a className="text-nowrap">删除</a><a className="text-nowrap">查看</a></td>
                  </tr>
                  <tr>
                      <th scope="row">1</th>
                      <td>大棚1</td>
                      <td>
                          <span className="text-nowrap">温度：26C </span>
                          <span className="text-nowrap">湿度：30% </span>
                          <span className="text-nowrap">光照：34200LM </span>
                          <span className="text-nowrap">CO2: 12223 </span>
                      </td>
                      <td><a className="text-nowrap">删除</a><a className="text-nowrap">查看</a></td>
                  </tr>
                  <tr>
                      <th scope="row">1</th>
                      <td>大棚1</td>
                      <td>
                          <span>温度：26C </span>
                          <br/>
                          <span>湿度：30% </span>
                          <br/>
                          <span>光照：34200LM </span>
                          <br/>
                          <span>CO2: 12223 </span>
                      </td>
                      <td><a>删除</a><a>查看</a></td>
                  </tr>
                  <tr>
                      <th scope="row">1</th>
                      <td>大棚1</td>
                      <td>
                          <span>温度：26C </span>
                          <span>湿度：30% </span>
                          <span>光照：34200LM </span>
                          <span>CO2: 12223 </span>
                      </td>
                      <td><a>删除</a><a>查看</a></td>
                  </tr>
                </tbody>
            </table>
        </div>
	  </div>
	  );
	}
}

require("file?name=[name].[ext]!./DeviceList.html");

