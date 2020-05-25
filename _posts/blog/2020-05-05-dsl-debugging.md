---
layout: post
category: blog
title: "DSL Debugging"
date: 2020-05-05    
image: /assets/dslmonitoring1.jpg
---

Recently, somehow prepping for the Corona apocalypse, I ordered an upgrade of my DSL line. From 50/10 mbit/s (downstream/upstream) VDSL to 100/40 mbit/s VDSL Vectoring. It costs me additional 5€ per month so I thought it might be worth it. I did not really expect that just a few weeks later the both of us would find ourselves working completely remote from our home.

My old line was pretty fast, almost exactly the 50/10 mbit/s I was paying for, though it was not completely stable. I had weeks were everything was fine, but in others I had up to 40 reconnects per week. That was the case since my provider did a change in the backend infrastructure, but it never really bothered me, as I was using the network mostly during my free time.

After the upgrade two things happened:

1. initially I got 65/25 mbit/s. Later, after some days that dropped to 53/25 mbit/s. That was probably a reaction of the modem to the problems of point 2. It was probably downgrading the speed to reach higher stability.
2. I encountered a _huge_ number of reconnects.

Around the same time the permanent home office period started. So I could not tolerate this. I called the provider, in the end they sent out a technician. He measured a 80/30 mbit/s being available at the wall plug. We did the same test on the street, directly on the line - we measured 100/40 bit/s which is quite surprisingly at my street. But he did not find any problem. The loss could be explained by the quite long line from the street to our flat, but he had no clue what could cause the reconnects.


So I had to start debugging. Measure / Change / Measure / Change... First I started to build up a monitoring environment.

I own a Docker capable Synology, that is always on and connected via lan to my modem/router. The router is a AVM Fritz!Box 7580. For the non Germans: the Fritz!Box is *the* standard quality modem for homeuse here and the 7580 is pretty much the top of the line model. 

So I bundled some existing images and added a few things and finally I had a Docker Compose file, that enables a complete monitoring for my internet line.

* Prometheus
  * a Fritzbox UPNO reader getting the sync rates and the uptime of the modem frequently exposing them as a Prometheus source
  * a speed test the check the resulting network speed. 
* Grafana to visualize everything
* Everything dockered and scripted, so that you simple need to execute the Docker Compose script on your Synology to get everything up and running. 

See [this post]({% post_url projects/2020-03-27-synology-prometheus %}) describing the package in detail.

I created the following graphs to visualize everything:
![DSL Data](/assets/dslmonitoring1.jpg)

Now I was able to change things and _measure_ their effects. I turned out that I had a few things I needed to fix:

1. the cable coming from the wall going to the modem was banded, tied up to save space and look tidy. This seems to have created a kind of coil. I unbanded it and lead it hanging free on the backside of the sheld the modem resides in. So it does not have any winding anymore.
2. I change the cable from wall to modem by a new, high-quality one with some more shielding.
3. the cable leading from the street to the plugin the wall of our flat was too long and somewhere the surplus length was again winded and formed a coil. Actually by intention, as I wanted to be able to change the wiring later and did not expect that winds with a diameter of 40cm would have any effect.
4. I exchanged the multiple socket outlet from a cheap version to a higher quality variant with relatively big distances between the plugs.
5. I separated the power cables clearly from the phone and network lines leading to the modem.

This seemed to have my problem solved. It got quicker (a sync to 78/30 mbit/s, real throughput 72/30 mbit/s) and is rock stable now. I think that when upgrading my line to vectoring the speed of the line made it more delicate to any outer influence. So the several magnetic coils I created and the line lying close to the power cables were creating the trouble.

I know that there is still one unwanted coil within the cable somewhere on its way through the buildings here. I guess if I could remove that as well I would gain a little more speed. But my main problem was the stability, the 70/30 mbit/s is quick enough for now. As it would be some hard work to reach that last winding I just leave it there for now.
