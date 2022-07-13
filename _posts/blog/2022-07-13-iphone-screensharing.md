---
layout: post
category: blog
title: "Screensharing of iPhone on OSX"
tags: osx 
date: 2022-07-13
---


Working on remote development projects you will most likely get to the point, where you will need to share the content of your iPhone screen using Zoom, Google Meet, MS Teams ... While mobile developers will have some commercial software for this, I am more an occasional user and need simply a cheap solutions.

There are a numer of products available: [LonelyScreen](https://www.lonelyscreen.com), Reflector](https://www.airsquirrels.com/reflector, [AirServer](https://www.airserver.com) and probaply more will do the job for you. Their pricing is around 30€. 
But there are free alternatives available.

First of all, since OSX Monterey the basic functionality is built into OSX itself. You simply need to enable the Airplay Receiver in Settings / Sharing. After that you will find your Mac as an Airplay display in your sharing screen on the iPhone, if both devices are in the same network.

There is one problem with this solution: as soon as you mirror your iPhone, your OSX screen turns black, everything else than the mirrored phone display is invisible. So you cannot see anything of your meeting software. You need to share your full screen to be able to share your sreen at all. <br>
Furthermore _every_ screen connected to the Mac will be blacked out.

What would be needed is a window with the mirrored screen inside, so that you can share it in Zoom etc. easily.

On versions older than Monterey you could use the nice freeware 
[LetsView](https://letsview.com) to show your mirrored device in a windowd mode. But since Monterey, it displays the screen on fullscreen, just as the built-in functionality. It seems that you it offers no additional functionalty, actually.

__But there is one trick: if you turn turn *off* the Airplay receiver in Settings / Sharing but keep using LetsView, then the tool is displaying the screen in windowed mode again!__