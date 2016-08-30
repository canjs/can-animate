import can from "can";
import stache from "can/view/stache/";
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


can.oldRemove = can.remove;
// wrap the remove function
can.remove = function (wrapped) {
  // console.log("can.remove");
  var preventDefault = false;

  can.each(wrapped, val => {
    if (val.nodeType === 1) {
      var v = $(val),
        before;
      if (before = can.data(v, '_beforeRemove')) {
        preventDefault = true;
        before(() => can.oldRemove.apply(this, [val]));
      }
    }
  });

  if (preventDefault) {
    return wrapped;
  }

  return can.oldRemove.apply(this, arguments);
};

// falls back to jQuery
can.animate = (el, properties, options) => el.animate(properties, options);

var removeCurly = (value) => {
  if (value[0] === '{' && value[value.length - 1] === '}') {
    return value.substr(1, value.length - 2);
  }

  return value;
};

var bindFunction = function (fn) {
  return this.context[removeCurly(fn)];
};

var animateAttrs = {
  "options": {
    setup(el, key) {
      var options = this.context.attr(removeCurly(key));
      options = options.attr ? options.attr() : options;
      this.options = can.extend(this.options, options);
    }
  },
  "duration": {
    setup(el, duration) {
      this.options.duration = parseInt(duration, 10) || duration;
    }
  },
  "easing": {
    setup(el, easing) {
      this.options.easing = easing;
    }
  },
  "fade-in": {
    setup(el, duration) {
      if (el.style.opacity === '') {
        el.style.opacity = 0;
      }

      this.properties.opacity = '1';

      if (duration) {
        this.options.duration = duration;
      }

      if(!this.options.bindings){
        this.options.bindings = {};
      }
      this.options.bindings["inserted"] = {
        run:"fade-in"
      }
    }
  },
  "fade-out": {
    setup(el, duration) {
      this.properties.opacity = 'hide';

      if (duration) {
        this.options.duration = duration;
      }
      if(!this.options.bindings){
        this.options.bindings = {};
      }
      this.options.bindings["removed"] = {
        run:"fade-out"
      }
    }
  },
  "fade-toggle": {
    setup(el, duration) {
      this.properties.opacity = 'toggle';

      if (duration) {
        this.options.duration = duration;
      }
      if(!this.options.bindings){
        this.options.bindings = {};
      }
      this.options.bindings["inserted"] = {
        run:"fade-in"
      }
      this.options.bindings["removed"] = {
        run:"fade-out"
      }
    }
  },
  "inserted": {
    setup(el) {
      animateAttrs['when'].setup.call(this, el, 'inserted')
    }
  },
  "removed": {
    setup(el) {
      animateAttrs['when'].setup.call(this, el, 'removed');
    }
  },
  "when": {
    setup(el, when) {
      if(!this.options.bindings){
        this.options.bindings = {};
      }

      this.when = when;
      this.options.bindings[this.when] = {
        "when":true
      }
    }
  },
  "style": {
    setup: function (el, css) {
      var style = removeCurly(css),
        properties = {};
      if (style === css) {
        var props = css.split(';');
        can.each(props, val => {
          var split = val.split(':');
          properties[can.trim(split[0])] = can.trim(split[1]);
        });
      } else {
        var fromCtx = this.context.attr(style);
        properties = fromCtx.attr ? fromCtx.attr() : fromCtx;
      }

      this.properties = properties;
    }
  },
  "start": {
    setup: function (el, method) {
      this.options.start = bindFunction.call(this, method);
    }
  },
  "complete": {
    setup: function (el, method) {
      this.options.complete = bindFunction.call(this, method);
    }
  }
};

var processAnimation = function (element, attrData) {
  var el = $(element);

  if (can.data(el, "_processed")) {
    return false;
  }

  can.data(el, "_processed", true);

  var animationData = {
    properties: {},
    options: {},
    context: attrData.scope._context,
    el: el
  };

  can.each(element.attributes, attribute => {
    if (attribute.nodeName.indexOf('can-animate-') === 0) {
      var name = attribute.nodeName.replace('can-animate-', ''),
        value = attribute.value;

      if (animateAttrs[name]) {
        animateAttrs[name].setup.call(animationData, element, value);
      }
    }
  });

  if(animationData.options.bindings != null){
    var bindings = animationData.options.bindings;
    delete animationData.options.bindings;

    can.each(bindings, (bindingData, thisBinding) => {
      var before, after, run, bindingProps, thisAnimationData;

      if(typeof(bindingData) === "function"){
        run = bindingData;
      }else if(can.$.isPlainObject(bindingData)){
        before = bindingData.before,
        after = bindingData.after,
        run = bindingData.run,
        bindingProps = bindingData.properties;
      }

      thisAnimationData = can.extend(true, {}, animationData, {
        options:bindingData,
        properties: bindingProps
      });

      var _animate;
      if(run == null){
        _animate = () => can.animate(el, thisAnimationData.properties, thisAnimationData.options);
      }else if(typeof(run) === "string"){
        animateAttrs[run].setup.call(thisAnimationData, element, thisAnimationData.options.duration);
        _animate = () => can.animate(el, thisAnimationData.properties, thisAnimationData.options);
      }else{
        thisAnimationData.el = el;
        _animate = () => run(thisAnimationData);
      }


      //set up before and after
      var animate = () => {
        // console.log("animate");

        let beforeZoneReturnVal,
            runZoneReturnVal;

        new Zone().run(() => {
          if(typeof(before) === 'function'){
            beforeZoneReturnVal = before(thisAnimationData);
          }
        }).then(() => {
          if(beforeZoneReturnVal === false){
            return false;
          }

          new Zone().run(() => {
            // console.log("zoneRun - call _animate");
            runZoneReturnVal = _animate();
          }).then(() => {
            // console.log("zoneRun done - call after");
            if(runZoneReturnVal === false){
              return false;
            }

            if(typeof(after) === 'function'){
              after(thisAnimationData);
            }
            
          });
        });

      };

      var binding = thisBinding ? removeCurly(thisBinding) : 'inserted';

      if (['inserted', 'removed'].indexOf(binding) !== -1){
        if (binding === 'removed') {
          can.data(el, '_beforeRemove', cb => {
            if(typeof(thisAnimationData.options.complete) === 'function'){
              var cb0 = thisAnimationData.options.complete;
              thisAnimationData.options.complete = () => {
                cb0();
                cb();
              };
            }else{
              thisAnimationData.options.complete = cb;
            }
            animate();
          });
        } else {
          el.bind(binding, animate);
        }
      } else {
        thisAnimationData.context.bind(binding, animate);
      }
    });
  }
};

can.view.attr('can-animate-fade-in', processAnimation);
can.view.attr('can-animate-fade-out', processAnimation);
can.view.attr('can-animate-when', processAnimation);
can.view.attr('can-animate-style', processAnimation);
can.view.attr('can-animate-options', processAnimation);

can.animate.animateAttrs = animateAttrs;

export default can.animate;
