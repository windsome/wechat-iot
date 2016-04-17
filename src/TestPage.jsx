if (typeof Object.assign != 'function') {
  (function () {
	  Object.assign = function (target) {
	   'use strict';
	   if (target === undefined || target === null) {
	     throw new TypeError('Cannot convert undefined or null to object');
	   }
	  
	   var output = Object(target);
	   for (var index = 1; index < arguments.length; index++) {
	     var source = arguments[index];
	     if (source !== undefined && source !== null) {
	       for (var nextKey in source) {
	         if (source.hasOwnProperty(nextKey)) {
	           output[nextKey] = source[nextKey];
	         }
	       }
	     }
	   }
	   return output;
	  };
  })();
}

import React, { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';
import TestDatax from './TestDatax.jsx';

class TestPage extends Component {
  constructor (props) {
    super (props);
    this.state = {
      action: 'none',
    };
  }

  componentDidMount () {
  }

  invokeTest (action) {
    this.setState ({action: action});
  }
  renderMenu () {
    return (
    <div className="btn-group" role="group" aria-label="Menu">
      <button type="button" className="btn btn-default" onClick={this.invokeTest.bind(this,'datax')}>插入数据</button>
      <button type="button" className="btn btn-default">测试2</button>
      <button type="button" className="btn btn-default">测试3</button>
    </div>
    );
  }
  renderAction () {
    var comp;
    if (this.state.action == 'datax')
      comp = (<TestDatax />);

    return comp;
  }

	render () {
    console.log ("action:"+this.state.action);
	  return (
    <div>
      <div>
      {this.renderMenu()}
      </div>
      <div>
      {this.renderAction()}
      </div>
    </div>
	  );
	}
}

	ReactDOM.render(
	  <TestPage />,
	  document.body
	);

require("file?name=[name].[ext]!./testPage.html");
require("file?name=[name].[ext]!./charts.css");
require("file?name=[name].[ext]!./mqttws31.js");
require("file?name=[name].[ext]!./bootstrap.min.css");
require("file?name=[name].[ext]!./jquery.min.js");

