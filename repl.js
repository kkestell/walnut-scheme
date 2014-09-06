var readline = require('readline');
var Interpreter = require('./walnut');

var interpreter = new Interpreter();

var rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt('>>> ');

console.log('Walnut Scheme');
console.log('Type "help" for more information, or type "quit".');

rl.prompt();

rl.on('line', function(x) {
  if (x === 'quit') {
    rl.close();
  } else if (x === 'help') {
    console.log('+, -, *, /, =, !=, <, >, <=, >=, cons, car, cdr, apply, set!, define, lambda, if');
  } else {
    try {
      var val = interpreter.evaluate(interpreter.parse(x));

      if (val !== null) {
        console.log(interpreter.toString(val));
      }
    } catch(ex) {
      console.log(ex);
      return;
    }
  }

  rl.prompt();
}).on('close',function(){
  process.exit(0);
});
