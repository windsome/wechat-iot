import React, { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';
//import { ReactHighcharts } from 'react-highcharts';
var ReactHighcharts = require('react-highcharts');
var HighchartsMore = require('highcharts-more');
// We tell HighchartsMore to use the same Highcharts object as ReactHighcharts
HighchartsMore(ReactHighcharts.Highcharts);
var HighchartsSolidGauge = require('highcharts/modules/solid-gauge');
HighchartsSolidGauge(ReactHighcharts.Highcharts);

var config = {
  /*chart: {
    type: 'spline'
  },*/
  title: {
    text: 'temperature line'
  },
  xAxis: {
    type: 'datetime',
    dateTimeLabelFormats: { // don't display the dummy year
      month: '%e. %b',
      year: '%b'
    },
    title: {
      text: 'Date'
    }
  },
  yAxis: {
    title: {
      text: 'Temp(C)'
    },
    min: -30,
    max: 50
  },

  series: [{
    name: 'temp1',
    data: [
      [Date.UTC(1970, 9, 21), 1],
      [Date.UTC(1970, 10, 4), 3.28],
      [Date.UTC(1970, 10, 9), 0.25],
      [Date.UTC(1970, 10, 27), 0.2],
      [Date.UTC(1970, 11, 2), 0.28],
      [Date.UTC(1970, 11, 26), 0.28],
      [Date.UTC(1970, 11, 29), 0.47],
      [Date.UTC(1971, 0, 11), 0.79],
      [Date.UTC(1971, 0, 26), 0.72],
      [Date.UTC(1971, 1, 3), 1.02],
      [Date.UTC(1971, 1, 11), 1.12],
      [Date.UTC(1971, 1, 25), 1.2],
      [Date.UTC(1971, 2, 11), 1.18],
      [Date.UTC(1971, 3, 11), 1.19],
      [Date.UTC(1971, 4, 1), 1.85],
      [Date.UTC(1971, 4, 5), 2.22],
      [Date.UTC(1971, 4, 19), 1.15],
      [Date.UTC(1971, 4, 30), 0]
    ]
  }]
};

var gaugeOptions = {

        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false
        },

        title: {
            text: 'Speedometer'
        },

        pane: {
            startAngle: -150,
            endAngle: 150,
            background: [{
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF'],
                        [1, '#333']
                    ]
                },
                borderWidth: 0,
                outerRadius: '109%'
            }, {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#333'],
                        [1, '#FFF']
                    ]
                },
                borderWidth: 1,
                outerRadius: '107%'
            }, {
                // default background
            }, {
                backgroundColor: '#DDD',
                borderWidth: 0,
                outerRadius: '105%',
                innerRadius: '103%'
            }]
        },

        // the value axis
        yAxis: {
            min: 0,
            max: 200,

            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',

            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto'
            },
            title: {
                text: 'km/h'
            },
            plotBands: [{
                from: 0,
                to: 60,
                //color: '#55BF3B' // green
                color: '#DF5353' // red
            }, {
                from: 60,
                to: 160,
                //color: '#DDDF0D' // yellow
                color: '#55BF3B' // green
            }, {
                from: 160,
                to: 200,
                color: '#DF5353' // red
            }]
        },

        series: [{
            name: 'Speed',
            data: [80],
            tooltip: {
                valueSuffix: ' km/h'
            }
        }]

    };
    
    /*
    var gaugeOptions = {
        chart: {
            type: 'solidgauge'
        },
        title: null,
        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (ReactHighcharts.theme && ReactHighcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },
        tooltip: {
            enabled: false
        },
        // the value axis
        yAxis: {
            stops: [
                [0.1, '#55BF3B'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#DF5353'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    };

    var gauge1Options = {
        yAxis: {
            min: 0,
            max: 200,
            title: {
                text: 'Speed'
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'Speed',
            data: [80],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((ReactHighcharts.theme && ReactHighcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                       '<span style="font-size:12px;color:silver">km/h</span></div>'
            },
            tooltip: {
                valueSuffix: ' km/h'
            }
        }]

    };
    */
var globe_day = 0;

