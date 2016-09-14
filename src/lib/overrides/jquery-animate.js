import can from "can";
import Zone from "can-zone";

//attach Zone.waitFor to the callback of jquery animate methods.
//this should not be necessary once https://github.com/canjs/can-zone/issues/78 is resolved
var oldjqueryanimate = can.$.fn.animate;
can.$.fn.animate = function(prop, speed, easing, callback){
    var args = [...arguments],
        makeComplete = function(oldComplete){
          return Zone.waitFor(function(){
            if(typeof(oldComplete) === "function"){
              //TODO: how to get proper arguments?
              oldComplete.apply(this, arguments);
            }
          });
        },
        cbIndex = -1;

    if(args[3]){ //callback
      cbIndex = 3;
    }else if(!args[3] && args[2]){ //!callback && easing
      cbIndex = 2;
    }else if(can.$.isFunction(args[1])){ //isFunction(speed)
      cbIndex = 1;
    }else if(args.length === 2 && can.$.isPlainObject(args[1])){ // [props, opts]
      let oldAlways = args[1].always;

      args[1].always = makeComplete(oldAlways);

    }

    if(cbIndex > 0){
      let oldComplete = args[cbIndex];
      args[cbIndex] = makeComplete(oldComplete);
    }

    return oldjqueryanimate.apply(this, args);
};