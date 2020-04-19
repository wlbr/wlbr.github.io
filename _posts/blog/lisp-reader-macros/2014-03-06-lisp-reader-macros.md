---
layout: post
category: blog
title: "Reader Macros in Common Lisp"
#description = ""
tags: lisp  "common lisp" development github
date: 2014-03-06
author: "Chaitanya Gupta"
---


Reader macros are perhaps not as famous as ordinary macros. While macros are a great way to create your own DSL, reader macros provide even greater flexibility by allowing you to create entirely new syntax on top of Lisp.


<hr>

_Note: This article is not mine, but written by Chaitanya Gupta. I think it is pretty excellent and want to preserve it here for the future. Read macros are an important part of Lisp, but documentation of this feature is very hard to find. The original location of this text is [https://gist.github.com/chaitanyagupta/9324402](https://gist.github.com/chaitanyagupta/9324402) (at least it was in March 2014)_

<hr>

Paul Graham explains them very well in [On Lisp][] (Chapter 17, Read-Macros):

> The three big moments in a Lisp expression's life are read-time, compile-time, and runtime. Functions are in control at runtime. Macros give us a chance to perform transformations on programs at compile-time. ...read-macros... do their work at read-time.

> Macros and read-macros see your program at different stages. Macros get hold of the program when it has already been parsed into Lisp objects by the reader, and read-macros operate on a program while it is still text. However, by invoking read on this text, a read-macro can, if it chooses, get parsed Lisp objects as well. Thus read-macros are at least as powerful as ordinary macros.

(Note that read-macros and reader macros mean the same thing)

The Lisp reader is the thing that parses and translates raw text into an AST. In Lisp, the AST is better known as an s-expression (or sexp) -- its either an [atom][] or a [list][].

Reader macros allow you to modify the behaviour of the Lisp reader.

Not only can you modify the behaviour of the Lisp reader, you can also invoke it. The simplest way to invoke the Lisp reader is to call the function [`READ`][read]. When you call `READ` with no arguments, it reads text from the standard input and returns an s-expression as soon as it fully parses one.

```lisp
> (read)
;; Provide this input: foo
FOO

> (read)
;; Input: (foo 1 2 3)
(FOO 1 2 3)
```

The full syntax of `READ` looks like this:

```lisp
(read &optional input-stream eof-error-p eof-value recursive-p) => object
```

All the arguments to `READ` are optional. The first is the input stream; `eof-error-p` and `eof-value` specify end of file handling; `recursive-p` should be set to true whenever `READ` is called from inside another call to `READ`. When implementing reader macros, `recursive-p` should always be true.

## Quote

One of the simplest (and earliest) examples of a reader macro in Lisp is the single quote character `'`. This reader macro translates an expression of the form `'<some-form>` into `(quote <some-form>)`.

```lisp
'foo       ;; translated to (quote foo)
'(1 2 3)   ;; translated to (quote (1 2 3))
```

Simply put, the single quote character `'` is a little bit of syntactic sugar added on top of Lisp. Reader macros do just that -- allow you to add syntactic sugar to Lisp. What makes them so powerful is that, just like ordinay macros, you write reader macros in Lisp itself. For example, `'` could be defined as:

```lisp
(defun single-quote-reader (stream char)
   (declare (ignore char))
   (list 'quote (read stream t nil t)))

(set-macro-character #\' #'single-quote-reader)
```

[`SET-MACRO-CHARACTER`][set-macro-character] makes the Lisp reader associate the single quote character `'` with the function `single-quote-reader`. Whenever the reader encounters `'`, it calls `single-quote-reader`. This function takes two arguments -- the input stream and the character in the stream that triggered the call. `char` will always be `'` in this case.

Let's trace step by step how this works. Assume we call `READ` on the following form:

```lisp
> (read)
;; Input: 'foo
```

When `READ` is invoked, this is how the input stream looks:

```lisp
'foo
^
```

The current position of the stream is denoted by `^`. When `READ` is called, the next character in the stream is the quote. The reader reads this character, looks for its reader macro function, finds `single-quote-reader` and calls it. Just before `single-quote-reader` is called, this is how the stream looks:

```lisp
 'foo
 ^
```

`single-quote-reader` calls `READ` again. The inner call to `READ` returns the symbol `foo`, so the return value of this function is the sexp `(quote foo)` (usually printed by the Lisp printer as `'foo`).

After `single-quote-reader` returns, the stream pointer moves beyond `foo`. [1]

```lisp
'foo
    ^
```

## JSON

Let's work with a more complicated example. Let's make the Lisp reader recognize [JSON][] syntax.

```lisp
> [1, 2, "foo"]
#(1 2 "foo")

> { "foo": 1, "bar": 2 }
#<HASH-TABLE :TEST EQUAL :COUNT 2 {1004EA5DD3}>
```

We define a few constants to work with.

```lisp
(defconstant +left-bracket+ #\[)
(defconstant +right-bracket+ #\])
(defconstant +left-brace+ #\{)
(defconstant +right-brace+ #\})
(defconstant +comma+ #\,)
(defconstant +colon+ #\:)
```

To read JSON arrays, we dispatch the left bracket to `read-left-bracket`.

```lisp
(defun read-left-bracket (stream char)
  (declare (ignore char))
  (let ((*readtable* (copy-readtable)))
    (set-macro-character +comma+ 'read-separator)
    ...
    ))

(set-macro-character +left-bracket+ 'read-left-bracket)
```

Note that I haven't provided a complete definition for `read-left-bracket` yet. The [readtable][] is an object that stores the association between characters and their reader macro functions, if any. [`*READTABLE*`][*readtable*] is a [dynamic variable][] that specifies the current readtable. `read-left-bracket` binds the current readtable to a copy of itself, and causes the comma character `,` to be associated with `read-separator` (which we will see shortly). The reason we copy and rebind the current readtable is to avoid clobbering the readtable entry for comma outside of the dynamic scope of `read-left-bracket`.

Here's the complete definition for `read-left-bracket`:

```lisp
(defun read-next-object (separator delimiter
                         &optional (input-stream *standard-input*))
  (flet ((peek-next-char () (peek-char t input-stream t nil t))
         (discard-next-char () (read-char input-stream t nil t)))
    (if (and delimiter (char= (peek-next-char) delimiter))
        (progn
          (discard-next-char)
          nil)
        (let* ((object (read input-stream t nil t))
               (next-char (peek-next-char)))
          (cond
            ((char= next-char separator) (discard-next-char))
            ((and delimiter (char= next-char delimiter)) nil)
            (t (error "Unexpected next char: ~S" next-char)))
          object))))

(defun read-left-bracket (stream char)
  (declare (ignore char))
  (let ((*readtable* (copy-readtable)))
    (set-macro-character +comma+ 'read-separator)
    (loop
       for object = (read-next-object +comma+ +right-bracket+ stream)
       while object
       collect object into objects
       finally (return `(vector ,@objects)))))
