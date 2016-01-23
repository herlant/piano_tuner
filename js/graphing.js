
var drawVisual
var min;
var max;
var i_min;
var i_max;

var viewer = 
{   
    mic_analyser:[],
    f_low:0,
    f_high:0,
    db_min:0,
    db_max:0,
    init:function()
    {
        
        navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);
        if(navigator.getUserMedia) {
            console.log('getUserMedia supported.');
            navigator.getUserMedia(
                { audio:true }, 
                function(stream) 
                {
                    viewer.source = window.context.createMediaStreamSource(stream);
                    viewer.mic_analyser = window.context.createAnalyser();
                    viewer.source.connect(viewer.mic_analyser);
                    viewer.mic_analyser.connect(window.context.destination);
                },
                function(err)
                {
                    console.log('The following gUM error occured: ' + err);
                }
            );
        } else {
            console.log('getUserMedia not supported on your browser!');
        }
        
        this.db_min = document.getElementById("db_min").value;
        this.db_max = document.getElementById("db_max").value;
        this.f_low = document.getElementById("f_low").value;
        this.f_high = document.getElementById("f_high").value; 
        set_fft_size(document.getElementById("fft_size").value);
    }
}

function visualize() {
    var canvas = document.querySelector('.visualizer');
    var canvasCtx = canvas.getContext("2d");

    // scale the size of the viewer to be the width of the screen
    var intendedWidth = document.querySelector('.wrapper').clientWidth;
    canvas.setAttribute('width',intendedWidth);
        
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var left_buffer_length = player.left_analyser_node.frequencyBinCount;
    var left_data = new Float32Array(left_buffer_length);
    var right_buffer_length = player.right_analyser_node.frequencyBinCount;
    var right_data = new Float32Array(right_buffer_length);
    
    canvasCtx.clearRect(0,0, WIDTH, HEIGHT);

    var sample_rate = window.context.sampleRate;
    
    function draw() {
        drawVisual = requestAnimationFrame(draw);
        
        // Get Data
        player.left_analyser_node.getFloatFrequencyData(left_data);
        player.right_analyser_node.getFloatFrequencyData(right_data);
        
        // Get scale for the y-axis
        scale = HEIGHT/(viewer.db_max-viewer.db_min);

        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0,0, WIDTH, HEIGHT);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 255, 0)';
        canvasCtx.beginPath();
        
        var x=0;
        var y=0;
        viewer.res = sample_rate / player.left_analyser_node.fftSize;
        
        var i_left = Math.round(viewer.f_low / viewer.res);
        var i_right = Math.round(viewer.f_high / viewer.res);
        
        var delx = WIDTH / (i_right-i_left);
        
        for(var i=i_left; i<i_right; i++) {
            var v = (left_data[i]-viewer.db_min)*scale;
            var y = HEIGHT - v;
            if(i==0) {
                canvasCtx.moveTo(x,y);
            } else {
                canvasCtx.lineTo(x,y);
            }
            x += delx;
        }
        canvasCtx.stroke();
        
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(255, 0, 0)';
        canvasCtx.beginPath();
        x=0;
        for(var i=i_left; i<i_right; i++) {
            var v = (right_data[i]-viewer.db_min)*scale;
            var y = HEIGHT - v;
            if(i==0) {
                canvasCtx.moveTo(x,y);
            } else {
                canvasCtx.lineTo(x,y);
            }
            x += delx;
        }
        canvasCtx.stroke();
    };
    
    draw();
}

