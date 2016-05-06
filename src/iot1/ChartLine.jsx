import React, { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var d3 = require('d3');

var ns = {};

ns.create = function(el, sensor, start, duration) {
  var container_width = el.clientWidth;
  var container_height = el.clientHeight;
  var dataset = sensor.data;
  var title = sensor.type+"-"+sensor.subid+"历史数据(最近"+Number(duration/24/60/60)+"天)";
  console.log ("el:");
  console.log (el);
//var margin = {top: 20, right: 100, bottom: 30, left: 100},
  var margin = {top: 30, right: 20, bottom: 30, left: 50},
      width = container_width - margin.left - margin.right,
      height = container_height - margin.top - margin.bottom;
      
    dataset.forEach(function(d) {
      //d[0] = new Date(d[0]*1000);
      d.time = new Date(d[0]*1000);
    });

  try {
/*var xScale = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d){ return d.x; })])
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d){ return d.y; })])
    .range([height, 0]);

*/
var start_date = new Date (start*1000)
var xScale = d3.time.scale()
    .domain([new Date (start*1000), new Date ((start+duration)*1000)])
    .range([0, width]);
    
//    .domain(d3.extent(dataset, function(d) { return d[0]; }))

var yMin = d3.min (dataset, function(d){ return d[1]; });
    yMin = yMin < 0 ? yMin : 0;
var yScale = d3.scale.linear()
    .domain([yMin, d3.max(dataset, function(d){ return d[1]; })])
    .range([height, 0]);

var customTimeFormat = d3.time.format.multi([
  [".%L", function(d) { return d.getMilliseconds(); }],
  [":%S", function(d) { return d.getSeconds(); }],
  ["%I:%M", function(d) { return d.getMinutes(); }],
  ["%H", function(d) { return d.getHours(); }],
  ["%d", function(d) { return d.getDay() && d.getDate() != 1; }],
  ["%m-%d", function(d) { return d.getDate() != 1; }],
  ["%m", function(d) { return d.getMonth(); }],
  ["%Y", function() { return true; }]
]);

var ticks = Number(width / 40);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .innerTickSize(-height)
    .outerTickSize(0)
    .ticks(ticks)
    .tickFormat(customTimeFormat)
    .tickPadding(10);

//    .ticks(d3.time.minutes, 15)

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .innerTickSize(-width)
    .outerTickSize(0)
    .tickPadding(10);

/*var line = d3.svg.line()
    .x(function(d) { return xScale(d.x); })
    .y(function(d) { return yScale(d.y); });
    */

var line = d3.svg.line()
    .x(function(d) { return xScale(d.time); })
    .y(function(d) { return yScale(d[1]); });

//    .x(function(d) { return xScale(d[0]); })

var svg = d3.select(el).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "underline")  
    .text(title);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)

  svg.append("path")
      .data([dataset])
      .attr("class", "line")
      .attr("d", line);
      
  } catch (e) {
    console.log ("error:");
    console.log (e);
  }
};

ns.update = function(el, data, dispatcher) {
};

ns.destroy = function(el) {

};


export default class ChartLine extends Component {
  static defaultProps = {
    start: -1,
    duration: -1,
    sensor:{data:[]}
  }
  static propTypes = {
    start: React.PropTypes.number.isRequired,
    duration: React.PropTypes.number.isRequired,
    sensor: React.PropTypes.object
  }
  state = {
  }

  constructor (props) {
    super (props);
    
  }

  componentDidMount() {
    var el = ReactDOM.findDOMNode(this);
    console.log ("start="+this.props.start+", duration="+this.props.duration+", dataset="+(this.props.sensor&&this.props.sensor.data && this.props.sensor.data.length));
    ns.create(el, this.props.sensor, this.props.start, this.props.duration);
  }

  componentDidUpdate(prevProps, prevState) {
    //var el = ReactDOM.findDOMNode(this);
    //d3Chart.update(el, this.data, this.dispatcher);
  }

  render () {
    return (
      <div className="ChartLine"></div>
    );
  }

}

