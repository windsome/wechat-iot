import React, { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';
import Qrcode from './Qrcode.jsx';
var classNames = require('classnames');


export default class Help extends Component {
  constructor (props) {
    console.log ("Help");
    super (props);
  }

  renderStep1 () {
    try {
      var qrcodeList = [
        "http://we.qq.com/d/AQCucyi-wRcI495tIWtjulYRyhLm4tQjjD2BskZ9", 
        "http://we.qq.com/d/AQCucyi-CBSS-PFLbKgUAqRhC1eUgTz9ekuYciRY",
        "http://we.qq.com/d/AQCucyi-lj3pE2_Zon5LVu2SJLr4IGZrMDcDtuvO",
        "http://we.qq.com/d/AQCucyi-DmaXwn2eDsXP76qXs56h7ZFg37vUoTUq",
        "http://we.qq.com/d/AQCucyi-iLaFTlibpnIirG_XNDuhLtyTVeApV2f6", 
        //"http://we.qq.com/d/AQCucyi-T9rDK3gBSmbeTwRw1L5WFfcFiLbzLk7h", 
        "http://we.qq.com/d/AQCucyi--1LfiBhNRuIFhlKRhUU-zmiYibmCzVkz"
      ];

      var qrcodeHtml = qrcodeList.map ((qrcode, index) => {
        return (
          <div key={index}>
            <div>{qrcode} </div>
            <Qrcode content={qrcode}/>
            <br/>
          </div>
        );
      });
      return (
      <div>
        <h3> 》》扫描设备</h3>
        <div>
          <p className="text-content">进入公众号后，点击下面菜单中的IotPage2进入管理网站，点击网站中的“扫描设备”按钮，进入扫描页面。</p>
          <p className="text-content">点击菜单后会直接弹出扫描框，去扫描二维码，扫描后，可填写设备名称，确定后即上传数据。</p>
          <p className="text-content">您在扫描页面按返回则退出扫描状态，点击本页中的扫描按钮可以再次进入扫描状态。</p>
          <p className="text-content">扫描完成后，停在扫描页面，如果设备有消息上发，则页面下面会列出该设备的消息。</p>
          <p className="text-content">如果扫描过程中出错，会有相应的错误信息，一般重新进即可继续扫，否则请联系管理员。</p>
          <p className="text-content">如果只是想体验，则可以扫描我们的测试设备，如下：</p>
        </div>
        <h7>体验设备的二维码</h7>
        <div>
          {qrcodeHtml}
        </div>
      </div>
      );
    } catch (e) {
      console.log ("error-renderSensors:");
      console.log (e);
    }
  }
  
  renderStep2 () {
    try {
      return (
      <div>
        <h3>》》设备列表</h3>
        <div>
          <p className="text-content">点击“设备列表”菜单后会进入列表页面，列表页面会动态更新显示每个设备所带的传感器数据。此数据为设备最近发送的数据。</p>
          <p className="text-content">在列表页面点击某个设备，会进入该设备的详情页面。</p>
          <p className="text-content">有时会无法显示列表，这是微信服务器的问题，重新进入即可，如果持续错误，会有相应的错误信息，请联系管理员告知错误情况。</p>
        </div>
      </div>
      );
    } catch (e) {
      console.log ("error-renderSensors:");
      console.log (e);
    }
  }
  
  renderStep3 () {
    try {
      return (
      <div>
        <h3>》》设备详情</h3>
        <div>
          <p className="text-content">详情页面描述了设备的具体情况，包含设备信息，传感器信息，历史数据信息等。</p>
        </div>
      </div>
      );
    } catch (e) {
      console.log ("error-renderSensors:");
      console.log (e);
    }
  }
  
  render () {
    try {
    console.log ("Help render()");
    return (
      <div>
        <div>{this.renderStep1()}</div>
        <div>{this.renderStep2()}</div>
        <div>{this.renderStep3()}</div>
      </div>
    );
    } catch (e) {
      console.log ("error-render:");
      console.log (e);
    }
  }

}

