import React, { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';
//import { ReactHighcharts } from 'react-highcharts';
var ReactHighcharts = require('react-highcharts');

var config = {
  xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  series: [{
    data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 295.6, 454.4]
  }]
};

class PageDetailInfo extends Component {
  componentDidMount() {
    let chart = this.refs.chart.getChart();
    chart.series[0].addPoint({x: 'dec1', y: 100});
    chart.series[0].addPoint({x: 'dec2', y: 150});
    chart.series[0].addPoint({x: 'dec3', y: 200});
  }
  render() {
    return (
      <div>
        <ol className="breadcrumb">
          <li><a href="#">设备列表</a></li>
          <li className="active">设备详情（大棚1）</li>
        </ol>
        <div>
          <img src="{:FARM_TEMPLETE_PATH}/images/1.jpg" className="img-responsive" alt="Responsive image"/>
        </div>
        <div id="charts1" >
          <ReactHighcharts config={config} ref="chart"></ReactHighcharts>
        </div>
        <div id="charts2" />
      </div>
    );
  }
}

ReactDOM.render(
  <PageDetailInfo></PageDetailInfo>,
  document.getElementById('test')
);

require("file?name=[name].[ext]!./detail.html");
require("file?name=[name].[ext]!./charts.css");
