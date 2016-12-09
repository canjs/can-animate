import can from "can";
import Zone from "can-zone";
import { expandAnimateObject } from './helpers';

// falls back to jQuery
can.animate = (el, properties, options) => can.$(el).animate(properties, options);

var AnimationBinding = function(propertyIdentifier, bindingData, globalData, defaultDuration){

  // this.globalData = globalData;
  this.propertyIdentifier = propertyIdentifier;
  this.context = globalData.context;
  this.mixins = globalData.mixins;
  this.$el = can.$(globalData.el);
  this.bindingData = bindingData;

  //if it is a string, get the information from mixins
  if(typeof(this.bindingData) === 'string'){
    if(typeof(this.mixins[this.bindingData]) !== 'undefined'){
      this.animateObject = expandAnimateObject(this.mixins[this.bindingData], globalData, defaultDuration);
    }
  }else{
    this.animateObject = expandAnimateObject(this.bindingData, globalData, defaultDuration);
  }

  this.duration = this.animateObject.duration;
  this.before = this.animateObject.before;
  this.run = this.animateObject.run;
  this.after = this.animateObject.after;

};


AnimationBinding.prototype.animate = function(){
  // console.log("animate");

  let beforeZoneReturnVal,
      runZoneReturnVal;

  return new Zone().run(() => {
    if(typeof(this.before) === 'function'){
      beforeZoneReturnVal = this.before(this);
    }else if(can.$.isPlainObject(this.before)){  // if before is an object, assume css
      beforeZoneReturnVal = true;
      this.$el.css(this.before);
    }
  }).then(() => {
    //allow canceling of further animations
    if(beforeZoneReturnVal === false){
      return false;
    }

    return new Zone().run(() => {
      // console.log("zoneRun - call _animate");

      var _animate;

      if(typeof(this.run) === "string"){
        //by this time, our 'run' should have been converted into either an object or a function 
        console.error("invalid run type");
      }else if(can.$.isPlainObject(this.run)){
       // assume css properties and animate to it
       _animate = () => can.animate(this.$el, this.run, { duration: this.duration });
      }else if(typeof(this.run) === 'function'){
        _animate = () => this.run(this);
      }else{
        console.error("Unknown type for 'run'");
      }

      runZoneReturnVal = _animate();
    }).then(() => {
      // console.log("zoneRun done - call after");
      if(runZoneReturnVal === false){
        return false;
      }

      return new Zone().run(() => {
        //TODO: if after is an object, assume css - can.$(this.animationData.el).css(this.before);

        if(typeof(this.after) === 'function'){
          return this.after(this);
        }
        return false;
      });
      
    });
  });

};


export default AnimationBinding;