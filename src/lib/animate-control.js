import can from "can";
import Control from "can/control/";

//overrides jquery animate to use Zone.waitFor so that
//  can Zone will work with jquery animations
////this should not be necessary once https://github.com/canjs/can-zone/issues/78 is resolved
import "./overrides/jquery-animate";

//overrides can.remove
//  and adds a _beforeRemove data property to the element being removed
import "./overrides/can-remove";

import AnimationBinding from './animation-binding';
import animateAttrs from './animate-attrs';
import { removeCurly, bindFunction } from './helpers';

// Required Options:
//  animateOptions
//  context
//  dataProperty
var AnimateControl = Control.extend({
  defaults: {
    dataProperty: "_animateControl",
    duration: 400
  },

  getOptionsFromAttrData(element, attrData){

      var $el = $(element),
          val = $el.attr("can-animate"),
          options = attrData.scope._context.attr(removeCurly(val));

      options = options.attr ? options.attr() : options;

      return options;
  }
},{
  init($el, options){
    console.log("AnimateControl", this, arguments);

    can.data($el, options.dataProperty, this);

    //TODO: this is ugly - it should be cleaner
    options.animateOptions.el = $el;
    options.animateOptions.context = this.options.context;

    //set up each hook
    can.each(options.animateOptions.bindings, (bindingData, propId) => {

          // expand bindingData
      let animateObject = this.makeAnimateObject(bindingData),

          // parse property identifier
          propertyIdentifier = this.parsePropertyIdentifier(propId),

          //init bindings
          //TODO: save references somewhere?
          animationBinding = new AnimationBinding(propertyIdentifier, animateObject, options.animateOptions, animateAttrs),

          //animation method
          _animate = () => {
            return animationBinding.animate();
          };

      if (['inserted', 'removed'].indexOf(propertyIdentifier) !== -1){
        if (propertyIdentifier === 'removed') {
          can.data($el, '_beforeRemove', cb => _animate().then(cb));
        } else {
          $el.bind(propertyIdentifier, _animate);
        }
      } else {
        options.context.bind(propertyIdentifier, _animate);
      }
    });
  },

  destroy(){
    //TODO
  },

  //takes the binding and expands it into an animate object
  // if it is a string, get object from the mixins
  // then turn the object into an animateObject
  makeAnimateObject(data){
    //TODO: remove this

    if(typeof(data.duration) === 'undefined'){
      data.duration = this.options.animateOptions.duration;
    }
    if(typeof(data.duration) === 'undefined'){
      data.duration = this.options.duration;
    }
    return data;



    //TODO: if it's a string, look for the value in this.options.animateOptions.mixins

    //TODO: if it's an object, expand animate object
    // return new AnimateObject(data)
  },


  parsePropertyIdentifier(id){
    return id ? removeCurly(id) : 'inserted'
  }
});

export { animateAttrs };
export default AnimateControl;