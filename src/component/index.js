import React, { Component } from 'react';
import animal from './video.mp4';
import { notification } from 'antd';
import Zmage from 'react-zmage';
import $ from 'jquery';
import './index.css';

class Video extends Component {
  constructor() {
    super();
    this.state = {};
  }

  clickCanvas = (e) => {
    const mousePos = this.mouseCoords(e);
    this.makeArc(mousePos.x, mousePos.y);
  };

  mouseCoords = (ev) => {
    let e = ev || window.event;
    let canvasBox = $('#canvasBox');
    let scrollX = canvasBox.offset().left; //偏移量
    let scrollY = canvasBox.offset().top;
    console.log(scrollX, 'scrollx');
    let x = e.pageX - scrollX;
    let y = e.pageY - scrollY;
    return { x: x, y: y };
  };

  //自动播放 模拟直播视屏
  onplay = () => {
    const video = document.getElementById('videoElement');
    video.addEventListener(
      'ended',
      function () {
        video.load();
      },
      false,
    );
  };

  // 生成红框
  makeArc = (x, y) => {
    const myCanvas = document.getElementById('myCanvas');
    const videoElement = document.getElementById('videoElement');
    const canvasBox = $('#canvasBox');
    const canvasWidth = canvasBox.width();
    const canvasHeight = canvasBox.height();
    const videoHieght = videoElement.videoHeight //原始视频高度
    const videoScale = videoHieght / canvasHeight; //算出比例 用来计算红框在视屏中的大小
    myCanvas.height = canvasHeight;
    myCanvas.width = canvasWidth;
    const RECT_WIDTH = 40; //设置长度
    const redBox = RECT_WIDTH / videoScale; 
    const ctx = myCanvas.getContext('2d');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight); //清空给定矩形内的指定像素。
    ctx.beginPath();
    ctx.rect(x - redBox / 2, y - redBox / 2, redBox, redBox);//画矩形
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();
    this.handleScissor(x, y);
  };

  //截图功能
  handleScissor = (x, y) => {
    let video = document.getElementById('videoElement');
    const canvas_ouput = document.createElement('canvas');
    canvas_ouput.width = video.videoWidth;
    canvas_ouput.height = video.videoHeight;
    const ctx2 = canvas_ouput.getContext('2d');
    ctx2.drawImage(video, 0, 0, canvas_ouput.width, canvas_ouput.height); //生成不带红框的视屏图片
    const RECT_WIDTH = 40; //红框框
    const RECT_HEIGHT = 40; //红框高
    ctx2.rect(x - RECT_WIDTH / 2, y - RECT_WIDTH / 2, RECT_WIDTH, RECT_HEIGHT); //画矩形
    ctx2.strokeStyle = '#ff0000';
    ctx2.lineWidth = 2;
    ctx2.lineJoin = 'round';
    ctx2.stroke();
    const base64 = canvas_ouput.toDataURL('image/jpeg', 1); //生成base64的图片
    this.openNotification(base64);
  };

  // 通知
  openNotification = (base64) => {
    const description = (
      <div style={{ width: '300px', height: '200px' }}>
        <Zmage src={base64} style={{ height: '100%', width: '100%' }} />
      </div>
    );
    notification.open({
      message: '截图',
      description,
    });
  };

  render() {
    return (
      <div className="content">
        <video
          id="videoElement"
          src={animal}
          muted
          autoPlay
          onPlaying={this.onplay}
          style={{ backgroundColor: '#ccc', width: '640px', height: '360px' }}
        />
        <div
          className="canvasBox"
          id="canvasBox"
          onClick={(e) => this.clickCanvas(e)}
        >
          <canvas
            id="myCanvas"
            onContextMenu={(e) => {
              e.preventDefault();
              return false;
            }}
          />
        </div>
      </div>
    );
  }
}

export default Video;
