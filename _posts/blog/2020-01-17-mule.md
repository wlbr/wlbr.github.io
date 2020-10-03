---
layout: post
category: blog
title: "Releasing MULE"
date: 2020-01-17
---

Today I released [_mule_]({% post_url projects/2020-01-17-mule %}). It is intended for use with Google Go. In Go it is a common pattern that your project compiles into a single binary without any external dependencies. But often you need some external resources as images for example. These remain external and may need to be updated separately on any change

So I wrote _mule_. Using it you can embed your resource into go code. You will need to run _mule_ on that resource file to create a corresponding Go source file. That file exposes a function, which returns the resource as a `[]byte`. _mule_ works by generating a function with the resource being converted into a MIME-encoded string. When calling the function this string is decoded into the resource.

_mule_ works nicely with [`go generate`](https://blog.golang.org/generate), so that you can include it very comfortably in your Makefile and it will be run at any change of the resource file.

Take a look at its Github [repository](https://github.com/wlbr/mule) for more details and an [example](https://github.com/wlbr/mule/tree/master/example).
