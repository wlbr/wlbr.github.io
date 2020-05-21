---
layout: post
category: blog
title: "CL-Marshal released"
date: 2011-11-18
---

Today I gave my really old `encode/decode` package to the public
domain. As far as I remember, I developed the very first version of
the library during my thesis at the university. That was back in 1995 :smirk:
I needed a simple
way to communicate between processes, regardless if they were on the
same or on a remote machine. I simply used objects that were sent via
a kind of channels from one process to the other. Channels could be
tcp/ip connections or a shared memory object with the same interface.
`encode/decode` was a way to (de)serialize standard CLOS objects.

Later, during the following years and research projects at the department
for AI the library was refactored to work with basically any Lisp
data structure. Think of it as a `pickle` for Common Lisp.

Now, after discovering [SBCL](http://www.sbcl.org) and
[revisiting Lisp]({% link _posts/blog/2011-10-19-revisiting-lisp.md %}) I did a small rework
again, to make it use up-to-date standard mechanisms as ASDF2.

A simple example - Serialization of a some standard data structures:
--------------------------------------------------------------------

Serialization of simple examples:

```lisp
$ (ms:marshal (list 1 2 3 "Foo" "Bar"
        (make-array '(3) :initial-contents '(a b c))))
--> (:PCODE 1
        (:LIST 1 2 3 (:SIMPLE-STRING 2 "Foo")
        (:SIMPLE-STRING 3 "Bar")
        (:ARRAY 4 (3) T (A B C))))
```

Deserialization:

```lisp
$ (ms:unmarshal '(:PCODE 1
    (:LIST 1 2 3 (:SIMPLE-STRING 2 "Foo")
    (:SIMPLE-STRING 3 "Bar")
    (:ARRAY 4 (3) T (A B C)))))
--> (2 3 "Foo" "Bar" #(A B C))
```

That means that a

```lisp
(ms:unmarshal (ms:marshal myobject))
```

returns a deep clone of myobject.

For more examples and more information take a look at
[Github](http://www.github.com/wlbr/cl-marshal)
