var el_audio = document.querySelector('#j-audio');
var el_canvas = document.querySelector('#j-canvas');
var el_play=document.querySelector('#play');
var el_pause=document.querySelector('#pause');
var el_prev=document.querySelector('#prev');
var el_next=document.querySelector('#next');
el_canvas.width = document.querySelector('body').clientWidth;
el_canvas.height = document.querySelector('body').clientHeight / 2;
var AudioTrack = function(a, c, f, b) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
    window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
    this.audio = a;
    this.btns = b;
    this.canvas = c;
    this.canvasCtx = c.getContext('2d');
    this.fileInput = f;
    this.file = null;
    this.fileName = '';
    this.drawVisual = null;
    this.audioCtx = new AudioContext();
    this.source = null;
    this.myScriptProcessor =this.audioCtx.createScriptProcessor(1024);
}
AudioTrack.prototype = {
    init: function() {
        this._setEvent();
    },
    _showTrack: function(decodedData) {
        var _this = this;
        var WIDTH = this.canvas.width;
        var HEIGHT = this.canvas.height;
        var analyser = this.audioCtx.createAnalyser();
        if (this.drawVisual) {
            cancelAnimationFrame(this.drawVisual);
        }
        this.source = this.audioCtx.createBufferSource();
        this.source.buffer = decodedData;
        //this.source=this.audioCtx.createMediaElementSource(_this.audio);
        this.source.connect(this.audioCtx.destination);
        this.source.start();
        this.source.connect(analyser);
        this.source.onended = function() {
            cancelAnimationFrame(_this.drawVisual);
        }
        analyser.fftSize = 256;
        var bufferLength = analyser.frequencyBinCount;
        canvasCtx = this.canvasCtx;
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
        canvasCtx.font = "20px Georgia";
        //canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        //canvasCtx.fillStyle="rgb(255,255,255)";
        canvasCtx.fillText(this.fileName, 10, 50);

        function draw() {

            var dataArray = new Uint8Array(bufferLength);
            analyser.getByteFrequencyData(dataArray);
            canvasCtx.fillStyle = 'rgb(255, 255, 255)';
            canvasCtx.fillRect(0, 70, WIDTH, HEIGHT - 70);
            var barWidth = (WIDTH / bufferLength);
            var barHeight;
            var x = 0;
            for (var i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 1.5;
                canvasCtx.fillStyle = 'rgb(0,0,0)';
                canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
                x += barWidth + 3;
            }
            _this.drawVisual = requestAnimationFrame(draw);
        };
        draw();
    },
    _setEvent: function() {
        var _this = this;
    }
}
var at = new AudioTrack(el_audio, el_canvas, el_file, el_audioBtn);
at.init();
