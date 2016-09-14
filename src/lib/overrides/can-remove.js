import can from "can";

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