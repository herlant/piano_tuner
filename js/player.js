/*!
 *
 * Copyright 2016, Laura and Francois Herlant
 *
 */



/* This is a variable called player.
 * It contains all the variables and functions needed to generate
 * the sounds that this gui creates.
 */
var player=
{
    // These are variables within player that can be accessed

    playing:false,          // A boolean which indicates whether the player is playing something on either channel
    volume:1,               // Overall volume of both channels, range 0-1
    n_harmonics:9,          // Number of harmonics - should match the number of harmonic buttons. Default is 9
    fade_time:0.1,
    
    left_en:false,           // Enable playing on the left channel
    left_oscillators:[], // Array containing the oscillators for the left channel (should be n_harmonics+1 oscillators per channel)
    left_gain_nodes:[],   // Array for gain nodes on the left channel, corresponds to the oscillators
    left_harmonics_en:[], // Boolean array of length n_harmonics showing which are enabled
    left_f0:440,
    left_damping:1.0,            // Damping coefficient, range 0-1
    
    right_en:false,          // Enable playing on the right channel
    right_oscillators:[], // Array containing the oscillators for the right channel (should be n_harmonics+1 oscillators per channel)
    right_gain_nodes:[],  // Array for gain nodes on the right channel, corresponds to the oscillators
    right_harmonics_en:[],// Boolean array of length n_harmonics showing which are enabled
    right_f0:440,
    right_damping:1.0,            // Damping coefficient, range 0-1
    
    stereo:true,

    // These are functions that are called internally
    update:function()
    {
        var t = window.context.currentTime;
        if(this.playing) {
            // left channel
            if(this.left_en){
                this.left_oscillators[0].frequency.value = this.left_f0; //set fundamental frequency
                this.left_gain_nodes[0].gain.linearRampToValueAtTime(this.volume, t+this.fade_time); // start fundamental frequency playing
                
                for(var i=1; i<this.n_harmonics+1; i++) { // loop over harmonics
                    this.left_oscillators[i].frequency.value = this.left_f0*(i+1); // set harmonic frequency
                    if(this.left_harmonics_en[i]) { // if harmonics is enabled, start the oscillator
                        var new_gain = this.volume*Math.pow(this.left_damping,i);
                        this.left_gain_nodes[i].gain.linearRampToValueAtTime(new_gain, t+this.fade_time); // set gain to the right level with fade
                    } else { //otherwise stop the oscillator for that harmonic
                        this.left_gain_nodes[i].gain.linearRampToValueAtTime(0, t+this.fade_time);
                    }
                }
            } else {
                for(var i=0; i<this.n_harmonics+1; i++) {
                    this.left_gain_nodes[i].gain.linearRampToValueAtTime(0, t+this.fade_time);
                }
            }
            
            // right channel
            if(this.right_en){
                this.right_oscillators[0].frequency.value = this.right_f0; //set fundamental frequency
                this.right_gain_nodes[0].gain.linearRampToValueAtTime(this.volume, t+this.fade_time); // start fundamental frequency playing
                
                for(var i=1; i<this.n_harmonics+1; i++) { // loop over harmonics
                    this.right_oscillators[i].frequency.value = this.right_f0*(i+1); // set harmonic frequency
                    if(this.right_harmonics_en[i]) { // if harmonics is enabled, start the oscillator
                        var new_gain = this.volume*Math.pow(this.right_damping,i);
                        this.right_gain_nodes[i].gain.linearRampToValueAtTime(new_gain, t+this.fade_time); // set gain to the right level with fade
                    } else { //otherwise stop the oscillator for that harmonic
                        this.right_gain_nodes[i].gain.linearRampToValueAtTime(0, t+this.fade_time);
                    }
                }
            } else {
                for(var i=0; i<this.n_harmonics+1; i++) {
                    this.right_gain_nodes[i].gain.linearRampToValueAtTime(0, t+this.fade_time);
                }
            }
            
        } else { // Stop all oscillators
            for(var i=0; i<this.n_harmonics+1; i++)
            {
                //this.left_oscillators[i].stop();
                this.left_gain_nodes[i].gain.linearRampToValueAtTime(0, t+this.fade_time);
                //this.right_oscillators[i].stop();
                this.right_gain_nodes[i].gain.linearRampToValueAtTime(0, t+this.fade_time);
            }
        }
    },
    
    init:function()
    {
        var f0 = 440;
        this.merger_node = window.context.createChannelMerger(2);
        
        // intially disable all harmonics
        for(var i=0; i<this.n_harmonics; i++){
            this.left_harmonics_en.push(false);
            this.right_harmonics_en.push(false);
        }
        
        silence = window.context.createBufferSource();
        silence.connect(this.merger_node, 0, 0);
        silence.connect(this.merger_node, 0, 1);
        
        for(var i=0; i<this.n_harmonics+1; i++){
            // Create oscillators
            this.left_oscillators.push(window.context.createOscillator());
            this.right_oscillators.push(window.context.createOscillator());
            // Create gain nodes
            this.left_gain_nodes.push(window.context.createGain());
            this.right_gain_nodes.push(window.context.createGain());
            // Connect gain nodes to oscillators
            this.left_oscillators[i].connect(this.left_gain_nodes[i]);
            this.right_oscillators[i].connect(this.right_gain_nodes[i]);
            // Set initial frequency values
            this.left_oscillators[i].frequency.value = f0*(i+1);
            this.right_oscillators[i].frequency.value = f0*(i+1);
            
            // Connect Gain nodes to the audio output
            //this.left_gain_nodes[i].connect(window.context.destination);
            //this.right_gain_nodes[i].connect(window.context.destination);
            
            // Connect the gain nodes to the merger node
            this.left_gain_nodes[i].connect(this.merger_node, 0, 0);
            this.right_gain_nodes[i].connect(this.merger_node, 0, 1);
            
            // Set gains to zero
            this.left_gain_nodes[i].gain = 0;
            this.right_gain_nodes[i].gain = 0;
            // Start oscillators
            this.left_oscillators[i].start();
            this.right_oscillators[i].start();
        }
        
        // Connect the merger node to the destination
        this.merger_node.connect(window.context.destination);
        
        this.update();
    },
    
    toggle_stereo:function()
    {
        if(this.stereo){
            this.merger_node.disconnect();
            for(var i=0; i<this.n_harmonics+1; i++) {
                this.left_gain_nodes[i].connect(window.context.destination);
                this.right_gain_nodes[i].connect(window.context.destination);
            }
            this.stereo = false;
        } else {
            this.merger_node = window.context.createChannelMerger(2);
            silence = window.context.createBufferSource();
            silence.connect(this.merger_node, 0, 0);
            silence.connect(this.merger_node, 0, 1)
            this.merger_node.connect(window.context.destination);
            for(var i=0; i<this.n_harmonics+1; i++) {
                this.left_gain_nodes[i].connect(this.merger_node, 0, 0);
                this.right_gain_nodes[i].connect(this.merger_node, 0, 1);
            }
            
            
            this.stereo = true;
        }            
    }
   
};




