export var removeCurly = (value) => {
  if (value[0] === '{' && value[value.length - 1] === '}') {
    return value.substr(1, value.length - 2);
  }

  return value;
};

export var bindFunction = function (fn) {
  return this.context[removeCurly(fn)];
};