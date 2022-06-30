# video截图功能带红框 

前置知识：

1、 [canvas drawImage()](https://www.w3school.com.cn/tags/canvas_drawimage.asp)

2、 [canvas rect()创建矩形](https://www.w3school.com.cn/tags/canvas_rect.asp)
        
业务需求: 在直播视屏流内 点击任意位置 带上红框 再截图传给后台

生成如下图带红框的图片
 
![img](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18e61735fd614da09369b9efd8697d78~tplv-k3u1fbpfcp-watermark.image?imageView2/2/w/480/h/480/q/85/interlace/1)

 用的测试视屏模拟直播的流

## 在视屏上方覆盖一层canvas
```javascript
 <div className="content">
        <video
          id="videoElement"
          src={animal}
          muted
          autoPlay
          onPlaying={this.onplay}
          style={{ backgroundColor: "#ccc", width: "497px", height: "280px" }}
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

```
#### 点击canvas后 获取光标的坐标点 
```javascript
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
```

## 截图功能
1、生成红框
```javascript
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
```
2、生成不带红框的图片，因为鼠标点击的坐标点都知道，只需再生成后的图片上重新绘制矩形
```javascript
handleScissor = (x, y) => {
    let video = document.getElementById('videoElement');
    const canvas_ouput = document.createElement('canvas');
    canvas_ouput.width = video.videoWidth;
    canvas_ouput.height = video.videoHeight;
    const ctx2 = canvas_ouput.getContext('2d');
    ctx2.drawImage(video, 0, 0, canvas_ouput.width, canvas_ouput.height); //生成不带红框的视屏图片
    const RECT_WIDTH = 40; //红框框
    const RECT_HEIGHT = 40; //红框高
    ctx2.rect(x - RECT_WIDTH / 2, y - RECT_WIDTH / 2, RECT_WIDTH, RECT_HEIGHT);
    ctx2.strokeStyle = '#ff0000';
    ctx2.lineWidth = 2;
    ctx2.lineJoin = 'round';
    ctx2.stroke();
    let base64 = canvas_ouput.toDataURL('image/jpeg', 1); //生成base64的图片
  };


```
最终效果，左上交的视屏logo被我打码了不用在意 哈哈哈哈
![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/519e5d2682ec4bf39f259dc7da6f864f~tplv-k3u1fbpfcp-watermark.image?imageView2/2/w/480/h/480/q/85/interlace/1)
