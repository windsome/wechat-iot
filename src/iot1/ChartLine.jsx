import React, { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var d3 = require('d3');

//var margin = {top: 20, right: 100, bottom: 30, left: 100},
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 360 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
      
var ns = {};

ns.create = function(el, dataset) {
  try {
var xScale = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d){ return d.x; })])
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d){ return d.y; })])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .innerTickSize(-height)
    .outerTickSize(0)
    .tickPadding(10);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .innerTickSize(-width)
    .outerTickSize(0)
    .tickPadding(10);

var line = d3.svg.line()
    .x(function(d) { return xScale(d.x); })
    .y(function(d) { return yScale(d.y); });

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
    width: '100%',
    height: '300px'
  }
  static propTypes = {
    width: React.PropTypes.string.isRequired,
    height: React.PropTypes.string.isRequired,
  }
  state = {
  }

  constructor (props) {
    super (props);
    
this.dataset = [
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


  }

  componentDidMount() {
    var el = ReactDOM.findDOMNode(this);
    ns.create(el, this.dataset);
  }

  componentDidUpdate(prevProps, prevState) {
    //var el = ReactDOM.findDOMNode(this);
    //d3Chart.update(el, this.data, this.dispatcher);
  }

  render () {
    return (
      <div className="Chart"></div>
    );
  }

}

