function Env(params, args, outer) {
  this.outer = outer;

  if (params !== undefined && args !== undefined) {
    for (var i = 0; i < params.length; i++) {
      this[params[i]] = args[i];
    }
  }
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

function Interpreter() {
  this.globalEnv = new Env();
  this.globalEnv.addGlobals();
}

Interpreter.prototype.evaluate = function(x, env) {
  var _this = this;

  if (env === undefined) {
    env = _this.globalEnv;
  }

  if (typeof x === 'string') {
    return env.find(x)[x];
  } else if (!Array.isArray(x)) {
    return x;
  } else if (x[0] === 'lambda') {
    // pop lambda
    x.shift();

    var params = x[0];
    var exp = x[1];

    return function() {
      var args = Array.prototype.slice.call(arguments);
      return _this.evaluate(exp, new Env(params, args, env));
    };
  } else if (x[0] === 'if') {
    x.shift(); // pop if

    if (x.length !== 3) {
      throw 'incorrect number of arguments to `if\' (' + x.length + ' for 3)';
    }

    var test = x[0];
    var thenExp = x[1];
    var elseExp = x[2];

    if (_this.evaluate(test, env)) {
      return _this.evaluate(thenExp, env);
    } else {
      return _this.evaluate(elseExp, env);
    }
  } else if (x[0] === 'define') {
    // pop define
    x.shift();

    if (x.length !== 2) {
      throw 'incorrect number of arguments to `define\' (' + x.length +
        ' for 2)';
    }

    var name = x[0];
    var exp = x[1];

    env[name] = _this.evaluate(exp, env);

    return env[name];
  } else if (x[0] === 'set!') {
    // Pop set!
    x.shift();

    if (x.length !== 2) {
      throw 'incorrect number of arguments to `set!\' (' + x.length + ' for 2)';
    }

    var name = x[0];
    var exp = x[1];
    var val = _this.evaluate(exp, env);

    env.set(name, val);

    return val;
  } else {
    var exps = [];

    x.forEach(function(exp) {
      exps.push(_this.evaluate(exp, env));
    });

    var proc = exps.shift();

    if (typeof proc !== 'function') {
      throw proc + ' is not a function';
    }

    return proc.apply(env, exps);
  }
};

Interpreter.prototype.parse = function(s) {
  return this.readFrom(this.tokenize(s));
};

Interpreter.prototype.tokenize = function(s) {
  // Add spaces around parens, split on whitespace, and remove empty strings.
  return s
    .replace(/\(/g, ' ( ')
    .replace(/\)/g, ' ) ')
    .split(' ')
    .filter(function(t) {
      return t !== '';
    });
};

Interpreter.prototype.atom = function(token) {
  var f = parseFloat(token);

  if (!isNaN(f)) {
    return f;
  }

  return token;
};

Interpreter.prototype.readFrom = function(tokens) {
  var _this = this;

  if (tokens.length === 0) {
    throw 'unexpected EOF';
  }

  var token = tokens.shift();

  if (token === '(') {
    var l = [];

    while (tokens[0] !== ')') {
      l.push(_this.readFrom(tokens));
    }

    tokens.shift();

    return l;
  } else if (token === ')') {
    throw 'unexpected `)\'';
  } else {
    return _this.atom(token);
  }
};

Interpreter.prototype.toString = function(x) {
  var _this = this,
      str = '';

  // Recursively call `toString' on expressions, wrapping them in parens, and
  // joining their atoms with a space.
  if (Array.isArray(x)) {
    str += '(';
    str += x
      .map(function(x) {
        return _this.toString(x);
      })
      .join(' ');
    str += ')';
  } else {
    if (typeof x === 'function') {
      str += '#<closure>';
    } else {
      str += x;
    }
  }

  return str;
};

var op = {
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
      throw 'incorrect number of arguments to `apply\' (' + x.length +
        ' for 2)';
    }

    var proc = x.shift();

    return proc.apply(null, x[0]);
  }
};
