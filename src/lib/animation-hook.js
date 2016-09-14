import can from "can";
import Zone from "can-zone";

// falls back to jQuery
can.animate = (el, properties, options) => can.$(el).animate(properties, options);

var AnimationHook = function(hookData, globalData, animateAttrs){

  this.hookData = hookData;
  this.animateAttrs = animateAttrs;

  // handle a property being a string or function
  // convert to object with 'run' property and fall through
  //
  //ex:
  // "inserted": "fade"
  // ->
  // "inserted": { "run": "fade" }
  //
  // ex 2: 
  // "inserted": function(opts){}
  // ->
  // "inserted": { "run": function(opts) {} }
  if(typeof(this.hookData) === "string" || typeof(this.hookData) === "function"){
    this.hookData = {
      "run": this.hookData
    };
  }

  // Handle a property being an object
  //ex: 
  // "inserted": {
  //  "run": function(opts){},
  //  "before": function(opts){},
  //  "after": function(opts){}
  // }
  if(can.$.isPlainObject(this.hookData)){
    this.before = this.hookData.before;
    this.after = this.hookData.after;
    this.run = this.hookData.run;
  }

  // TODO: handle a property being a map



  this.animationData = can.extend(true, {}, globalData, {
    options:this.hookData,
    properties: this.hookData.properties
  });

};


AnimationHook.prototype.animate = function(){
  // console.log("animate");

  let beforeZoneReturnVal,
      runZoneReturnVal;

  return new Zone().run(() => {
    //TODO: if before is an object, assume css - can.$(this.animationData.el).css(this.before);
    if(typeof(this.before) === 'function'){
      beforeZoneReturnVal = this.before(this.animationData);
    }
  }).then(() => {
    if(beforeZoneReturnVal === false){
      return false;
    }

    return new Zone().run(() => {
      // console.log("zoneRun - call _animate");

      var _animate;

      //TODO: 
      // if(can.$.isPlainObject(run)){
      //  assume css properties and animate to it (set this.animationData.properties = this.run, and call can.animate)
      // }

      if(typeof(this.run) === "string"){
        this.animateAttrs[this.run].setup.call(this.animationData, this.animationData.el, this.animationData.options.duration);
        _animate = () => can.animate(this.animationData.el, this.animationData.properties, this.animationData.options);
      }else{
        _animate = () => this.run(this.animationData);
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
          return this.after(this.animationData);
        }
        return false;
      });
      
    });
  });

};


export default AnimationHook;