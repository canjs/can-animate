import can from "can";
import stache from "can/view/stache/";

// falls back to jQuery
can.animate = function(el, properties, options){
	return el.animate(properties, options);
};

var removeCurly = function (value) {
  if (value[0] === '{' && value[value.length - 1] === '}') {
      return value.substr(1, value.length - 2);
  }
  return value;
}

var animateAttrs = {
	"animate": {
		setup: function(el, key){
			//process key to find properties or animate object

		}
	},
	"duration": {
		setup: function(el, duration){
			this.options.duration = duration;
		}
	},
	"easing": {
		setup: function(el, easing){
			this.options.easing = easing;
		}
	},
	"fade-in": {
		setup: function(el, duration){
			el.css('opacity', '0');
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
			animateAttrs['when'].setup(el, 'inserted')
		}
	},
	"removed": {
		setup: function(el){
			animateAttrs['when'].setup(el, 'removed');
		}
	},
	"when": {
		setup: function(el, when){
			this.when = when;
		}
	},
	"style": {
		setup: function(el, css, ctx){
			var style = removeCurly(css),
					properties = {};
			if(style === css){
				var props = css.split(';');
				can.each(props, function(val){
					var split = val.split(':');
					properties[split[0]] = can.trim(split[1]);
				});
			}else {
				var fromCtx = ctx.attr(style);
				properties = fromCtx.attr ? fromCtx.attr() : fromCtx;
			}

			this.properties = properties;
		}
	},
	"start": {
		setup: function(el, method){

		}
	},
	"complete": {
		setup: function(el, method){
			
		}
	}
}

var processAnimation = function(element, attrData){
	var el = $(element);
	if( !can.data(el, "_processed") ) {
		can.data(el, "_processed", true);
		var ctx = attrData.scope._context;

		var animationData = {
			properties: {},
			options: {}
		};

		can.each( element.attributes, function(attribute) {
			var name = attribute.nodeName.replace('can-animate-', ''),
					value = attribute.value;

			if(attribute.nodeName.indexOf('can-animate-')===0 
					&& animateAttrs[name]){
				animateAttrs[name].setup.call(animationData, el, value, ctx);
			}
		});

		var animate = function(){
			return can.animate(el, animationData.properties, animationData.options);
		};

		var when = animationData.when ? removeCurly(animationData.when) : 'inserted';
		if(when===(animationData.when || 'inserted')){
			el.bind(when, animate);
		}else{
			ctx.bind(when, animate);
		}
	}
}

can.view.attr('can-animate-fade-in', processAnimation);
can.view.attr('can-animate-fade-out', processAnimation);
can.view.attr('can-animate-when', processAnimation);
can.view.attr('can-animate-style', processAnimation);

export default can.animate;