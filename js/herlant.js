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
    
    // Change all the initial parameters to match those of the gui's present values
    player.left_f0 = document.getElementById("left_f0").value;
    player.right_f0 = document.getElementById("right_f0").value;
    player.volume = document.getElementById("volume").value;
    player.update();
}

function toggle_play()
{
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
    button = document.getElementById("button".concat(channel[0].toUpperCase()).concat(n.toString()))
    switch(channel)
    {
        case "left":
            if(player.left_harmonics_en[n]) {
                player.left_harmonics_en[n] = false;
                button.style.background='lightgrey';
            } else {
                player.left_harmonics_en[n] = true;
                button.style.background='yellow';
            }
            break;
        case "right":
            if(player.right_harmonics_en[n]) {
                player.right_harmonics_en[n] = false;
                button.style.background='lightgrey';
            } else {
                player.right_harmonics_en[n] = true;
                button.style.background='yellow';
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

function change_frequency(channel, val)
{
    switch(channel) {
        case "left":
            player.left_f0 = val;
        break;
        case "right":
            player.right_f0 = val;
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
                button.style.background='lightgrey';
            } else {
                player.left_en = true;
                button.style.background='yellow';
            }
            break;
        case "right":
            if(player.right_en) {
                player.right_en = false;
                button.style.background='lightgrey';
            } else {
                player.right_en = true;
                button.style.background='yellow';
            }
            break;
    }
    player.update();    
}

var noteNames = [ "", 
    "A0 Double Pedal A",
    "A♯0/B♭0",
    "B0",
    "C1 Pedal C",
    "C♯1/D♭1",
    "D1",
    "D♯1/E♭1",
    "E1",
    "F1",
    "F♯1/G♭1",
    "G1",
    "G♯1/A♭1",
    "A1",
    "A♯1/B♭1",
    "B1",
    "C2 Deep C",
    "C♯2/D♭2",
    "D2",
    "D♯2/E♭2",
    "E2",
    "F2",
    "F♯2/G♭2",
    "G2",
    "G♯2/A♭2",
    "A2",
    "A♯2/B♭2",
    "B2",
    "C3 Tenor C",
    "C♯3/D♭3",
    "D3",
    "D♯3/E♭3",
    "E3",
    "F3",
    "F♯3/G♭3",
    "G3",
    "G♯3/A♭3",
    "A3",
    "A♯3/B♭3",
    "B3",
    "C4 Middle C",
    "C♯4/D♭4",
    "D4",
    "D♯4/E♭4",
    "E4",
    "F4",
    "F♯4/G♭4",
    "G4",
    "G♯4/A♭4",
    "A4",
    "A♯4/B♭4",
    "B4",
    "C5",
    "C♯5/D♭5",
    "D5",
    "D♯5/E♭5",
    "E5",
    "F5",
    "F♯5/G♭5",
    "G5",
    "G♯5/A♭5",
    "A5",
    "A♯5/B♭5",
    "B5",
    "C6 Soprano C",
    "C♯6/D♭6",
    "D6",
    "D♯6/E♭6",
    "E6",
    "F6",
    "F♯6/G♭6",
    "G6",
    "G♯6/A♭6",
    "A6",
    "A♯6/B♭6",
    "B6",
    "C7 Double high C",
    "C♯7/D♭7",
    "D7",
    "D♯7/E♭7",
    "E7",
    "F7",
    "F♯7/G♭7",
    "G7",
    "G♯7/A♭7",
    "A7",
    "A♯7/B♭7",
    "B7",
    "C8"
];    
