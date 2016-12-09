export var removeCurly = (value) => {
  if (value[0] === '{' && value[value.length - 1] === '}') {
    return value.substr(1, value.length - 2);
  }

  return value;
};

export var bindFunction = function (fn) {
  return this.context[removeCurly(fn)];
};

export var expandAnimateObject = function(data, globalData, defaultDuration){
  var animateObject = {
    duration: data.duration
  };

  //set up duration
  if(typeof(animateObject.duration) === 'undefined'){
    animateObject.duration = globalData.duration;
  }
  if(typeof(animateObject.duration) === 'undefined'){
    animateObject.duration = defaultDuration
  }

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
  if(typeof(data) === "string" || typeof(data) === "function"){
    data = {
      "run": data
    };
  }

  // Handle a property being an object
  //ex: 
  // "inserted": {
  //  "run": function(opts){},
  //  "before": function(opts){},
  //  "after": function(opts){}
  // }
  if(can.$.isPlainObject(data)){
    animateObject.before = data.before;
    animateObject.after = data.after;
    animateObject.run = data.run;
  }

  // handle a property being a map
  if(data instanceof can.Map){
    animateObject.before = data.attr('before');
    animateObject.after = data.attr('after');
    animateObject.run = data.attr('run');
  }

  return animateObject;
}