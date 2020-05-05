---
layout: post
category: project
title: "CL-Marshal"
date: 2011-11-18
description: "Hihoho"
---

Simple and fast marshalling of all kinds of Lisp data structures. Convert any object into a s-expression, put it on a stream an revive it from there. Only minimal changes required to make your CLOS objects serializable. Actually you only need to add 1 method per baseclass.

Homepage: [https://github.com/wlbr/cl-marshal](https://github.com/wlbr/cl-marshal)  
Dependencies: none (except asdf)  
License: MIT  
Project is listed in Cliki.net: [https://www.cliki.net/cl-marshal](https://www.cliki.net/cl-marshal)

## Examples

### Serialization of simple data

```lisp
$ (ms:marshal (list 1 2 3 "Foo" "Bar" (make-array '(3) :initial-contents '(a b c))))
--> (:PCODE 1
          (:LIST 1 1 2 3 (:SIMPLE-STRING 2 "Foo") (:SIMPLE-STRING 3 "Bar")
          (:ARRAY 4 (3) T (A B C))))   
```

Deserialization:

```lisp
$ (ms:unmarshal '(:PCODE 1
      (:LIST 1 1 2 3 (:SIMPLE-STRING 2 "Foo") (:SIMPLE-STRING 3 "Bar")
      (:ARRAY 4 (3) T (A B C)))))
--> (1 2 3 "Foo" "Bar" #(A B C))
```

That means that a

```lisp
(ms:unmarshal (ms:marshal myobject))
```

returns a deep clone of myobject.

## Objects: A more complex example

```lisp
(defclass ship () 
   ((name :initform "" :initarg :name :accessor name)
    (dimensions :initform '(:width 0 :length 0) :initarg :dimensions :accessor dimensions)
    (course :initform 0 :initarg :course :accessor course)
    (cruise :initform 0 :initarg :cruise :accessor cruise) ; shall be transient
    (dinghy :initform NIL :initarg :dinghy :accessor dinghy :initarg :dinghy)) ; another ship -> ref
   (:documentation "A democlass. Some 'persistant slots', one transient. 
  Some numbers, string, lists and object references."))


(defparameter ark (make-instance 'ship :name "Ark" :course 360 
                            :dimensions '(:width 30 :length 90)))
```

Nothing happens if we try to serialize this, as one important piece is missing:
```lisp
$ (ms:marshal ark)
--> (:PCODE 1 NIL)
```

For your classes you need to add one special method:
`ms:class-persistant-slots`

There you are going to define the slots that shall be serialized, so that you can have persistant and transient slots in your class.
```lisp
(defmethod ms:class-persistant-slots ((self ship))
  '(name dimensions course dinghy))
```

Note that the slot cruise is not listed. Therefore it will not be serialized.
```lisp
$ (ms:marshal ark)
-->  (:PCODE 1
            (:OBJECT 1 SHIP (:SIMPLE-STRING 2 "Ark") (:LIST 3 :WIDTH 30 :LENGTH 90) 360
            (:LIST 4)))
```
Fine. Try a

```lisp
(ms:unmarshal (ms:marshal ark))
```

and you will get a clone of the object ark.
The whole thing works with arrays, hashtables, lists, classes/objects, subclasses incl. multiple inheritance, all of this nested and with circular references. See [README.md](https://github.com/wlbr/cl-marshal/blob/master/README.md) for more detailed examples.