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

    volume:1,               // Overall volume of both channels, range 0-1
    n_harmonics:9,          // Number of harmonics - should match the number of harmonic buttons. Default is 9
    fade_time:0.1,
    
    left_oscillators:[], // Array containing the oscillators for the left channel (should be n_harmonics+1 oscillators per channel)
    left_gain_nodes:[],   // Array for gain nodes on the left channel, corresponds to the oscillators
    left_harmonics_en:[], // Boolean array of length n_harmonics showing which are enabled
    left_f0:440,
    left_damping:1.0,            // Damping coefficient, range 0-1
    left_inharmonicity:0.0,
    
    right_oscillators:[], // Array containing the oscillators for the right channel (should be n_harmonics+1 oscillators per channel)
    right_gain_nodes:[],  // Array for gain nodes on the right channel, corresponds to the oscillators
    right_harmonics_en:[],// Boolean array of length n_harmonics showing which are enabled
    right_f0:440,
    right_damping:1.0,            // Damping coefficient, range 0-1
    right_inharmonicity:0.0,
    
    stereo:true,

    // These are functions that are called internally
    update:function()
    {
        var t = window.context.currentTime;

        // left channel
        for(var i=0; i<this.n_harmonics; i++) { // loop over harmonics
            this.left_oscillators[i].frequency.value = this.left_f0*(i+1)*Math.sqrt(1+this.left_inharmonicity*Math.pow(i+1,2));
            if(this.left_harmonics_en[i]) { // if this is harmonic is enabled, set the proper gain
                var new_gain = this.volume*Math.pow(this.left_damping,i);
                this.left_gain_nodes[i].gain.linearRampToValueAtTime(new_gain, t+this.fade_time); // set gain to the right level with fade
            } else { //otherwise set the gain to zero
                this.left_gain_nodes[i].gain.linearRampToValueAtTime(0, t+this.fade_time);
            }
        }

        // right channel
        for(var i=0; i<this.n_harmonics; i++) { // loop over harmonics
            this.right_oscillators[i].frequency.value = this.right_f0*(i+1)*Math.sqrt(1+this.right_inharmonicity*Math.pow(i+1,2));
            if(this.right_harmonics_en[i]) { // if this is harmonic is enabled, set the proper gain
                var new_gain = this.volume*Math.pow(this.right_damping,i);
                this.right_gain_nodes[i].gain.linearRampToValueAtTime(new_gain, t+this.fade_time); // set gain to the right level with fade
            } else { //otherwise set the gain to zero
                this.right_gain_nodes[i].gain.linearRampToValueAtTime(0, t+this.fade_time);
            }
        }

    },
    
    init:function()
    {
        // I think the merger node is needed to do the mixing, so I will leave it here
        //this.merger_node = window.context.createChannelMerger(2);
        
        // intially disable all harmonics
        for(var i=0; i<this.n_harmonics; i++){
            this.left_harmonics_en.push(false);
            this.right_harmonics_en.push(false);
        }
        
        //silence = window.context.createBufferSource();
        //silence.connect(this.merger_node, 0, 0);
        //silence.connect(this.merger_node, 0, 1);
        
        for(var i=0; i<this.n_harmonics; i++){
            // Create oscillators
            this.left_oscillators.push(window.context.createOscillator());
            this.right_oscillators.push(window.context.createOscillator());
            // Create gain nodes
            this.left_gain_nodes.push(window.context.createGain());
            this.right_gain_nodes.push(window.context.createGain());
            // Connect gain nodes to oscillators
            this.left_oscillators[i].connect(this.left_gain_nodes[i]);
            this.right_oscillators[i].connect(this.right_gain_nodes[i]);
            
            // Connect Gain nodes to the audio output
            this.left_gain_nodes[i].connect(window.context.destination);
            this.right_gain_nodes[i].connect(window.context.destination);
            
            // Set gains to zero
            this.left_gain_nodes[i].gain = 0;
            this.right_gain_nodes[i].gain = 0;
        }
        
        
        // Connect the merger node to the destination
        //this.merger_node.connect(window.context.destination);

        this.update();
    },
    
    start_oscillators:function()
    {
        for(var i=0; i<this.n_harmonics; i++) {
            // Start oscillators
            this.left_oscillators[i].start();
            this.right_oscillators[i].start();
        }
    },
    
    toggle_stereo:function()
    {
        if(this.stereo){
            //this.merger_node.disconnect();
            //this.left_analyser_node.connect(window.context.destination);
            //this.right_analyser_node.connect(window.context.destination);
            this.stereo = false;
        } else {
            //this.merger_node = window.context.createChannelMerger(2);
            //silence = window.context.createBufferSource();
            //silence.connect(this.merger_node, 0, 0);
            //silence.connect(this.merger_node, 0, 1)
            //this.merger_node.connect(window.context.destination);
            //this.left_analyser_node.connect(this.merger_node, 0, 0);
            //this.right_analyser_node.connect(this.merger_node, 0, 1);
            this.stereo = true;
        }            
    }   
};




