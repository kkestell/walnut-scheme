'use strict';

function Env(params, args, outer) {
  this.outer = outer;

  if (params !== undefined && args !== undefined) {
    for (var i = 0; i < params.length; i++) {
      this[params[i]] = args[i];
    }
  }

  this._op = {
    add: function() {
      var x = Array.prototype.slice.call(arguments);
      return x.reduce(function(a, b) { return a + b; });
    },

    sub: function() {
      var x = Array.prototype.slice.call(arguments);
      return x.reduce(function(a, b) { return a - b; });
    },

    mul: function() {
      var x = Array.prototype.slice.call(arguments);
      return x.reduce(function(a, b) { return a * b; });
    },

    div: function() {
      var x = Array.prototype.slice.call(arguments);
      return x.reduce(function(a, b) { return a / b; });
    },

    eq: function(a, b) {
      return a === b;
    },

    ne: function(a, b) {
      return a !== b;
    },

    gt: function(a, b) {
      return a > b;
    },

    lt: function(a, b) {
      return a < b;
    },

    ge: function(a, b) {
      return a >= b;
    },

    le: function(a, b) {
      return a <= b;
    },

    cons: function() {
      return Array.prototype.slice.call(arguments);
    },

    car: function(x) {
      return x[0];
    },

    cdr: function(x) {
      return x.slice(1);
    },

    apply: function() {
      var x = Array.prototype.slice.call(arguments);

      if (x.length !== 2) {
        throw this._argCountError('apply', x.length, 2);
      }

      var proc = x.shift();

      return proc.apply(null, x[0]);
    }
  };
}

Env.prototype.find = function(name) {
  if (name in this) {
    return this;
  } else {
    if (this.outer === undefined) {
      throw 'undefined reference to `' + name + '\'';
    } else {
      return this.outer.find(name);
    }
  }
};

Env.prototype.set = function(name, exp) {
  this[name] = exp;
};

Env.prototype.addGlobals = function() {
  var op = this._op;

  var globals = {
    '+': op.add,
    '-': op.sub,
    '*': op.mul,
    '/': op.div,
    '=': op.eq,
    '!=': op.ne,
    '>': op.gt,
    '<': op.lt,
    '>=': op.ge,
    '<=': op.le,
    'cons': op.cons,
    'car': op.car,
    'cdr': op.cdr,
    'apply': op.apply
  };

  for(var attrname in globals) {
    this[attrname] = globals[attrname];
  }
};

module.exports = Env;
