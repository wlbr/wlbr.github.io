---
layout: post
category: blog
title: "Setting $PATH globally on OSX"
#description: ""
tags: osx 
date: 2020-09-12
---


On OSX, setting the PATH variable in `.profile`, `.zshrc` or `.bashrc` defines the search path for all console commands, but, unfortunately, it does not have any effect for UI programs (_apps_), typically stored in `/Applications`.

This might be an issue if you are using external commands from within an app. Typically this is the case for development environments as [Visual Studio Code](https://code.visualstudio.com/). For example, the `go` toolchain will not be found by the [go plugin](https://code.visualstudio.com/docs/languages/go) for Visual Studio Code, if you installed `go` from source. Therefore developers are starting their IDEs usually from the terminal by running a command-line program (called `code` in the case of Visual Studio Code) as a starter. That way the app inherits the environment from the terminal. 

## Solution

But there _is_ a way to change the default path for all applications. Something like a system wide path variable. You need to create additional files in `/etc/paths.d`, each containing one or multiple path components. Each path component hast to be in a single line. (The files must be owned by `root:wheel`)

For example I want to have the two paths `/Users/myusername/Library/golang/go/bin:/Users/myusername/Library/golang/packages/bin` added to my `PATH`variable.<br>
So I created a file called `go`containg these two lines:
```bash
  /Users/myusername/Library/golang/go/bin
  /Users/myusername/Library/golang/packages/bin
``` 

## Problems having double path elements in $PATH ?

Adding the desired path components `/ect/paths.d` sets the path for applications and unix-like command-line programs. So there is not really a need to manipulate the path variable in your .bashrc. This will end up in duplicate entries.

But in case you want to share the .bashrc with between multiple machine, maybe a Linux, you may use the following shell function to add each single path component to the $PATH.
So instead of the typical `export $PATH=$PATH:/my/new/pathcomponent` you simply type `addPath /my/new/pathcomponent`. The function will add its argument only if it not already part of $PATH.

```bash
addPath() {
  #addPath adds a new pathcomponten to $PATH avoiding duplicates
   IFS=':' read -r -a pcomponents <<< "$PATH"
   FOUND=0
   for i in "${!pcomponents[@]}"
      do if [ x"${pcomponents[$i]}" == x"$1" ]; then
        FOUND=1
      fi
   done
   if [ x$FOUND == x0 ]; then
     export PATH=$PATH:$1
   fi
}
```