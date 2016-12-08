import can from "can";
import stache from "can/view/stache/";
import AnimateControl from "./animate-control";


var processAnimation = (element, attrData) => {

  const dataProperty = "_animateControl";

  if (!can.data(can.$(element), dataProperty)) {
    new AnimateControl(element, {
      animateOptions: AnimateControl.getOptionsFromAttrData(element, attrData),
      context: attrData.scope._context,
      dataProperty
    });
  }

};

can.view.attr('can-animate', processAnimation);
// can.view.attr('can-animate-fade-in', processAnimation);
// can.view.attr('can-animate-fade-out', processAnimation);
// can.view.attr('can-animate-when', processAnimation);
// can.view.attr('can-animate-style', processAnimation);
// can.view.attr('can-animate-options', processAnimation);

export default can.animate;
