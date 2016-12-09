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
import { removeCurly, bindFunction } from './helpers';

// Required Options:
//  animateOptions
//  context
//  dataProperty
var AnimateControl = Control.extend({
  defaults: {
    dataProperty: "_animateControl",
    duration: 400,
    eventScope: "animate-control"
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

          // parse property identifier
          let propertyData = this.parsePropertyIdentifier(propId),
              propertyIdentifier = propertyData.identifier,

          //init bindings
          //TODO: save references somewhere?
          animationBinding = new AnimationBinding(propertyIdentifier, bindingData, options.animateOptions, options.duration),

          //animation method
          _animate = (ev, newVal, oldVal) => {
            return animationBinding.animate(ev, newVal, oldVal);
          };

      //bind to the appropriate scope property/dom event
      if(propertyData.eventType === "dom"){
        if(propertyIdentifier === "removed"){
          //TODO: pass an event to animate if one is available
          can.data($el, '_beforeRemove', cb => _animate().then(cb));
        }else{
          $el.bind(propertyIdentifier + "." + this.options.eventScope, (ev) => {
            _animate(ev);
          });
        }
      }else if(propertyData.eventType === "scope"){
        if(propertyData.logicType === "equals"){
          options.context.bind(propertyIdentifier, (ev, newVal, oldVal) => {
            let checkVal;
            if(typeof propertyData.logicVal === "string" && propertyData.logicVal.indexOf("{") === 0){
              checkVal = this.options.context.attr(removeCurly(propertyData.logicVal));
            }
            if(!checkVal){
              checkVal = propertyData.logicVal;
            }

            if( (propertyData.logicVal === true && newVal) ||
                (propertyData.logicVal === false && !newVal) ||
                (newVal === checkVal) ){
              _animate(ev, newVal, oldVal);
            }

          });
        }else{
          options.context.bind(propertyIdentifier, _animate);
        }
      }
    });
  },

  destroy(){
    can.$(this.element).unbind("." + this.options.eventScope);
  },


  parsePropertyIdentifier(id){
    var identifier = id ? removeCurly(id) : 'inserted';
    var eventType = "scope";
    var logicType, logicVal;
    // starts with $ - dom event ($inserted)
    if(id.indexOf('$') === 0){
      identifier = id.substring(1);
      eventType = "dom";
    }

    // starts with ! - falsey scope event (!someProp)
    if(id.indexOf('!') === 0){
      identifier = id.substring(1);
      logicType = "equals";  
      logicVal = false;
    }

    // ends with ! - truthy scope event (someProp!)
    if(id.indexOf('!') === (id.length-1)){
      identifier = id.substring(0, id.length-1);
      logicType = "equals";
      logicVal = true;
    }

    // contains : - equals (someProp:simple-string-value, someProp:{someOtherProp})
    let equalsAr = id.split(":");
    if(equalsAr.length === 2){
      identifier = equalsAr[0];
      logicType = "equals";
      logicVal = equalsAr[1];
    }

    return {
      identifier,
      eventType,
      logicType,
      logicVal
    }
  }
});

export default AnimateControl;