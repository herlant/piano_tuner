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

function onPlayButtonClick()
{
    if (tones.playing) {
        window.playButton.innerHTML = "Play";
        window.playIndicator.className = "stopped";
        tones.stop();
    } else {
        window.playButton.innerHTML = "Stop";
        window.playIndicator.className = "playing";
        tones.play(window.sliderFreq);
    }
}

function formatNumber(number)
{
    var chunks = number.toString().split(".");
    if (chunks.length == 1) return chunks[0].toLocaleString("en-US", {style:"currency",useGrouping:true}) + " <small>Hz</small>";
    else if (chunks.length == 2) {
        if (chunks[1].length <= 2) return chunks[0].toLocaleString("en-US") + "<small>." + chunks[1] + " Hz</small>";
        else return "<small>~&thinsp;</small>" + chunks[0].toLocaleString("en-US") + "<small>." + chunks[1].slice(0, 2) + " Hz</small>";
    }
}

function formatHertz(number)
{
    function separateThousands(number)
    {
        var inputString = number.toString();
        var outputString = '';
        //01234  l=5
        //i = 2 [2]
        //234 > out
        //i = 2-3 = -1
        //slice 0 , -1 + 3 = 2
        for (var i = inputString.length - 1 - 2; i > 0; i -= 3) {
            outputString = "," + inputString.substr(i, 3) + outputString;
        }
        outputString = inputString.slice(0, i + 3) + outputString;
        return outputString;
    }    
    
    var chunks = number.toString().split(".");
    if (chunks.length == 1) return separateThousands(chunks[0]) + " <small>Hz</small>";
    else if (chunks.length == 2) {
        if (chunks[1].length <= 2) return separateThousands(chunks[0]) + "<small>." + chunks[1] + " Hz</small>";
        else return "<small>~&thinsp;</small>" + separateThousands(chunks[0]) + "<small>." + chunks[1].slice(0, 2) + " Hz</small>";
    }
}

function formatPercent(number)
{
    return Math.round(number*100).toString() + "%";
}

function sliderPosToFreq(sliderPos)
{
    return Math.round(20 * Math.pow(1.0025, sliderPos) - 19);
}

function freqToSliderPos(freq)
{
    return Math.round(Math.log((freq+19)/20) / Math.log(1.0025));
}

function changeFreqBy(delta) {
	if (delta > 0) {
		window.setFreq(Math.floor(window.sliderFreq) + delta); //if adding 1 Hz, change 4.3 -> 5
	} else if (delta < 0) {
		window.setFreq(Math.ceil(window.sliderFreq) + delta); //if subtracting 1 Hz, change 4.3 -> 4
	}	
}

function handleKeyDown(e)
{
	//console.log("handlekeydown");
    if (!e.ctrlKey && !e.altKey && !e.metaKey) {
        switch(e.keyCode) {
            case 37: //Left
				if (e.target == window.volSliderHandle) return;
				if (e.shiftKey) {
					e.preventDefault();
					window.changeFreqBy(-1);
				} else {
                    e.preventDefault();
                    window.moveSliderBy(-1);
                }
                break;
            case 39: //Right
				if (e.target == window.volSliderHandle) return;
				if (e.shiftKey) {
					e.preventDefault();
					window.changeFreqBy(1);
				} else {
                    e.preventDefault();
                    window.moveSliderBy(1);
                }
                break;
            case 32: //Spacebar
                e.preventDefault();
                onPlayButtonClick();
                break;
        }
    }
}

function UpDownButton(elementID, action) {
    this.button = document.getElementById(elementID);
    if (!this.button) return false;
    this.timeoutID = null;
    this.intervalID = null;
    this.action = action;
	
	var self = this;

	this.startRepeatPress = function() {
		self.action();
		self.intervalID = setInterval(self.action, 80); //no need to .bind() because the action function does not refer to any properties of this object
	}
    this.button.onmousedown = function(event) {
		if (self.timeoutID || self.intervalID) return;
        self.action();
        self.timeoutID = setTimeout(self.startRepeatPress, 500);
        window.addEventListener("mouseup", self.onMouseUp, true);
    }
	this.onMouseUp = function(event) {
		if (self.timeoutID) {
			clearTimeout(self.timeoutID);
			self.timeoutID = null;
		}
		if (self.intervalID) {
			clearInterval(self.intervalID);
			self.intervalID = null;
		}
		window.removeEventListener("mouseup", self.onMouseUp); //remove listener (self function) from window.mouseup
		//must attach mouseup listener to window rather than button -- otherwise we'll miss mouseup if user takes mouse away from the button		
	}
	this.button.ontouchstart = function(event) {
		if (self.timeoutID || self.intervalID) return;
		event.preventDefault();
        self.action();
        self.timeoutID = setTimeout(self.startRepeatPress, 500);
	}
	this.button.ontouchend = function(event) {
		if (self.timeoutID) {
			clearTimeout(self.timeoutID);
			self.timeoutID = null;
		}
		if (self.intervalID) {
			clearInterval(self.intervalID);
			self.intervalID = null;
		}
		event.preventDefault();
	}
}

  
if (document.addEventListener) document.addEventListener("DOMContentLoaded", init, false);
else window.onload = init;

