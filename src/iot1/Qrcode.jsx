import React, { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';

var ns = {};

ns.create = function(el, content) {
  var container_width = el.clientWidth;
  var container_height = el.clientHeight;

  var qrcode = new QRCode(el, {
    text: content,
    width: container_width,
    height: container_height,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
  });

};

export default class Qrcode extends Component {
  static defaultProps = {
    content: ""
  }
  static propTypes = {
    content: React.PropTypes.string.isRequired
  }
  state = {
  }

  constructor (props) {
    super (props);
  }
    
  componentDidMount() {
    var el = ReactDOM.findDOMNode(this);
    ns.create(el, this.props.content);
  }

  componentDidUpdate(prevProps, prevState) {
    //var el = ReactDOM.findDOMNode(this);
    //d3Chart.update(el, this.data, this.dispatcher);
  }

  render () {
    return (
      <div className="qrcode"></div>
    );
  }

}

