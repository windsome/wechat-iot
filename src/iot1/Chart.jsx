import React, { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';
var _ = require('lodash');
var d3Chart = require('./d3Chart.jsx');

export default class Chart extends Component {
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
    
    this.data = {
"name":"大棚1",
"children":
[
	{ 
	  "name":"内部传感器" , 
  	  "children":
  	  [
	  	  	{"name":"温度1" },
	  	  	{"name":"湿度1" },
	  	  	{"name":"光照1" },
	  	  	{"name":"CO2-1" }
  	  ] 
  	},
	{ 
	  "name":"内部控制器" , 
  	  "children":
  	  [
	  	  	{"name":"开关1" },
	  	  	{"name":"开关2" },
	  	  	{"name":"开关3" },
	  	  	{"name":"开关4" }
  	  ] 
  	},
	{ 
	  "name":"外部传感器" , 
  	  "children":
  	  [
	  	  	{"name":"土壤温度" },
	  	  	{"name":"土壤湿度" },
	  	  	{"name":"植物茎流" }
  	  ] 
  	},
	{ 
	  "name":"外部控制器" , 
  	  "children":
  	  [
	  	  	{"name":"风扇1" },
	  	  	{"name":"遮阳罩" },
	  	  	{"name":"窗户" }
  	  ] 
  	}
]
};

  }

  componentDidMount() {
    var el = ReactDOM.findDOMNode(this);
    var dispatcher = d3Chart.create(el, {
      width: this.props.width,
      height: this.props.height
    }, this.data);
    this.dispatcher = dispatcher;
  }

  componentDidUpdate(prevProps, prevState) {
    var el = ReactDOM.findDOMNode(this);
    d3Chart.update(el, this.data, this.dispatcher);
  }

  render () {
    return (
      <div className="Chart"></div>
    );
  }

}

