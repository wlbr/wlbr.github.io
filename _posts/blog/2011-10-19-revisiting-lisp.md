---
layout: post
category: blog
title: "Revisiting lisp"
#description: "Common Lisp in the 21st century"
#tags: lisp "common lisp" development
date: 2011-10-19
---


There is a lot of hype around Clojure and after a long time not really
taking notice of it I recently decided to take a look at it.
I have to admit that I am an old Lisp guy. I did work with Lisp for
quite some years and even got paid for it. *And* I really liked
it. I keep telling people, that Lisp is my "native programming
tongue". So I thought that would be a good idea and it should'nt be
to difficult to get a grasp in Clozure.

Well, after 20 minutes I stopped. *As* a old lisp man, I was really
annoyed about the rape of the uniqely strict an clear syntax, that
characterizes Lisp (and Scheme). It is is one of the basic strengths
of Lisp, that has vanished in Clojure. 
Additonally I noticed that it was a completely stripped Lisp, no
CLOS etc. Of course this is somehow the point with Clojure, as it 
targets stateless dealing with concurrency.

Anyway, I just didn't like it :smirk:

So I thought - one advantage of Clozure is its JVM runtime and
general Java interoperability. Isn't there another lisp implementation
for the JVM, referably a Common Lisp? And yes, there is 
[ABCL](http://common-lisp.net/project/armedbear/), Armed
Bear Common Lisp. Immediately I fell in love with the name. I gave
it a try and yes, quite nice, but I found that it's compile time
is quite bad (I did not measure the runtime performance). I was used
to a different behavior in my old MCL and ACL times.

Then I stumbled across 
[SBCL](http://www.sbcl.org/)  - Steel Bank Common Lisp. 
And this is it. Extremely fast, runtime and compile time. A lot 
faster than Python or Ruby for example. But it is not a JVM language, 
it brings its own JVM. But in a number of implementations, Linux, 
OSX, Windows - who needs a JVM then. I guess I should take a 
deeper look at it.

