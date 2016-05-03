import React, { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var d3 = require('d3');

var ns = {};

ns.create = function(el, dataset, start, duration) {
  var container_width = el.clientWidth;
  var container_height = el.clientHeight;
  console.log ("el:");
  console.log (el);
//var margin = {top: 20, right: 100, bottom: 30, left: 100},
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = container_width - margin.left - margin.right,
      height = container_height - margin.top - margin.bottom;
      
    dataset.forEach(function(d) {
      d[0] = new Date(d[0]*1000);
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

var yScale = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d){ return d[1]; })])
    .range([height, 0]);

var customTimeFormat = d3.time.format.multi([
  [".%L", function(d) { return d.getMilliseconds(); }],
  [":%S", function(d) { return d.getSeconds(); }],
  ["%I:%M", function(d) { return d.getMinutes(); }],
  ["%I %p", function(d) { return d.getHours(); }],
  ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
  ["%b %d", function(d) { return d.getDate() != 1; }],
  ["%B", function(d) { return d.getMonth(); }],
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
    .x(function(d) { return xScale(d[0]); })
    .y(function(d) { return yScale(d[1]); });

var svg = d3.select(el).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
    dataset:[]
  }
  static propTypes = {
    start: React.PropTypes.number.isRequired,
    duration: React.PropTypes.number.isRequired,
  }
  state = {
  }

  constructor (props) {
    super (props);
    
/*this.dataset = [
  {x: 0, y: 5},
  {x: 1, y: 8},
  {x: 2, y: 13},
  {x: 3, y: 12},
  {x: 4, y: 16},
  {x: 5, y: 21},
  {x: 6, y: 18},
  {x: 7, y: 23},
  {x: 8, y: 24},
  {x: 9, y: 28},
  {x: 10, y: 35},
  {x: 11, y: 30},
  {x: 12, y: 32},
  {x: 13, y: 36},
  {x: 14, y: 40},
  {x: 15, y: 38},
];
*/
this.dataset = [[1460702114,25.88],[1460703199,26.55],[1460724286,26.71],[1460705382,26.79],[1460706469,26.82],[1460707553,26.82],[1460708637,26.79],[1460709726,26.79],[1460711815,26.82],[1460712899,26.83],[1460713989,26.83],[1460714073,27.42],[1460715159,27.63],[1460716245,27.58],[1460717349,27.49],[1460718467,27.43],[1460719556,27.39],[1460720640,27.31],[1460721725,27.32],[1460722818,27.28],[1460723907,27.23],[1460724002,27.19],[1460725087,27.15],[1460726171,27.11],[1460727271,27.08],[1460728364,27.07],[1460729454,27.05],[1460730543,27.03],[1460731630,27],[1460732719,27],[1460733811,26.99],[1460734909,26.98],[1460735997,26.98],[1460733082,26.94],[1460734167,26.93]];
  }

  componentDidMount() {
    var el = ReactDOM.findDOMNode(this);
    console.log ("start="+this.props.start+", duration="+this.props.duration+", dataset="+this.props.dataset.length);
    ns.create(el, this.props.dataset, this.props.start, this.props.duration);
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