```

The bulk of the work of reading JSON objects is done by `read-next-object` -- `read-left-bracket` calls this function repeatedly until it returns `NIL`. The list of objects is then transformed into `(vector obj1 obj2 ...)` which, at runtime, will return a Lisp vector.

`read-next-object` takes three arguments: a delimiter, which indicates the end of a JSON array or object (i.e. right bracket or right brace); a separator, which separates objects inside a JSON array (comma) or object (comma or colon) and an optional stream argument that defaults to standard input. When `read-next-object` is first called inside an array the stream would be positioned just before the first object.

```lisp
[1, 2, "foo"]
```     ^

`read-next-object` parses and returns the first object (the number `1` in this case), and positions the stream before the next object, discarding the separator. If there was any whitespace before the first object, it would be discarded.

```lisp
[1, 2, "foo"]
```      ^

This cycle repeats until `read-next-object` reads the last object in the array, `"foo"`. Since the next non-whitespace character after reading `"foo"` is not the separator but rather the delimiter, `read-next-object` returns `"foo"` but doesn't try to read past the delimiter.

```lisp
[1, 2, "foo"]
```                ^

The last call to `read-next-object` notices that the next character is the delimiter. It moves the stream past the delimiter and returns `NIL`, which indicates to `read-left-bracket` that all the objects in the array have been read. Since the stream pointer is now positioned after the delimiter, the reader is now free to read a new object from the input stream.

```lisp
[1, 2, "foo"]          ^
```

This is how we define `read-separator`, the reader macro function for comma. This function signals an error whenever it is called -- it is never meant to be called directly by the reader.

```lisp
(defun read-separator (stream char)
  (declare (ignore stream))
  (error "Separator ~S shouldn't be read alone" char))
