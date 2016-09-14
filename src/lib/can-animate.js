import can from "can";
import stache from "can/view/stache/";

//overrides jquery animate to use Zone.waitFor so that
//  can Zone will work with jquery animations
////this should not be necessary once https://github.com/canjs/can-zone/issues/78 is resolved
import "./overrides/jquery-animate";

//overrides can.remove
//  and adds a _beforeRemove data property to the element being removed
import "./overrides/can-remove";

import AnimationHook from './animation-hook';
import animateAttrs from './animate-attrs';
import { removeCurly, bindFunction } from './helpers';


var initAnimationData = (element, attrData) => {
  let animationData = {
    properties: {},
    options: {},
    context: attrData.scope._context,
    el: element
  };

  can.each(element.attributes, attribute => {
    if (attribute.nodeName === 'can-animate') {
      if (animateAttrs['options']) {
        animateAttrs['options'].setup.call(animationData, element, attribute.value);
      }
    }

    //TODO: helpers for can-animate-in="fade", can-animate-out="slide", etc
    // if (attribute.nodeName.indexOf('can-animate-') === 0) {
    //   var name = attribute.nodeName.replace('can-animate-', ''),
    //     value = attribute.value;

    //   if (animateAttrs[name]) {
    //     animateAttrs[name].setup.call(animationData, element, value);
    //   }
    // }
  });

  //by this point, we should have hooks
  if(animationData.options.hooks == null){
    return false;
  }

  //pull off hooks property from the options so that we can extend it
  var hooks = animationData.options.hooks;
  delete animationData.options.hooks;

  return {
    animationData,
    hooks
  };
};


var processAnimation = (element, attrData) => {
  var $el = can.$(element);
  if (can.data($el, "_processed")) {
    return false;
  }
  can.data($el, "_processed", true);


  var { animationData, hooks } = initAnimationData(element, attrData);

  //set up each hook
  can.each(hooks, (hookData, key) => {
    let animationHook = new AnimationHook(hookData, animationData, animateAttrs),
        _animate = () => {
          return animationHook.animate();
        };

    key = key ? removeCurly(key) : 'inserted';

    if (['inserted', 'removed'].indexOf(key) !== -1){
      if (key === 'removed') {
        can.data($el, '_beforeRemove', cb => _animate().then(cb));
      } else {
        $el.bind(key, _animate);
      }
    } else {
      animationHook.animationData.context.bind(key, _animate);
    }
  });
};

can.view.attr('can-animate', processAnimation);
// can.view.attr('can-animate-fade-in', processAnimation);
// can.view.attr('can-animate-fade-out', processAnimation);
// can.view.attr('can-animate-when', processAnimation);
// can.view.attr('can-animate-style', processAnimation);
// can.view.attr('can-animate-options', processAnimation);

can.animate.animateAttrs = animateAttrs;

export default can.animate;
