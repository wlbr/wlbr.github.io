---
layout: post
category: blog
title: "Setting path of OSX"
#description: ""
tags: osx 
date: 2020-09-12
---


On OSX, setting the PATH variable in `.profile`, `.zshrc` or `.bashrc` defines the search path for all console commands, but, unfortunately, it does not have any effect for UI programs (_apps_), typically stored in `/Applications`.

This might be an issue if you are using external commands from within an app. Typically this is the case for development environments as [Visual Studio Code](https://code.visualstudio.com/). For example, the `go` toolchain will not be found by the [go plugin](https://code.visualstudio.com/docs/languages/go) for Visual Studio Code, if you installed `go` from source. Therefore developers are starting their IDEs usually from the terminal by running a command-line program (called `code` in the case of Visual Studio Code) as a starter. That way the app inherits the environment from the terminal. 

But there _is_ a way to change the default path for all applications. Something like a system wide path variable. You need to create additional files in `/etc/paths.d`, each containing on or multiple path component. Each path component hast ot be in a single line. (The files must be owned by "root:wheel")

For example I want to have the two paths `/Users/myusername/Library/golang/go/bin:/Users/myusername/Library/golang/packages/bin` added to my `PATH`variable.<br>
So I created a file called `go`containg these two lines:
```shell
  /Users/myusername/Library/golang/go/bin
  /Users/myusername/Library/golang/packages/bin
``` 