function init() {
	$("#slider").slider({
		orientation: "horizontal",
		range: "min",
		min: 0,
		max: 2770,
		value: freqToSliderPos(440),
		step: 1,
		slide: function(event, ui) {
			window.sliderFreq = sliderPosToFreq(ui.value);
            window.freqReadout.innerHTML = formatHertz(window.sliderFreq);
			if (tones.playing) tones.play(window.sliderFreq);
		},
		stop: function(event, uo) {
			//tones.play(uo.value);
		}
	});
	$("#volume-slider").slider({
		orientation: "horizontal",
		range: "min",
		min: 0,
		max: 100,
		value: 100,
		step: 1,
		slide: function(event, ui) {
			window.volume = ui.value / 100;
			$("#volume-readout").html(formatPercent(window.volume));
			tones.changeVolume(window.volume);
		},
		stop: function(event, uo) {
			//tones.play(uo.value);
		}
	});

	var sliderInstance = $("#slider").slider().data("ui-slider");
	sliderInstance._handleEvents.keydown = function(event) { }; //disable built-in jquery-ui/slider keydown handler (has to be after volume-slider added for some reason)
	sliderInstance._setupEvents();
	
    new UpDownButton("freq-up-button", function() { window.changeFreqBy(1); });
    new UpDownButton("freq-down-button", function() { window.changeFreqBy(-1); });
	document.getElementById("controls").ontouchend = function(event) { event.preventDefault(); } //prevent zoom when accidentally double-tapping near a button
   
   	var octaveUpButton = document.getElementById("octave-up-button");
	var octaveDownButton = document.getElementById("octave-down-button");
	octaveUpButton.onclick = function() { window.setFreq(window.sliderFreq * 2); }
	octaveDownButton.onclick = function() { window.setFreq(window.sliderFreq / 2); }
     
    window.slider_jq = $("#slider");

    window.sliderFreq = sliderPosToFreq($("#slider").slider("value"));
    window.freqReadout = document.getElementById("freq-readout");
    window.freqReadout.innerHTML = formatHertz(window.sliderFreq);

    window.volSlider_jq = $("#volume-slider");
    
    window.volume = $("#volume-slider").slider("value") / 100;
    $("#volume-readout").html(formatPercent(window.volume));    
    
	window.setFreq = function(targetFreq)	{
        if (targetFreq < 1 || targetFreq > 20154) return false;
		if (targetFreq == window.sliderFreq) return true;
        window.slider_jq.slider("value", freqToSliderPos(targetFreq));
		window.sliderFreq = targetFreq;        
		window.freqReadout.innerHTML = formatHertz(window.sliderFreq);
		if (tones.playing) tones.play(window.sliderFreq);
	}
    window.moveSliderBy = function(delta) {
        var sliderPos = window.slider_jq.slider("value") + delta;
        window.slider_jq.slider("option", "value", sliderPos);
        window.sliderFreq = sliderPosToFreq(sliderPos);
        window.freqReadout.innerHTML = formatHertz(window.sliderFreq);
        if (tones.playing) tones.play(window.sliderFreq);
    }
    
    //populate note selection menu with options:
    var noteSelector = document.getElementById("note-selector");
    for (var key = 1; key <= 88; key++) {
        var newOption = document.createElement("option");
        var frequency = Math.pow(2, (key - 49)/12) * 440;
        newOption.value = key;
        newOption.innerHTML = noteNames[key] + " (" +
            (frequency !== Math.floor(frequency) ? "~" : "") + frequency.toFixed(0) + " Hz)";
        noteSelector.appendChild(newOption);        
    }
    $("#note-selector").selectmenu({
        select: function(event, ui) {
            if (ui.item.value !== "") window.setFreq(Math.pow(2, (ui.item.value - 49)/12) * 440);
        }
    });
	
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

    window.playButton = document.getElementById("play-button");
    window.playIndicator = document.getElementById("play-indicator");
    window.sliderHandle = document.querySelector("#slider .ui-slider-handle");
	window.volSliderHandle = document.querySelector("#volume-slider .ui-slider-handle");
    window.slider_jq = $("#slider");
       
    /*!
     * jQuery UI Touch Punch 0.2.3
     *
     * Copyright 2011–2014, Dave Furfero
     * Dual licensed under the MIT or GPL Version 2 licenses.
     *
     * Depends:
     *  jquery.ui.widget.js
     *  jquery.ui.mouse.js
     */
    !function(a){function f(a,b){if(!(a.originalEvent.touches.length>1)){a.preventDefault();var c=a.originalEvent.changedTouches[0],d=document.createEvent("MouseEvents");d.initMouseEvent(b,!0,!0,window,1,c.screenX,c.screenY,c.clientX,c.clientY,!1,!1,!1,!1,0,null),a.target.dispatchEvent(d)}}if(a.support.touch="ontouchend"in document,a.support.touch){var e,b=a.ui.mouse.prototype,c=b._mouseInit,d=b._mouseDestroy;b._touchStart=function(a){var b=this;!e&&b._mouseCapture(a.originalEvent.changedTouches[0])&&(e=!0,b._touchMoved=!1,f(a,"mouseover"),f(a,"mousemove"),f(a,"mousedown"))},b._touchMove=function(a){e&&(this._touchMoved=!0,f(a,"mousemove"))},b._touchEnd=function(a){e&&(f(a,"mouseup"),f(a,"mouseout"),this._touchMoved||f(a,"click"),e=!1)},b._mouseInit=function(){var b=this;b.element.bind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),c.call(b)},b._mouseDestroy=function(){var b=this;b.element.unbind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),d.call(b)}}}(jQuery);
    
    if (document.addEventListener) document.addEventListener("keydown", handleKeyDown);
}
