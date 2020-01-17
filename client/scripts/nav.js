// window.onload = function() {
var oContainer = document.getElementById('nav-container');
var list = document.getElementsByClassName('posters')[0];
var oPrev = document.getElementById('prev');
var oNext = document.getElementById('next');
var oCircle = document.getElementById('circle');
var aCircle = oCircle.getElementsByTagName('div');
var aP = oCircle.getElementsByTagName('p');

let currentBannerIndex = 0;
let imgSrcArr = ["../static/img/1.jpg",
  "../static/img/2.jpg",
  "../static/img/3.jpg",
  "../static/img/4.jpg",
  "../static/img/5.jpg"];

var timer;
var num = 0;

//图片自动轮播
function autoPlay() {
  //设置定时器，每隔1.5s运行一次oNext.onclick
  timer = setInterval(function () {
    oNext.onclick();
  }, 1500);
}

function stopAutoPlay() {
  clearInterval(timer);
}

// 鼠标移入图片，清除定时器，移开，打开定时器
oContainer.onmouseover = stopAutoPlay;
oContainer.onmouseout = autoPlay;
autoPlay();


//设置小圆点
function circleShow() {
  //清除之前所有的样式
  for (var i = 0; i < aCircle.length; i++) {
    aCircle[i].className = '';
  }
  //把第一个下标为0的设置属性className
  aCircle[currentBannerIndex].className = 'on';
}

// //左右箭头切换图片，圆点样式也跟着移动
oPrev.onclick = function () {
  bannerIndexMinusOne();
  circleShow();
  switchBanner();
}
oNext.onclick = function () {
  bannerIndexAddOne();
  circleShow();
  switchBanner();
}

for (var i = 0; i < aCircle.length; i++) {
  aCircle[i].index = i;
  //鼠标点击小圆点显示相应图片
  aCircle[i].onclick = function () {
    //鼠标移动到小圆点的位置
    currentBannerIndex = this.index;
    switchBanner();
    circleShow();
  }
  //鼠标移入小圆点显示相应图片
  aCircle[i].onmouseover = function () {
    aP[this.index].style.display = 'block';
  };
  aCircle[i].onmouseout = function () {
    aP[this.index].style.display = 'none';
  };
}

function switchBanner() {
  let banner = document.getElementsByClassName('banner-img')[0];
  banner.setAttribute('src', imgSrcArr[currentBannerIndex])
}

function bannerIndexAddOne() {
  currentBannerIndex++;
  if (currentBannerIndex > imgSrcArr.length - 1) {
    currentBannerIndex = 0;
  }
}

function bannerIndexMinusOne() {
  currentBannerIndex--;
  if (currentBannerIndex < 0) {
    currentBannerIndex = imgSrcArr.length - 1;
  }
}