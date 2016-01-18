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
!function(h){
    function i(f,e)
    {
        if(!(f.originalEvent.touches.length>1))
        {
            f.preventDefault();
            var n=f.originalEvent.changedTouches[0];
            var m=document.createEvent("MouseEvents");
            
            m.initMouseEvent(e,!0,!0,window,1,n.screenX,n.screenY,n.clientX,n.clientY,!1,!1,!1,!1,0,null)
            f.target.dispatchEvent(m)
        }
    }
    
    if(h.support.touch="ontouchend" in document,h.support.touch)
    {
        var j;
        var g=h.ui.mouse.prototype;
        var l=g._mouseInit;
        var k=g._mouseDestroy;
        
        g._touchStart=function(d)
        {
            var c=this;
            !j&&c._mouseCapture(d.originalEvent.changedTouches[0])&&(j=!0,c._touchMoved=!1,i(d,"mouseover"),i(d,"mousemove"),i(d,"mousedown"))
        };
        
        g._touchMove=function(b)
        {
            j&&(this._touchMoved=!0,i(b,"mousemove"))
        };
        
        g._touchEnd=function(b)
        {
            j&&(i(b,"mouseup"),i(b,"mouseout"),this._touchMoved||i(b,"click"),j=!1)
        };
        
        g._mouseInit=function()
        {
            var a=this;
            a.element.bind({touchstart:h.proxy(a,"_touchStart"),touchmove:h.proxy(a,"_touchMove"),touchend:h.proxy(a,"_touchEnd")});
            l.call(a)
        }
        
        g._mouseDestroy=function()
        {
            var a=this;
            a.element.unbind({touchstart:h.proxy(a,"_touchStart"),touchmove:h.proxy(a,"_touchMove"),touchend:h.proxy(a,"_touchEnd")});
            k.call(a)
        }
    }
}(jQuery);

var FADE_TIME=0.1;
var tones=
{
    playing:false,
    volume:1,
    arrEn:[0,0,0,0,0,0,0,0,0],
    play:function(f)
    {
        this.n = 9;
        this.d = 0.4;
        
        if(!this.playing)
        {
            
            this.oscillators = [];
            this.gainNodes = []
            
            // Create the oscillator objects for the harmonics
            for(var i=0; i<this.n; i++) {
                this.oscillators.push(window.context.createOscillator());
                this.gainNodes.push(window.context.createGain());
                this.oscillators[i].connect(this.gainNodes[i]);
                this.gainNodes[i].connect(window.context.destination);
                
                // Set the frequencies of the perfect harmonics
                this.oscillators[i].frequency.value = f*(i+1);
            }
            this.playing=true;
            
            // Set the gains for playing, and start the oscillators
            for(var i=0; i<this.n; i++) {
                if(this.arrEn[i])
                {
                    this.gainNodes[i].gain.linearRampToValueAtTime(0,window.context.currentTime);
                    this.gainNodes[i].gain.linearRampToValueAtTime(this.volume*Math.pow(this.d,i),window.context.currentTime+FADE_TIME);
                } 
                this.oscillators[i].start(0);
            }
        } 
        else 
        {
            for(var i=0; i<this.n; i++) {
                this.oscillators[i].frequency.value = f*(i+1);
            }
        }
    },
    stop:function()
    {
        if(!this.playing)
        {
            return
        }
        
        var a=window.context.currentTime;
        for(var i=0; i<this.n; i++)
        {
            this.gainNodes[i].gain.linearRampToValueAtTime(this.volume*Math.pow(this.d,i),a+0.05);
            this.gainNodes[i].gain.linearRampToValueAtTime(0,a+0.05+FADE_TIME);
            
            this.oscillators[i].stop(a+0.05+FADE_TIME);
        }
        this.playing=false
    },
    changeVolume:function(a)
    {
        if(this.playing)
        {
            for(var i=0; i<this.n; i++)
            {
                this.gainNodes[i].gain.linearRampToValueAtTime(this.gainNodes[i].gain.value,window.context.currentTime);
                this.gainNodes[i].gain.linearRampToValueAtTime(a,window.context.currentTime+FADE_TIME)
            }
            
        }this.volume=a
    },
    enableHarmonics:function(inEn)
    {
        
        var a=window.context.currentTime;
        for(var i=0; i<this.n; i++)
        {
            if(inEn[i] == 0 && this.arrEn[i] == 1)
            {
                // if the node is on, turn it off
                this.gainNodes[i].gain.linearRampToValueAtTime(this.gainNodes[i].gain.value,a+0.05);
                this.gainNodes[i].gain.linearRampToValueAtTime(0,a+0.05+FADE_TIME);
                console.log('Stopping Node '.concat(i.toString()));
            } else if (inEn[i] == 1 && this.arrEn[i] == 0) 
            {
                // if the node is off, turn it on
                this.gainNodes[i].gain.linearRampToValueAtTime(this.gainNodes[i].gain.value,a);
                this.gainNodes[i].gain.linearRampToValueAtTime(this.volume*Math.pow(this.d,i),a+FADE_TIME);
                console.log('Starting Node '.concat(i.toString()));
            }
        }
        this.arrEn = inEn
    }
};


