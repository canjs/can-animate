import can from "can";
import stache from "can/view/stache/";

can.oldRemove = can.remove;
// wrap the remove function
can.remove = function(wrapped){
	var preventDefault = false,
			self = this;

		can.each(wrapped, function(val){
			if(val.nodeType===1){
				var v = $(val),
						before;
				if(before = can.data(v, '_beforeRemove')){
					preventDefault = true;
					before(function(){
						return can.oldRemove.apply(self, [val]);
					});
				}
			}
		});

	if(preventDefault){
		return wrapped;
	}
	return can.oldRemove.apply(this, arguments);
}

// falls back to jQuery
can.animate = function(el, properties, options){
	return el.animate(properties, options);
};

var removeCurly = function (value) {
  if (value[0] === '{' && value[value.length - 1] === '}') {
      return value.substr(1, value.length - 2);
  }
  return value;
};

var bindFunction = function(fn){
	var fn = removeCurly(fn);
	return this.context[fn];
};

var animateAttrs = {
	"options": {
		setup: function(el, key){
			var options = this.context.attr(removeCurly(key));
			options = options.attr ? options.attr() : options;
			this.options = can.extend(this.options, options);
		}
	},
	"duration": {
		setup: function(el, duration){
			this.options.duration = parseInt(duration, 10) || duration;
		}
	},
	"easing": {
		setup: function(el, easing){
			this.options.easing = easing;
		}
	},
	"fade-in": {
		setup: function(el, duration){
			if(el.style.opacity === ''){
				el.style.opacity = 0;
			}

			this.properties.opacity = '1';

			if(duration){
				this.options.duration = duration;
			}
		}
	},
	"fade-out": {
		setup: function(el, duration){
			this.properties.opacity = 'hide';

			if(duration){
				this.options.duration = duration;
			}
		}
	},
	"fade-toggle": {
		setup: function(el, duration){
			this.properties.opacity = 'toggle';

			if(duration){
				this.options.duration = duration;
			}
		}
	},
	"inserted": {
		setup: function(el){
			animateAttrs['when'].setup.call(this, el, 'inserted')
		}
	},
	"removed": {
		setup: function(el){
			animateAttrs['when'].setup.call(this, el, 'removed');
		}
	},
	"when": {
		setup: function(el, when){
			this.when = when;
		}
	},
	"style": {
		setup: function(el, css){
			var style = removeCurly(css),
					properties = {};
			if(style === css){
				var props = css.split(';');
				can.each(props, function(val){
					var split = val.split(':');
					properties[can.trim(split[0])] = can.trim(split[1]);
				});
			}else {
				var fromCtx = this.context.attr(style);
				properties = fromCtx.attr ? fromCtx.attr() : fromCtx;
			}

			this.properties = properties;
		}
	},
	"start": {
		setup: function(el, method){
			this.options.start = bindFunction.call(this, method);
		}
	},
	"complete": {
		setup: function(el, method){
			this.options.complete = bindFunction.call(this, method);
		}
	}
}

var processAnimation = function(element, attrData){
	var el = $(element);
	if( !can.data(el, "_processed") ) {
		can.data(el, "_processed", true);

		var animationData = {
			properties: {},
			options: {},
			context: attrData.scope._context
		};

		can.each( element.attributes, function(attribute) {
			if(attribute.nodeName.indexOf('can-animate-')===0){
				var name = attribute.nodeName.replace('can-animate-', ''),
						value = attribute.value;

				if(animateAttrs[name]){
					animateAttrs[name].setup.call(animationData, element, value);
				}
			}
		});

		var animate = function(){
			return can.animate(el, animationData.properties, animationData.options);
		};

		var when = animationData.when ? removeCurly(animationData.when) : 'inserted';
		if(when===(animationData.when || 'inserted')){
			if(when==='removed'){
				can.data(el, '_beforeRemove', function(cb){
					animationData.options.always = cb;
					animate();
				});
			}else{
				el.bind(when, animate);
			}
		}else{
			animationData.context.bind(when, animate);
		}
	}
}

can.view.attr('can-animate-fade-in', processAnimation);
can.view.attr('can-animate-fade-out', processAnimation);
can.view.attr('can-animate-when', processAnimation);
can.view.attr('can-animate-style', processAnimation);

can.animate.animateAttrs = animateAttrs;

export default can.animate;