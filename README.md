# Walnut Scheme

A small (and incomplete) Scheme interpreter in JavaScript.

    (set! foo 10)
    ===> 10

    (define bar (lambda (x) (+ x foo)))
    ===> #<closure>

    (bar 10)
    ===> 20

    (define sum (lambda (x) (apply + x)))
    ===> #<closure>

    (sum (cons 1 2 3))
    ===> 6

## REPL

A basic REPL is included in the `repl` directory.

## Examples

### +

    (+ 1 2)
    ===> 3

### -

    (- 1 2)
    ===> -1

### *

    (/ 10 2)
    ===> 5

### =

    (= 1 1)
    ===> true

### !=

    (!= 1 2)
    ===> true

### >

    (> 1 0)
    ===> true

### <

    (< 5 10)
    ===> true

### >=

    (>= 1 1)
    ===> true

### <=

    (<= 1 1)
    ===> true

### cons

    (cons 1 2 3)
    ===> (1 2 3)

### car

    (car (cons 1 2 3))
    ===> 1

### cdr

    (cdr (cons 1 2 3))
    ===> (2 3)

### apply

    (apply + (cons 1 2 3))
    ===> 6

### set!

    (set! x 10)
    ===> 10

    x
    ===> 10

### define

    (define x 10)
    ===> 10

    x
    ===> 10

### lambda

    (lambda (x y) (+ x y) 1 2)
    ===> 3

    (define double (lambda (x) (* x 2)))
    ===> #<closure>

    (double 10)
    ===> 20

### if

    (if (> 1 0) 1 2)
    ===> 1
