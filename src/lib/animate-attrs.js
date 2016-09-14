import { removeCurly, bindFunction } from './helpers';

export default {
  "options": {
    setup(el, key, attrVal) {
      //TODO: handle string values
      //    a) key not on context (attrVal is string like 'fade' or similar (can-animate="fade"))
      //    b) key on contxt but is a string
      //these should set up in and out animations based on string value
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

      if(!this.options.hooks){
        this.options.hooks = {};
      }
      this.options.hooks["inserted"] = {
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
      if(!this.options.hooks){
        this.options.hooks = {};
      }
      this.options.hooks["removed"] = {
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
      if(!this.options.hooks){
        this.options.hooks = {};
      }
      this.options.hooks["inserted"] = {
        run:"fade-in"
      }
      this.options.hooks["removed"] = {
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
      if(!this.options.hooks){
        this.options.hooks = {};
      }

      this.when = when;
      this.options.hooks[this.when] = {
        "when":true
      }
    }
  },
  // "style": {
  //   setup: function (el, css) {
  //     var style = removeCurly(css),
  //       properties = {};
  //     if (style === css) {
  //       var props = css.split(';');
  //       can.each(props, val => {
  //         var split = val.split(':');
  //         properties[can.trim(split[0])] = can.trim(split[1]);
  //       });
  //     } else {
  //       var fromCtx = this.context.attr(style);
  //       properties = fromCtx.attr ? fromCtx.attr() : fromCtx;
  //     }

  //     this.properties = properties;
  //   }
  // },
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