'use strict';

var Env = require('./env.js');

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
    // pop if
    x.shift();

    if (x.length !== 3) {
      throw this._argCountError('if', x.length, 3);
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
      throw this._argCountError('define', x.length, 2);
    }

    var name = x[0];
    var exp = x[1];

    env[name] = _this.evaluate(exp, env);

    return env[name];
  } else if (x[0] === 'set!') {
    // Pop set!
    x.shift();

    if (x.length !== 2) {
      throw this._argCountError('set!', x.length, 2);
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

Interpreter.prototype.parse = function(s) {
  return this._readFrom(this._tokenize(s));
};

Interpreter.prototype._tokenize = function(s) {
  // Add spaces around parens, split on whitespace, and remove empty strings.
  return s
    .replace(/\(/g, ' ( ')
    .replace(/\)/g, ' ) ')
    .split(' ')
    .filter(function(t) {
      return t !== '';
    });
};

Interpreter.prototype._atom = function(token) {
  var f = parseFloat(token);

  if (!isNaN(f)) {
    return f;
  }

  return token;
};

Interpreter.prototype._readFrom = function(tokens) {
  var _this = this;

  if (tokens.length === 0) {
    throw 'unexpected EOF';
  }

  var token = tokens.shift();

  if (token === '(') {
    var l = [];

    while (tokens[0] !== ')') {
      l.push(_this._readFrom(tokens));
    }

    // pop )
    tokens.shift();

    return l;
  } else if (token === ')') {
    throw 'unexpected `)\'';
  } else {
    return _this._atom(token);
  }
};

Interpreter.prototype._argCountError = function(name, passed, required) {
  return 'wrong number of arguments to `' + name + '\' (' + passed +
         ' for ' + required + ')';
};

module.exports = Interpreter;