class PageDetailInfo extends Component {
  constructor (props) {
    super (props);

    this.sensorArray = new Array();
    this.sensorArray[0] = {id:'0001', type:'temp', value:10};
    this.sensorArray[1] = {id:'0002', type:'hum', value:100};
    this.sensorArray[2] = {id:'0003', type:'co2', value:80};

    this.charts = {};

    this.imgs = new Array();
    this.imgs[0] = '1.jpg';
    this.imgs[1] = '2.jpg';
    this.imgs[2] = '3.jpg';
    this.imgs[3] = '4.jpg';
  }
  setInterval() {
    this.intervals.push(setInterval.apply(null, arguments));
  }
  componentWillMount() {
    this.intervals = [];
  }
  componentWillUnmount() {
    this.intervals.map(clearInterval);
    this.serverRequest.abort();
  }
  /*componentDidMount() {
    let chart = this.refs.chart.getChart();
    chart.series[0].addPoint({x: Date.UTC(1971, 5, 10), y: 10});
    chart.series[0].addPoint({x: Date.UTC(1971, 5, 15), y: 15});
    chart.series[0].addPoint({x: Date.UTC(1971, 5, 20), y: 20});
  }*/
  addPoint() {
    let chart = this.refs.chart.getChart();

    let sed = Math.random();
    let val = Math.round(sed * 20);
    let month = Math.round(sed * 12);
    let day = Math.round(sed * 30);
    //console.log ("val="+val+", month="+month+",day="+day);

    //chart.series[0].addPoint({x: Date.UTC(1971, month, day), y: val});
    chart.series[0].removePoint(0);
    chart.series[0].addPoint({x: Date.UTC(1971, 5, globe_day++), y: val});
  }
  changeGauge () {
    let chart = this.refs.gauge1.getChart();
    var point,
        newVal,
        inc;

    if (chart) {
        point = chart.series[0].points[0];
        inc = Math.round((Math.random() - 0.5) * 100);
        newVal = point.y + inc;

        if (newVal < 0 || newVal > 200) {
            newVal = point.y - inc;
        }

        point.update(newVal);
    }

    //console.log (this.charts);
    this.sensorArray.map ( (sensor, i) => {
      var id = sensor.id;
      var type = sensor.type;
      let chart = this.charts[id];
      if (chart) {
        let gauge = chart.getChart();
        if (gauge) {
          let point = gauge.series[0].points[0];
          let sed = Math.random();
          let val = Math.round(sed * 200);
          point.update(val);
        }
      }
    });
    /*this.charts.map ((chart, i) => {
      let gauge = chart.getChart();
      if (gauge) {
        let point = gauge.series[0].points[0];
        let sed = Math.random();
        let val = Math.round(sed * 200);
        point.update(val);
      }
    });*/
  }
  componentDidMount() {
    this.setInterval(this.addPoint.bind(this), 2000);
    this.setInterval(this.changeGauge.bind(this), 2000);
    //let url = this.props.source;
    //let url = "https://api.github.com/_private/browser/stats"
    //let url = "https://avatars1.githubusercontent.com/u/226573?v=3&s=40"
    let url = "https://assets-cdn.github.com/assets/frameworks-2d635ad8ba43f32e07aa1fd713d692eff9a2e78dcd63daa5b580c38b36df3fdb.css"
    this.serverRequest = $.get(url, function (result) {
      /*var lastGist = result[0];
      this.setState({
        username: lastGist.owner.login,
        lastGistUrl: lastGist.html_url
      });*/
      //console.log("result="+result);
    }.bind(this));
  }
  render() {
    //var gauge1 = Object.assign ({}, gaugeOptions, gauge1Options);
    var that = this;
    var gauge1 = gaugeOptions;
    return (
      <div>
        <ol className="breadcrumb">
          <li><a href="#">设备列表</a></li>
          <li className="active">设备详情（大棚1）</li>
        </ol>
        <div>
          <img src="1.jpg" className="img-responsive" alt="Responsive image"/>
        </div>
        <div id="gauge1" className="row">
          <div className="col-xs-6 col-sm-3"><ReactHighcharts config={gauge1} ref="gauge1"></ReactHighcharts></div>
          { this.sensorArray.map((sensor, i) => {
            var id = sensor.id;
            var type = sensor.type;
            return (
              <div className="col-xs-6 col-sm-3"><ReactHighcharts config={gauge1} ref={(ref) => {that.charts[id]= ref; console.log("id="+id+",ref="+ref)} }></ReactHighcharts></div>
            )
          } ) }
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
require("file?name=[name].[ext]!./1.jpg");
