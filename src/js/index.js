import Sound from './sound';
var $=require('jquery');
require('dialog.d');
require('./jquery.slider');
var el_audio = document.querySelector('#j-audio');
var el_canvas = document.querySelector('#j-canvas');
var $play = $('#play');
var $prev = $('#prev');
var $next = $('#next');
el_canvas.width = document.querySelector('#canvasBox').clientWidth;
el_canvas.height = document.querySelector('html').clientHeight;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
window.media = new Sound(el_audio,el_canvas);

class app{
    constructor(btns,m) {
        this.listTpl=`<&data.forEach(function(el,index){&><li class="list-itm <&if(index===0){&>active<&}&>" data-index='<&=index&>'>
        <&=el.name&></li><&});&>`;
        this.btns=btns;
        this.m=m;
        this.musicList=Config;
        this.musicIndex=0;
        this.$face=$('#avatar');
        this.$title=$('#title');
        this.faceTitle(0);
        this.listMusic();
        this.setEvents();
        console.warn(this.musicList);
    }
    listMusic(){
        var _this=this;
        var htmlStr=D.utils.render(_this.listTpl,{data:_this.musicList});
        $('#list').html(htmlStr);
    }
    set listIndex(index){
        this.musicIndex=index;
        this.m.link=this.musicList[index].url;
        this.faceTitle(index);
        this.$listItm.removeClass('active').eq(index).addClass('active');
    }
    faceTitle(index){
        this.$face.attr('src',this.musicList[index].pic);
        this.$title.html(this.musicList[index].name);
    }
    afterEnd(){
        this.btns.play.removeClass('icon-zanting');
        this.$face.removeClass('rotating');
    }
    afterStart(){
        this.btns.play.addClass('icon-zanting');
        this.$face.addClass('rotating');
    }
    setEvents(){
        console.info(this.musicList);
        var _this=this;
        var $progress=$('#progress');
        var $nowTime=$('#nowTime');
        var $allTime=$('#allTime');
        this.$listItm=$('.list-itm');
        $("#slider1").slideBar({max:100,min:0,crossC:"#f70",handlerC:'#fff',defalutNum:100,callBack:function(v){
            media.volumn=parseInt(v)/100;
        }});
        this.m.endCb=function(){
            _this.btns.next.trigger('click');
            _this.afterEnd();
        }
        this.m.playStart=function(){
            if (_this.m.playStat) {
                _this.afterStart();
            }
        }
        this.m.playing(function(){
            $progress[0].style.width=_this.m.currentTime/_this.m.allTime*100+'%';
            $nowTime.text(parseInt(_this.m.currentTime/60)+':'+parseInt(_this.m.currentTime%60));
            $allTime.text(parseInt(_this.m.allTime/60)+':'+parseInt(_this.m.allTime%60));
        });
        this.$listItm.on('click', function(e) {
            _this.listIndex=_this.$listItm.index($(this));
        });
        this.btns.play.on('click', function(e) {
            if(_this.m.playStat){
                _this.m.a.pause();
                _this.afterEnd();
            }else{
                _this.m.a.play();
                _this.afterStart();
            }
        });
        this.btns.next.on('click', function(event) {
            if (_this.musicIndex<_this.musicList.length-1) {
                //_this.musicIndex++;
                _this.listIndex=_this.musicIndex+1;
                
            }

        });
        this.btns.prev.on('click', function(event) {
            if (_this.musicIndex>0) {
                //_this.musicIndex--;
                _this.listIndex=_this.musicIndex-1;
            }

        });
    }
}
new app({play:$play,prev:$prev,next:$next},media);
