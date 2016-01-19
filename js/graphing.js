
var drawVisual
var min;
var max;
var i_min;
var i_max;


function visualize() {
    var canvas = document.querySelector('.visualizer');
    var canvasCtx = canvas.getContext("2d");

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
        
        // get start and end indices based on frequency range
        var min_freq = Math.min(player.left_f0, player.right_f0) - 100;
        var max_freq = Math.max(player.left_f0, player.right_f0)*player.n_harmonics + 100;
        
        i_min = Math.round(min_freq*player.left_analyser_node.fftSize / sample_rate);
        i_max = Math.round(max_freq*player.left_analyser_node.fftSize / sample_rate);
        
        
        // Get y min and max
        var left_min = Math.min.apply(Math,left_data);
        var left_max = Math.max.apply(Math,left_data);
        var right_min = Math.min.apply(Math,right_data);
        var right_max = Math.max.apply(Math,right_data);
        
        if(player.right_en && player.left_en) {
            min = Math.min(left_min, right_min);
            max = Math.max(left_max, right_max);
        } else if(player.right_en && !player.left_en) {
            min = right_min/2;
            max = right_max;
        } else if(!player.right_en && player.left_en) {
            min = left_min/2;
            max = left_max;
        } else {
            canvasCtx.fillStyle = 'rgb(0, 0, 0)';
            canvasCtx.fillRect(0,0, WIDTH, HEIGHT);
            return;
        }
        
        min = -100;
        
        if(max != min) {
            scale = HEIGHT/(max-min);
        } else {
            scale = 1;
        }
        
        

        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0,0, WIDTH, HEIGHT);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 255, 0)';
        canvasCtx.beginPath();
        
        var x=0;
        var y=0;
        var delx = WIDTH / (i_max-i_min);
        
        for(var i=i_min; i<i_max; i++) {
            var v = (left_data[i]-min)*scale;
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
        for(var i=i_min; i<i_max; i++) {
            var v = (right_data[i]-min)*scale;
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

