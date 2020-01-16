window.onload = function() {
    var oContainer = document.getElementById('nav-container');
    var list = document.getElementsByClassName('posters')[0];
    var oPrev = document.getElementById('prev');
    var oNext = document.getElementById('next');
    var oCircle = document.getElementById('circle');
    var aCircle = oCircle.getElementsByTagName('div');
    var aP = oCircle.getElementsByTagName('p');

    var timer;
    var num = 0;

    function animate(offset) {

        var newLeft = parseInt(list.style.left) + offset;
        list.style.left = newLeft + 'px';

        if (newLeft > -1000) {
            //如果当前的 a = list.style.left = 0;此时图片位于被隐藏的第五张，它的前面没有图， 就把-2000px赋值给a,此时图片还是位于第五张图，而她的前面有五张图片所以a = -400px*5=-2000px;    
            list.style.left = -5000 + 'px';
        }
        if (newLeft < -5000) {
            //同理，如果当前的a= list.style.left = -2400px;此时图片位于第一张，它的前面有六张图，就把-400px赋值给a,此时图片还是位于第一张，而它的前面有一张图，所以a = -400px;
            list.style.left = -1000 + 'px';
        }
    }


    //图片自动轮播
    function autoPlay() {
        //设置定时器，每隔1.5s运行一次oNext.onclick
        timer = setInterval(function() {
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
        aCircle[num].className = 'on';
    }

    //左右箭头切换图片，圆点样式也跟着移动
    oPrev.onclick = function() {
        num--;
        if (num == -1) {
            num = aCircle.length - 1;
            // num = 4;
        }
        circleShow();
        animate(1000);
    }
    oNext.onclick = function() {
        num++;
        if (num == aCircle.length) {
            // if (num == 5) {
            num = 0;
        }
        circleShow();
        animate(-1000);
    }




    for (var i = 0; i < aCircle.length; i++) {
        aCircle[i].index = i;
        //鼠标点击小圆点显示相应图片
        aCircle[i].onclick = function() {
                //图片相对左侧移动的距离
                var offset = 1000 * (num - this.index);
                animate(offset);
                //鼠标移动到小圆点的位置
                num = this.index;
                circleShow();
            }
            //鼠标移入小圆点显示相应图片
        aCircle[i].onmouseover = function() {
            aP[this.index].style.display = 'block';
        };
        aCircle[i].onmouseout = function() {
            aP[this.index].style.display = 'none';
        };
    }
}