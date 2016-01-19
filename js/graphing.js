
var drawVisual

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
    
    function draw() {
        drawVisual = requestAnimationFrame(draw);
        
        player.left_analyser_node.getFloatFrequencyData(left_data);
        player.right_analyser_node.getFloatFrequencyData(right_data);
        
        var left_min = Math.min.apply(Math,left_data);
        var left_max = Math.max.apply(Math,left_data);
        var right_min = Math.min.apply(Math,right_data);
        var right_max = Math.max.apply(Math,right_data);
        var min = Math.min(left_min, right_min);
        var max = Math.max(left_max, right_max);
        
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
        var delx = WIDTH / left_buffer_length;
        
        for(var i=0; i<left_buffer_length; i++) {
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
        for(var i=0; i<right_buffer_length; i++) {
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

