let oContainer = document.getElementById('nav-container');
let list = document.getElementsByClassName('posters')[0];
let oPrev = document.getElementById('prev');
let oNext = document.getElementById('next');
let oCircle = document.getElementById('circle');
let aCircle = oCircle.getElementsByTagName('div');
let aP = oCircle.getElementsByTagName('p');

let currentBannerIndex = 0;
let imgSrcArr = ["../static/img/1.jpg",
  "../static/img/2.jpg",
  "../static/img/3.jpg",
  "../static/img/4.jpg",
  "../static/img/5.jpg"];
let imgIdArr = [1851857, 1292213, 11525673, 26325320, 1293182];
let timer;

function autoPlay() {
  timer = setInterval(function () {
    oNext.onclick();
  }, 1500);
}

function stopAutoPlay() {
  clearInterval(timer);
}

oContainer.onmouseover = stopAutoPlay;
oContainer.onmouseout = autoPlay;
autoPlay();

function circleShow() {
  for (let i = 0; i < aCircle.length; i++) {
    aCircle[i].className = '';
  }
  aCircle[currentBannerIndex].className = 'on';
}

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

for (let i = 0; i < aCircle.length; i++) {
  aCircle[i].index = i;
  aCircle[i].onclick = function () {
    currentBannerIndex = this.index;
    switchBanner();
    circleShow();
  }
  aCircle[i].onmouseover = function () {
    aP[this.index].style.display = 'block';
  };
  aCircle[i].onmouseout = function () {
    aP[this.index].style.display = 'none';
  };
}

function switchBanner() {
  let banner = document.getElementsByClassName('banner-img')[0];
  banner.setAttribute('src', imgSrcArr[currentBannerIndex]);
  banner.setAttribute('douban-id', imgIdArr[currentBannerIndex]);
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