var op = {
  add: function(x) {
    x = argsToArray(arguments);
    return x.reduce(function(a, b) { return a + b; });
  },

  sub: function(x) {
    x = argsToArray(arguments);
    return x.reduce(function(a, b) { return a - b; });
  },

  mul: function(x) {
    x = argsToArray(arguments);
    return x.reduce(function(a, b) { return a * b; });
  },

  div: function(x) {
    x = argsToArray(arguments);
    return x.reduce(function(a, b) { return a / b; });
  },

  eq: function(x) {
    x = argsToArray(arguments);
    return x[0] === x[1];
  },

  ne: function(x) {
    x = argsToArray(arguments);
    return x[0] !== x[1];
  },

  gt: function(x) {
    x = argsToArray(arguments);
    return x[0] > x[1];
  },

  lt: function(x) {
    x = argsToArray(arguments);
    return x[0] < x[1];
  },

  ge: function(x) {
    x = argsToArray(arguments);
    return x[0] >= x[1];
  },

  le: function(x) {
    x = argsToArray(arguments);
    return x[0] <= x[1];
  },

  cons: function() {
    return argsToArray(arguments);
  },

  car: function(x) {
    return x[0];
  },

  cdr: function(x) {
    return x.slice(1);
  },

  apply: function(x) {
    x = argsToArray(arguments);

    if(x.length !== 2) {
      throw "incorrect number of arguments to `apply' (" + x.length + " for 2)";
    }

    var proc = x.shift();

    return proc.apply(null, x[0]);
  }
};
