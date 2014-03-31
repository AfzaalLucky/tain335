(+ 3 5)

(- 9 8)

(define pi 3.14)
(define r 5)
(* pi r r)
(define circumference (* 2 pi r))
circumference

(* (+ 2 (* 4 6))(+ 3 5 7))

(* (+ 2 (* 4 6))(+ 3 5 7))

(define (square x)(* x ))
(square 5)
(define (some-of-squares x y)(+(square x)(square y)))
(some-of-squares 3 4)

(define (f a)(some-of-squares (+ a 1) (+ a 2)))
(f 5)

(define (abs x)
  (cond ((> x 0) x)
	((= x 0) 0)
	((< x 0) (- x))))
(abs (- 5))

(define (abs1 x)(if (< x 0)(- x) x))

(abs1 (- 4))