class Sound {
  constructor(audio,c) {
    this.a = audio;
    this.canvas = c;
    this.canvasCtx = this.canvas.getContext('2d');
    this.audioCtx = new AudioContext();
    this.source = null;
    this.drawVisual=null;
    this.myScriptProcessor =this.audioCtx.createScriptProcessor(1024);
    this.analyser = this.audioCtx.createAnalyser();
    this.source = this.audioCtx.createMediaElementSource(this.a);
	  this.source.connect(this.audioCtx.destination);
    this.source.connect(this.analyser);
    this.myScriptProcessor.connect(this.audioCtx.destination);
    this.analyser.connect(this.myScriptProcessor);
    this.analyser.fftSize = 256;
    this.endCb=function(){};
    this.playStart=function(){};
    this.setEvents();
  }
  setEvents(){
  	var _this=this;
  	
  	this.a.addEventListener('canplay',function(e){
    	_this.playStart();
    	_this._showTrack();

    });
    this.a.addEventListener("pause", function(){

	  });
  }
  playing(cb){
    this.a.addEventListener('timeupdate',function(e){
      //console.log(_this.currentTime);
      cb()
    });
  }
  play(){
  	this.a.play();
  }
  get currentTime(){
  	return parseInt(this.a.currentTime);
  }
  get allTime(){
  	return this.a.duration;
  }
  pause(){
  	this.a.pause();
  }

  get playStat(){
  	return !this.a.paused;
  }
  set volumn(num){
  	this.a.volume=num;
  }
  get volumn(){
  	return this.a.volume;
  }
  get audioInstance(){
  	return this.a;
  }
  get link(){
  	return this.a.src;
  }
  set link(src){
  	this.a.src=src;
  	this.play();
  } 
  _showTrack() {
        var _this = this;
        var WIDTH = this.canvas.width;
        var HEIGHT = this.canvas.height;
        var dataLength = _this.analyser.frequencyBinCount;
        var dataArray=null;
        this.myScriptProcessor.onaudioprocess=function(){//解析音频
        	dataArray = new Uint8Array(dataLength);
        	_this.analyser.getByteFrequencyData(dataArray);
        }
        this.a.onended = function() {
        	  console.info('end');
            cancelAnimationFrame(_this.drawVisual);
            setTimeout(function(){canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);},1000);
            _this.endCb()
        }
        var canvasCtx = this.canvasCtx;
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
        canvasCtx.font = "20px Georgia";
        var colors=['rgba(215,255,5,.9)']
        function draw() {
            //canvasCtx.fillStyle = 'rgb(255, 255, 255)';
            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
            var barWidth = (WIDTH / dataLength);
            //var barWidth = 1;
            var barHeight;
            var x = 0;
            if (dataArray) {
	            for (var i = 0; i < dataLength; i++) {
	                barHeight = dataArray[i]/1.5;
	                canvasCtx.fillStyle = colors[Math.round(Math.random()*colors.length)];
	                canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
	                x += barWidth + 1;
	            }
        	}
            _this.drawVisual = requestAnimationFrame(draw);
        };
        draw();
        
    }
}
export default Sound;