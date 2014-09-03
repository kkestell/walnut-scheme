function Env(params, args, outer) {
  this.outer = outer;

  if(typeof params !== "undefined" && typeof args !== "undefined") {
    for(var i = 0; i < params.length; i++) {
      this[params[i]] = args[i];
    }
  }
}

Env.prototype.find = function(name) {
  if(name in this) {
    return this;
  } else {
    if(typeof this.outer === "undefined") {
      throw "undefined reference to `" + name + "'";
    } else {
      return this.outer.find(name);
    }
  }
};

Env.prototype.set = function(name, exp) {
  this[name] = exp;
};

Env.prototype.addGlobals = function() {
  var self = this;

  var globals = {
    "+": op.add,
    "-": op.sub,
    "*": op.mul,
    "/": op.div,
    "=": op.eq,
    "!=": op.ne,
    ">": op.gt,
    "<": op.lt,
    ">=": op.ge,
    "<=": op.le,
    "cons": op.cons,
    "car": op.car,
    "cdr": op.cdr,
    "apply": op.apply
  };

  for(var attrname in globals) {
    this[attrname] = globals[attrname];
  }
};
