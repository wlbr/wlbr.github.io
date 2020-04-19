---
layout: post
category: blog
title: "How to install Oracle Java 7 on Ubuntu"
#description: ""
tags: git development
date: 2012-08-31
---


Due to some license change done by Oracle on the Java Packages,
the Debian project decided, not to include any of the former
\*sun\*java\* Packages in their new releases/repositories. Thus
recent Ubuntus are missing the standard JDKs for Java 6 and 7,
instead the OpenJDK is included.

I do not want to start a discussion wether Oracles decision
regarding the Java License nor Debians decision to exchange the
Oracle/Sun JDK for OpenJDK was a good one or not. Let's assume
that you _have_ the requirement to use the "official" JDK.
Maybe simply because you are using it for years now and do not
want to change a winning team.

## So how do we get an "official JDK" on a decent Ubuntu?

Simple. Add a new ppa repository. This one will offer the
Oracle Installer and if you install this package, it will pull
and autoinstall the JDK itself. All dependencies are maintained,
so that you can remove old releases or the OpenJDK.

```shell
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get install oracle-java7-installer
sudo update-java-alternatives -s java-7-oracle
sudo apt-get purge openjdk* sun-java6*
```

The last line is optional, but I would recommend it. If you
do not wish to remove the old releases, then you probably will
want to choose the new release as the standard environment. This
is what the `update-java-alternatives` does.
