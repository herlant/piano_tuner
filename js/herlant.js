if (document.addEventListener) document.addEventListener("DOMContentLoaded", init, false);
else window.onload = init;

function init() {

    if (typeof(AudioContext) !== 'undefined') {
        window.context = new AudioContext();
    } else if (typeof(webkitAudioContext) !== 'undefined') {
        window.context = new webkitAudioContext();
    }
      
    if (window.context === undefined || typeof(OscillatorNode) === 'undefined' || typeof(OscillatorNode.prototype.start) === 'undefined') {
		var warning = document.createElement("div");
		warning.id = "browser-warning";
		warning.innerHTML = "The Online Tone Generator cannot run because your browser does not fully support the Web Audio API. "+
		"You can use the Online Tone Generator if you install a recent version of Firefox, Chrome or Safari.";
		document.body.appendChild(warning);
	}

    player.init();
    viewer.init();
    
    // Change all the initial parameters to match those of the gui's present values
    player.left_f0 = document.getElementById("left_f0").value;
    player.right_f0 = document.getElementById("right_f0").value;
    player.volume = document.getElementById("volume").value;
    player.left_damping = document.getElementById("left_damping").value;
    player.right_damping = document.getElementById("right_damping").value;
    player.left_inharmonicity = document.getElementById("left_inharmonicity").value;
    player.right_inharmonicity = document.getElementById("right_inharmonicity").value;
    player.update();
    
    // player.start_oscillators();
    visualize();
    
    // display sampling rate 
    document.getElementById("sample_rate").value = window.context.sampleRate;
    
    // stop microphone
    document.getElementById("mic_en").checked = false;
    
}

function toggle_play()
{
    if(!player.started) {
        player.start_oscillators();
        player.started = true;
    }
    button = document.getElementById("play_button");
    if(player.playing) {
        player.playing = false;
        button.value = "Play"
    } else {
        player.playing = true;
        button.value = "Stop"
    }
    player.update();
}

function toggle_harmonics(channel, n)
{
    // Will only run once, unfortunately right now we check every time
    if(!player.started) {
        player.start_oscillators();
        player.started = true;
    }
    
    button = document.getElementById("button".concat(channel[0].toUpperCase()).concat(n.toString()))
    n = n-1
    switch(channel)
    {
        case "left":
            if(player.left_harmonics_en[n]) {
                player.left_harmonics_en[n] = false;
                button.className = 'toggle-off'
            } else {
                player.left_harmonics_en[n] = true;
                button.className = 'toggle-on';
            }
            break;
        case "right":
            if(player.right_harmonics_en[n]) {
                player.right_harmonics_en[n] = false;
                button.className = 'toggle-off';
            } else {
                player.right_harmonics_en[n] = true;
                button.className = 'toggle-on';
            }
            break;
    }
    player.update();
}

function change_volume(vol)
{
        player.volume = vol;
        player.update();
}

function change_damping(channel, val)
{
    switch(channel) {
        case "left":
            player.left_damping = val;
        break;
        case "right":
            player.right_damping = val;
        break;
    }
    player.update();
}

function change_inharmonicity(channel, val)
{
    switch(channel) {
        case "left":
            player.left_inharmonicity = val;
        break;
        case "right":
            player.right_inharmonicity = val;
        break;
    }
    player.update();
}

function change_frequency(channel, val)
{
    switch(channel) {
        case "left":
            player.left_f0 = val;
			document.getElementById('left_f0').value = val;
        break;
        case "right":
            player.right_f0 = val;
			document.getElementById('right_f0').value = val;
        break;
    }
    player.update();
}

function toggle_channel(channel)
{
    button = document.getElementById("button_".concat(channel))
    switch(channel)
    {
        case "left":
            if(player.left_en) {
                player.left_en = false;
                button.style.background='#BB6E34';
            } else {
                player.left_en = true;
                button.style.background='#9b5622';
            }
            break;
        case "right":
            if(player.right_en) {
                player.right_en = false;
                button.style.background='#BB6E34';
            } else {
                player.right_en = true;
                button.style.background='#9b5622';
            }
            break;
    }
    player.update();    
}

function toggle_stereo()
{
    button = document.getElementById("mix");
    player.toggle_stereo();
    if(player.stereo) {
        button.style.background='#BB6E34';
    } else {
        button.style.background='#9b5622';
    }
}


// Display controls
function set_f_low(v)
{
    viewer.f_low = v;
}

function set_f_high(v)
{
    viewer.f_high = v;
}

function set_db_min(v)
{
    viewer.db_min = v;
    viewer.mic_analyser.minDecibels = v;
    player.left_analyser_node.minDecibels = v;
    player.right_analyser_node.minDecibels = v;
    document.getElementById('db_max').min = v+1;
}

function set_db_max(v)
{
    viewer.db_max = v;
    viewer.mic_analyser.maxDecibels = v;
    player.left_analyser_node.maxDecibels = v;
    player.right_analyser_node.maxDecibels = v;
}

function set_fft_size(v)
{
    viewer.mic_analyser.fftSize = v;
    player.left_analyser_node.fftSize = v;
    player.right_analyser_node.fftSize = v;
}

function enable_mic(v)
{
    viewer.mic_en=v;
    set_fft_size(document.getElementById("fft_size").value);
}

function load_note(channel)
{
	var note = document.getElementById('note').value;
	var oct = document.getElementById('octave').value;
	var ref = document.getElementById('ref').value;
	var freq = ref*Math.pow(2, (note-9)/12)*Math.pow(2,oct-4);
	freq = Math.round(freq*100)/100;
	change_frequency(channel,freq);
}

function increment(id, amount)
{
	var item = document.getElementById(id);
	item.value = Number(item.value) + Number(amount);
	item.onchange();
}
