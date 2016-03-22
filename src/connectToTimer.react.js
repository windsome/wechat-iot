//import React, { PropTypes, Component } from 'react'

export default function connectToTimer(Component) {
class TimerComponent extends Component {
  setInterval() {
    this.intervals.push(setInterval.apply(null, arguments));
  }
  componentWillMount() {
    this.intervals = [];
  }
  componentDidMount() {
  }
  componentWillUnmount() {
    this.intervals.map(clearInterval);
  }
  render() {
    return <Component {...this.props} {...this.state} />;
  }

}
TimerComponent.defaultState = {};
return TimerComponent;
}

