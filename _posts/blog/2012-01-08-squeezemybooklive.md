---
layout: post
category: blog
title: "How to connect a Squeezebox to a MyBookLive"
#description: ""
tags: hacking
date: 2012-01-08
---


I live in a place with very bad radio reception. Therefore I
recently bought a
[Logitech Squeezebox Radio](https://de.wikipedia.org/wiki/Squeezebox#Squeezebox_Radio_(September_2009)),
to receive some radio stations through the internet connection without having a 
PC in the kitchen, just with a small commodity device. Btw. the Squeezebox Radio works
flawlessly, good sound, easy to use.

I was only looking for a good internet radio receiver, but then I noticed that
with the Squeezebox Radio I got one part of a whole local network streaming
environment. You can connect multiple Squeezebox clients to one Squeezebox
server, that provides all your music to the clients. The internet radio is
actually just a "little" plus to that functionality.

Unfortunately the Squeezebox products don't support UPNP/AV.
So it doesn't really help that my wonderful
[WD MyBookLive](https://en.wikipedia.org/wiki/Western_Digital_My_Book#Live), that I own
as a TimeCapsule replacement, runs Twonky
to support that protocol. What I needed is a Squeezebox Server on the
MyBoobLive. And yes, there are open source implementations of such a server,
running on a variety of embedded devices!

Several steps are required:

1. Enable SSH access on the MyBookLive. You can do this at the page
   http://mybooklive/UI/ssh  (I didn't find that linked in the
   standard UI, but who cares.) <br>
   Note the user/password info. <br>
   Connect to the box:
```shell
ssh root@mybooklive
```

2. Twonky is running on the port that we need for the squeezebox
   server. Change the port in the line `httpport=` in the config
   file to `httpport=8000`:
```shell
vi /CacheVolume/twonkymedia/twonkymedia-server.ini  #edit
/etc/init.d/twonky restart                          #restart
```

3. Download the server software and install it:
```shell
wget http://downloads.slimdevices.com/nightly/7.7/sc/33883/logitechmediaserver_7.7.2~33883_all.deb
dpkg -i logitechmediaserver_7.7.2~33883_all.deb
```
4. Use your pc browser to connect to
   [http://mybooklive:9000](http://mybooklive:9000) and configure the music directory to something useful
   inside of `/DataVolume/shares/`

That's it. You may use [Sqeezeplay](http://downloads.slimdevices.com/nightly/index.php?ver=7.7)
to test everything before purchasing a real Squeezebox.

PS: The download link of step 3 may change. You will find newer editions at
[http://downloads.slimdevices.com/nightly/index.php](http://downloads.slimdevices.com/nightly/index.php)
The version fitting to the MyBookLive is "Logitech Media Server: Debian
Installer Package (i386, x86_64, ARM EABI, PowerPC)"

