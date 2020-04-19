---
layout: post
category: blog
title: "Create a git repo with a central repository server"
#description: ""
tags: git development
date: 2012-01-27
---

Git was planned as a completely distributed revision control system, but nowaday it
is mostly used with systems as Github, Bitbucket etc. Using one of those products
one can work with several coworkers using a central server repository. Usually 
Github and Co. offer only public projects on their free plan. If you need a private
repository then you can simply use a standard server with SSH access. Git needs to 
be installed.

## Step 1:  Server preparation

Connect to server, create a new, empty directory there and initialize an empty repository.

```shell
    $ ssh server.com
     #->Last login ...
     #->Welcome to server.com!
    $ mkdir myrepo.git
    $ cd myrepo.git
    $ git --bare init
     #->Initialized empty Git repository in ~/myrepo.git
    $ exit
     #->Bye!
```


## Step 2: Create local repo

Get into your source directory.
If you did not already set up a local git repo
you would have to do it now.

```shell
$ cd myrepo
$ git init
  #->Initialized empty Git repository in ~/.git/
```

Step 3: Connecting the local with the server repo.
--------------------------------------------------
Add the remote repository as origin repo to to your existing local git repo.
Set the local master branch to track the remote branch.
Then push to the server:

```shell
$ git remote add origin user@server.com:/~/myrepo.git
$ git push origin master
```

Step 4: Cloning.
----------------
Finally you can now clone the server repo to a new directory by a simple

```shell
    $ git clone user@server.com:/~/myrepo.git
```

Further pushs and pulls can be done simply by calling `git push`
and `git pull` (note that `origin master` is not needed).
