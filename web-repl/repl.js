$(function() {
  var interpreter = new Interpreter();

  function log(str) {
    var $output = $('#output');
    $output.val($output.val() + str + '\n');
    $output.scrollTop($output[0].scrollHeight);
  }

  function evalExp(x) {
    log('>>> ' + x);

    try {
      var val = interpreter.evaluate(interpreter.parse(x));
    } catch(ex) {
      log(ex + '\n');
      return;
    }

    if(val !== null) {
      log(interpreter.toString(val));
      log('');
    }
  }

  $('#exp').keypress(function(e) {
    if(e.which === 13) {
      if($(this).val() === 'help') {
        log('>>> help');
        log('+, -, *, /, =, !=, <, >, <=, >=, cons, car, cdr, apply, set!, define, lambda, if\n');
      } else {
        evalExp($(this).val());
      }
      $(this).val('');
    }
  });

  $('#exp').focus();
});
