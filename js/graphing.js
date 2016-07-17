
var drawVisual
var min;
var max;
var i_min;
var i_max;

var viewer = 
{   
    mic_en:false,
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
                },
                function(err)
                {
                    console.log('The following gUM error occured: ' + err);
                }
            );
        } else {
            console.log('getUserMedia not supported on your browser!');
        }

        this.f_low = document.getElementById("f_low").value;
        this.f_high = document.getElementById("f_high").value; 
        set_db_min(document.getElementById("db_min").value);
        set_db_max(document.getElementById("db_max").value);
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

    
    canvasCtx.clearRect(0,0, WIDTH, HEIGHT);

    var sample_rate = window.context.sampleRate;
    
    function draw() {
        drawVisual = requestAnimationFrame(draw);

        // Draw a black background
        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0,0, WIDTH, HEIGHT);
        
        // Plot lines for harmonics that are playing
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 255, 0)';
        canvasCtx.beginPath();
        for(var i=0; i<player.n_harmonics; i++){
            if(player.right_harmonics_en[i]) {
                freq = player.right_oscillators[i].frequency.value
                if(freq>viewer.f_low && freq<viewer.f_high) {
                    x = Math.round((freq - viewer.f_low)/(viewer.f_high - viewer.f_low)*WIDTH)
                    canvasCtx.moveTo(x,0);
                    canvasCtx.lineTo(x,HEIGHT)
                }
            }
        }
        canvasCtx.stroke();    
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(255, 0, 0)';
        canvasCtx.beginPath();
        for(var i=0; i<player.n_harmonics; i++){
            if(player.left_harmonics_en[i]) {
                freq = player.left_oscillators[i].frequency.value
                if(freq>viewer.f_low && freq<viewer.f_high) {
                    x = Math.round((freq - viewer.f_low)/(viewer.f_high - viewer.f_low)*WIDTH)
                    canvasCtx.moveTo(x,0);
                    canvasCtx.lineTo(x,HEIGHT)
                }
            }
        }
        canvasCtx.stroke();  
        
        
        
        // res constains the resolution of the fft data
        // since the fft is done over a certain bin size (fftSize)
        // and with a certain sampling rate, each value that is returned
        // will be an average over "res" number of Hz
        var res = sample_rate / viewer.mic_analyser.fftSize;
        
        var i_left = Math.round(viewer.f_low / res);
        var i_right = Math.round(viewer.f_high / res);
        
        // Get scale for the y-axis
        scale = HEIGHT/(viewer.db_max-viewer.db_min);

        var delx = WIDTH / (i_right-i_left);

        // microphone
        if(viewer.mic_en)
        {
            var mic_buffer_length = viewer.mic_analyser.frequencyBinCount;
            var mic_data = new Float32Array(mic_buffer_length);
            
            viewer.mic_analyser.getFloatFrequencyData(mic_data);
            
            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = 'rgb(0, 0, 255)';
            canvasCtx.beginPath();
            x=0;
            for(var i=i_left; i<i_right; i++) {
                var v = (mic_data[i]-viewer.db_min)*scale;
                var y = HEIGHT - v;
                if(i==0) {
                    canvasCtx.moveTo(x,y);
                } else {
                    canvasCtx.lineTo(x,y);
                }
                x += delx;
            }
            canvasCtx.stroke();
        }
    };
    
    draw();
}