```

You might ask, if the separator is never meant to be read directly by the reader, why bother associating it with a macro function? The thing is, its not the macro function that's important -- what we really want to do is tell the Lisp reader that the separator is a _terminating_ macro character. If this were not done, the Lisp reader could unwittingly treat the separator as part of the last object if there was no whitespace between the two. e.g. in `[foo, ...]`, the first object would be read as `foo,` instead of `foo` if comma was not a terminating macro character. [2]

Lastly, we also need to define a macro function for the right bracket. This needs to be done for the same reason we needed to define a macro function for the separator -- so that we can tell the Lisp reader that it is a terminating macro character.

```lisp
(defun read-delimiter (stream char)
  (declare (ignore stream))
  (error "Delimiter ~S shouldn't be read alone" char))

(set-macro-character +right-bracket+ 'read-delimiter)
```

Now we have everything in place to read a JSON array in Lisp. Time for some tests.

```lisp
> []
#()

> [1, 2, 3]
#(1 2 3)

> [ "foo", "bar", "baz" ]
#("foo" "bar" "baz")

> [1, 2, "foo"]
#(1 2 "foo")
```

Since we recursively call `READ` to read individual objects, nesting also works.

```lisp
> [1, 2, [3, 4]]
#(1 2 #(3 4))
```

We can even use Lisp forms inside a JSON array, and they will work just fine.

```lisp
> (let ((x 123) (y "foo")) [x, y])
#(123 "foo")
```

Remember that you can invoke the reader by calling `READ`, so you can always see the generated sexp for yourself.

```lisp
> (read)
;; Input: [1, 2, "foo"]
(VECTOR 1 2 "foo")

> (read)
;; Input: (let ((x 123) (y "foo")) [x, y])
(LET ((X 123) (Y "foo"))
    (VECTOR X Y))
```

Reading an object is not that different from reading an array. First we define a convenience function to create Lisp hash tables which will be used by `read-left-brace`, the macro function for the left brace.

```lisp
(defun create-json-hash-table (&rest pairs)
  (let ((hash-table (make-hash-table :test #'equal)))
    (loop for (key . value) in pairs
       do (setf (gethash key hash-table) value))
    hash-table))
```

And here's `read-left-brace`. Note that this function also relies on `read-next-object` to get the bulk of its work done.

```lisp
(defun read-left-brace (stream char)
  (declare (ignore char))
  (let ((*readtable* (copy-readtable)))
    (set-macro-character +comma+ 'read-separator)
    (set-macro-character +colon+ 'read-separator)
    (loop
       for key = (read-next-object +colon+ +right-brace+ stream)
       while key
       for value = (read-next-object +comma+ +right-brace+ stream)
       collect `(cons ,key ,value) into pairs
       finally (return `(create-json-hash-table ,@pairs)))))

(set-macro-character +left-brace+ 'read-left-brace)
```

Finally, we also associate right brace with a macro function.

```lisp
(set-macro-character +right-brace+ 'read-delimiter)
```

Time for some more tests.

```lisp
CL-USER> {}
#<HASH-TABLE :TEST EQUAL :COUNT 0 {1005EEEBE3}>

> { "foo": 1, "bar": 2, "baz": 3 }
#<HASH-TABLE :TEST EQUAL :COUNT 3 {1004DC3953}>
```

We can also nest objects and arrays.

```lisp
> [{"foo": 1}, "bar", {"baz": [2, 3]}]
#(#<HASH-TABLE :TEST EQUAL :COUNT 1 {10062D4D83}> "bar"
  #<HASH-TABLE :TEST EQUAL :COUNT 1 {10062D5283}>)
```

The generated sexp:

```lisp
> (read)
{ "foo": 1, "bar": 2, "baz": 3 }
(CREATE-JSON-HASH-TABLE (CONS "foo" 1) (CONS "bar" 2) (CONS "baz" 3))
```

## Refining the JSON reader

### true, false, null

Our JSON reader can handle numbers, strings, objects and arrays fairly well. However, it can still not handle three primitives in JSON -- `true`, `false`, and `null`. This is fairly easy to fix. When the reader encounters these JSON primitives, it interprets them as Lisp symbols. All we have to do is transform these into an appropriate Lisp value. To this end, we define a function `transform-primitive`.

```lisp
(defun transform-primitive (value)
  (if (symbolp value)
      (cond
        ((string-equal (symbol-name value) "true") t)
        ((string-equal (symbol-name value) "false") nil)
        ((string-equal (symbol-name value) "null") nil)
        (t value))
      value))
```

`transform-primitive` transforms both `false` and `null` from JSON to `NIL` in Lisp. That's because in Lisp, the two are represented by the same value. You can always choose a different representation if you want.

We can start using `transform-primitive` in our reader macro functions now.

```lisp
(defun read-left-bracket (stream char)
  (declare (ignore char))
  (let ((*readtable* (copy-readtable)))
    (set-macro-character +comma+ 'read-separator)
    (loop
       for object = (read-next-object +comma+ +right-bracket+ stream)
       while object
       collect (transform-primitive object) into objects
       finally (return `(vector ,@objects)))))

(defun read-left-brace (stream char)
  (declare (ignore char))
  (let ((*readtable* (copy-readtable)))
    (set-macro-character +comma+ 'read-separator)
    (set-macro-character +colon+ 'read-separator)
    (loop
       for key = (read-next-object +colon+ +right-brace+ stream)
       while key
       for value = (read-next-object +comma+ +right-brace+ stream)
       collect `(cons ,key ,(transform-primitive value)) into pairs
       finally (return `(create-json-hash-table ,@pairs)))))
```

Let's test this:

```lisp
> [true, false, null]
#(T NIL NIL)
```

### Object keys

While JSON requires that object keys be strict JSON strings (with surrounding double quotes, etc.), Javascript on the other hand doesn't. Object keys in Javascript don't need to be surrounded by double quotes.

When we try to use this syntax with our reader, we get an error.

```lisp
> { foo: 1 }
; Evaluation aborted on #<UNBOUND-VARIABLE FOO {1003AC8E03}>.
```

A look at the generated sexp makes clear why we get the runtime thinks `foo` is unbound.

```lisp
> (read)
;; Input: { foo: 1 }
(CREATE-JSON-HASH-TABLE (CONS FOO 1))
```

This is also easy to fix using the `stringify-key` function.

```lisp
(defun stringify-key (key)
  (etypecase key
    (symbol (string-downcase (string key)))
    (string key)))

(defun read-left-brace (stream char)
  (declare (ignore char))
  (let ((*readtable* (copy-readtable)))
    (set-macro-character +comma+ 'read-separator)
    (set-macro-character +colon+ 'read-separator)
    (loop
       for key = (read-next-object +colon+ +right-brace+ stream)
       while key
       for value = (read-next-object +comma+ +right-brace+ stream)
       collect `(cons ,(stringify-key key) ,(transform-primitive value)) into pairs
       finally (return `(create-json-hash-table ,@pairs)))))
```

Some tests:

```lisp
> { foo: 1 }
#<HASH-TABLE :TEST EQUAL :COUNT 1 {1004248763}>

> (read)
;; Input: { foo: 1 }
(JSON-READER::CREATE-JSON-HASH-TABLE (CONS "foo" 1))
```

### Package marker

One problem with `read-left-brace` is that, within its dymanic scope, it overrides the macro function for colon. The [standard readtable][] in Lisp defines colon to be a package marker for symbols. What this means is that, when parsing a JSON object, we will face problems if a symbol contains a colon.

```lisp
> { foo: cl:pi }
; Evaluation aborted on #<SIMPLE-ERROR "Unexpected next char: ~S" {10043B7083}>.
```

Again, this is not very hard to fix. I will leave that as an exercise to the reader.

## Packaging the new syntax

Apart from creating new functions, we also directly change the current readtable when associating macro functions with characters:

```lisp
(set-macro-character +left-bracket+ 'read-left-bracket)
(set-macro-character +right-bracket+ 'read-delimiter)
(set-macro-character +left-brace+ 'read-left-brace)
(set-macro-character +right-brace+ 'read-delimiter)
```

If we were to package the JSON reader in a library and add these lines as toplevel forms in the library's source code, we would clobber the user's current readtable when the library source was loaded. This is not desirable. What we want instead is to provide user with a hook to enable/disable JSON syntax at will.

So instead of adding these as toplevel forms, we could provide them inside a function:

```lisp
(defun enable-json-syntax ()
  (set-macro-character +left-bracket+ 'read-left-bracket)
  (set-macro-character +right-bracket+ 'read-delimiter)
  (set-macro-character +left-brace+ 'read-left-brace)
  (set-macro-character +right-brace+ 'read-delimiter))
```

Now, when users want to enable JSON syntax from the REPL, they could simply call `enable-json-syntax`.

Enabling this syntax inside a source file is a bit trickier. Let's assume we write our file like this:

```lisp
;;; foo.lisp

(in-package #:foobar)

(enable-json-syntax)

(defun foobar ()
  ["foo", "bar"])
```

Consider what happens when this file is loaded using `(load (compile-file "foo.lisp"))`. `enable-json-syntax` will only get called during `LOAD`. However, by then, it is too late.

Remember that reader macros only work at read-time i.e. when the reader is translating raw text into Lisp s-expressions. In the example above, the definition for `foobar` was translated from raw text to sexp during [`COMPILE-FILE`][compile-file] and not [`LOAD`][load]. So what we really want is to run `enable-json-syntax` during `COMPILE-FILE` instead of `LOAD`. The simplest way to achieve this is to wrap the function call inside an [`EVAL-WHEN`][eval-when]:

```lisp
;;; foo.lisp

(in-package #:foobar)

(eval-when (:compile-toplevel :load-toplevel :execute)
  (enable-json-syntax))

(defun foobar ()
  ["foo", "bar"])
```

`EVAL-WHEN` ensures that `enable-json-syntax` is called during `COMPILE-FILE` _and_ `LOAD`, so you get sane behaviour with both `(load (compile-file "foo.lisp"))` and `(load "foo.lisp")`.

However, this still suffers from two problems:

1. There is no way to undo this -- we can't provide a `disable-json-syntax` because we don't keep track of the previous macro functions for these characters, if any.

2. This still clobbers the current readtable. It might not as be a big problem when a user calls this function directly on the REPL, however since the current readtable is passed as is during `LOAD` and `COMPILE-FILE`, any modifications to the readtable will persist globally even after these operations finish.

Both these problems are solved by making a slight modification to `enable-json-syntax`.

```lisp
(defvar *previous-readtables* nil)

(defun enable-json-syntax ()
  (push *readtable* *previous-readtables*)
  (setq *readtable* (copy-readtable))
  (set-macro-character +left-bracket+ 'read-left-bracket)
  (set-macro-character +right-bracket+ 'read-delimiter)
  (set-macro-character +left-brace+ 'read-left-brace)
  (set-macro-character +right-brace+ 'read-delimiter))
```

We maintain a stack of previous readtables. When `enable-json-syntax` is called, the current readtable is pushed on the stack of previous readtables and a copy is made the current readtable. This ensures that subsequent modifications to the readtable are made on our copy and not the readtable that we inherited.

Now we can provide a simple way to disable JSON syntax.

```lisp
(defun disable-json-syntax ()
  (setq *readtable* (pop *previous-readtables*)))
```

Note: we must ensure that any call to `enable-json-syntax` is balanced with a subsequent call to `disable-json-syntax`. If we don't, the stack of previous readtables will get corrupted.

This solves the first problem, but what about the second? Due to an interesting peculiarity of `LOAD` and `COMPILE-FILE` -- both of these functions bind `*READTABLE*` to its current value before working on the file -- `(setq *readtable* (copy-readtable))` by itself is enough to ensure that modifications do not persist after these operations finish. In fact, if we only ever call `enable-json-syntax` and `disable-json-syntax` from source files and never from the REPL directly, we don't need to manage the stack of previous readtables at all since dynamic binding takes care of this for us.

Finally, it might be a bit cumbersome for your users to write `(eval-when (:compile-toplevel :load-toplevel ...))` all the time, so we could redefine these functions as macros.

```lisp
(defmacro enable-json-syntax ()
  '(eval-when (:compile-toplevel :load-toplevel :execute)
    (push *readtable* *previous-readtables*)
    (setq *readtable* (copy-readtable))
    (set-macro-character +left-bracket+ 'read-left-bracket)
    (set-macro-character +right-bracket+ 'read-delimiter)
    (set-macro-character +left-brace+ 'read-left-brace)
    (set-macro-character +right-brace+ 'read-delimiter)))

(defmacro disable-json-syntax ()
  '(eval-when (:compile-toplevel :load-toplevel :execute)
    (setq *readtable* (pop *previous-readtables*))))
```

Your users can now enable/disable JSON syntax at will using these two macros. As long as calls to `enable-json-syntax` and `disable-json-syntax` are balanced, this will work well both on the REPL and in a source file. For reference, here's how a user source file might look with these definitions in place:

```lisp
;;; foo.lisp

(in-package #:foobar)

(enable-json-syntax)

(defun foobar ()
  ["foo", "bar"])

;; Write more definitions

(disable-json-syntax)
```

It is worth mentioning [Named-Readtables][] here. This is a library designed to make readtable management as easy as package management. If you are providing a custom reader syntax in your library, consider using Named-Readtables.

_(Thanks to [handle0174](http://www.reddit.com/r/lisp/comments/1zfim8/reader_macros_in_common_lisp/cfueii9) and [xach](http://www.reddit.com/r/lisp/comments/1zfim8/reader_macros_in_common_lisp/cft6mw2) for suggestions)_

## Conclusion

Reader macros are a powerful way to expand Lisp's syntax in new and wonderful ways. However with great power comes great responsibility, so you should learn to use them with great care. For example, while a JSON reader was a good exercise in understanding reader macros, I would never use it in real world for the simple reason that easier alternatives already exist. e.g. a plain list or even a vector literal:

```lisp
'(1 2 3)
#(1 2 3)
```

Another disadvantage of inventing new syntax is that it doesn't work well with existing development tools. e.g. JSON array and object syntax doesn't work very well with lisp and paredit modes in Emacs -- even simple operations like `C-M-f` and `C-M-b` (to go forward or backward sexp) don't work very well.

There is a saying that goes along these lines: where a function will do, don't use a macro. A corollary for reader macros could be: where a sexp will do, don't use a reader macro. Yes, it might be a subjective call, but think twice before using a reader macro.

However, when done right, reader macros can work wonders. Take a look at [cl-interpol][] [3], which adds support for string interpolation to Common Lisp, so you can easily embed newlines in strings or even create regexes more simply.

```lisp
> #?"foo\nbar"
"foo
bar"

> #?/\bfoo\b/
"\\bfoo\\b"
```

A few other possible use cases for reader macros are:

* increase compatibility with foreign code e.g. Objective-C like calls
* infix syntax
* rule system syntax
* embedded SQL

_(Thanks to [lispm](http://www.reddit.com/r/lisp/comments/1zfim8/reader_macros_in_common_lisp/cft6i1z))_

Source code used in this post is available in a [json-reader.lisp][]. A battery of [tests][test.lisp] is also provided.

## Notes

1. I have not covered how `READ` handles whitespace following the Lisp expression. When you provide `'foo` as input on the standard input, you need to follow it up with the a newline character. `READ` will read past the newline character in this case; so the stream position after `single-quote-reader` will actually go past the newline

2. Actually, comma is already [defined][comma] in the standard readtable as a terminating macro character -- it is a part of the [backquote syntax][]. So technically, we could have done without associating comma with `read-separator`.

3. Technically, cl-interpol doesn't define a new reader macro, it installs `?` (question mark) as a "sub character" of the standard [dispatching macro character][sharpsign] `#` (sharpsign). Dispatching macro characters are a special class of reader macros which allow you to "make the most of the ASCII character set; one can only have so many one-character read-macros." (On Lisp, Chapter 17, Read-Macros)

* On Lisp: [http://www.paulgraham.com/onlisp.html](http://www.paulgraham.com/onlisp.html)
* atom: [http://www.lispworks.com/documentation/HyperSpec/Body/t_atom.htm](http://www.lispworks.com/documentation/HyperSpec/Body/t_atom.htm)
* list: [http://www.lispworks.com/documentation/HyperSpec/Body/t_list.htm](http://www.lispworks.com/documentation/HyperSpec/Body/t_list.htm)
* set-macro-character: [http://www.lispworks.com/documentation/HyperSpec/Body/f_set_ma.htm](http://www.lispworks.com/documentation/HyperSpec/Body/f_set_ma.htm)
* JSON: [http://json.org/](http://json.org/)
* Readtable: [http://www.lispworks.com/documentation/HyperSpec/Body/02_aa.htm](http://www.lispworks.com/documentation/HyperSpec/Body/02_aa.htm)
* \*readtable*: [http://www.lispworks.com/documentation/HyperSpec/Body/v_rdtabl.htm](http://www.lispworks.com/documentation/HyperSpec/Body/v_rdtabl.htm)
* Standard Readtable [http://www.lispworks.com/documentation/HyperSpec/Body/02_aab.htm](http://www.lispworks.com/documentation/HyperSpec/Body/02_aab.htm)
* cl-interpol [http://weitz.de/cl-interpol/](http://weitz.de/cl-interpol/)
* sharpsign [http://www.lispworks.com/documentation/HyperSpec/Body/02_dh.htm](http://www.lispworks.com/documentation/HyperSpec/Body/02_dh.htm)
* comma [http://www.lispworks.com/documentation/HyperSpec/Body/02_dg.htm](http://www.lispworks.com/documentation/HyperSpec/Body/02_dg.htm)
* backquote syntax [http://www.lispworks.com/documentation/HyperSpec/Body/02_df.htm](http://www.lispworks.com/documentation/HyperSpec/Body/02_df.htm)
* read [http://www.lispworks.com/documentation/HyperSpec/Body/f_rd_rd.htm](http://www.lispworks.com/documentation/HyperSpec/Body/f_rd_rd.htm)
* json-reader.lisp <a href="json-reader.lisp">file-json-reader-lisp</a>
* test.lisp <a href="test.lisp">file-test-lisp</a>
* Dynamic variable [http://www.gigamonkeys.com/book/variables.html#dynamic-aka-special-variables](http://www.gigamonkeys.com/book/variables.html#dynamic-aka-special-variables)
* Named-Readtables [http://common-lisp.net/project/named-readtables/](http://common-lisp.net/project/named-readtables/)
* reddit thread [http://www.reddit.com/r/lisp/comments/1zfim8/reader_macros_in_common_lisp/](http://www.reddit.com/r/lisp/comments/1zfim8/reader_macros_in_common_lisp/)
* eval-when [http://www.lispworks.com/documentation/HyperSpec/Body/s_eval_w.htm](http://www.lispworks.com/documentation/HyperSpec/Body/s_eval_w.htm)
* compile-file [http://www.lispworks.com/documentation/HyperSpec/Body/f_cmp_fi.htm](http://www.lispworks.com/documentation/HyperSpec/Body/f_cmp_fi.htm)
* load [http://www.lispworks.com/documentation/HyperSpec/Body/f_load.htm](http://www.lispworks.com/documentation/HyperSpec/Body/f_load.htm)
