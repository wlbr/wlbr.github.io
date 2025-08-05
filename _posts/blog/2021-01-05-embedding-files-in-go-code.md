---
layout: post
category: blog
title: "Capturing logging data from Counter Strike"
#description: ""
tags: development 
date: 2020-11-01
---


To bend my mind around [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html), [CQRS](https://martinfowler.com/bliki/CQRS.html) and assorted things I was looking for a feasable example of an application that I could try to write. Personally I strongly believe in really trying things instead of just reading about them. 

During the multiple Corona lockdowns my old friends from university and myself, spread all over the world, found together again online. And apart from some virtual beers some of us started playing online games together again, after a pause of 15 years or so. This time using our working laptops, Macbooks etc. ;-) <br>
We found ourself in Counter Strike Global Offensive (CS:GO), each of us owning a 10 years veteran badge, just after not having played for 12 years or so. Actually we would have deserved a 20 years badge, as we were playing CS from it's very beginning, the betas in the pre-steam era.

Anyway - to be honest, though CS is a very teamoriented game, we have actually never been very  good teamplayers. I guess some of us had some good single palyer skills, but even that is really a long time ago. We are horrible players now. <br>
But we really enjoy playing CS together and are still sharing screenshots of the final leaderboard of a map, when someone is ruling everything. We have some things as guys being best friends, but a kind of archenemies _in the game_ at the same time. Always thinking: a kill of _him_ is counting double for me!

So I thought "this is it!": let's create something like or own [ELO](https://en.wikipedia.org/wiki/Elo_rating_system) score for CS, evaluating the results on our own server. I could use that as a source for the CQRS-Event-hipster-stuff I was mentioning before. Finally we would have a clear answer to our most importing question: who is the best, who is dominating whom. Who killed whom? Who is whose nemesis? YOU AGAIN? Who blinded how many _teammates_? WILL YOU EVER LEARN?

I found out that there are multiple ways to interact with a CS dedicated server:
   
   - [CS:GO Game State Integration](https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Game_State_Integration)
   - You can directly interact with the rcon protocol
   - Reading the server log files from ftp
   - Being a receiver for a remote log of CS:GO
   
   After looking at the docs (that isn't too well, honestly) I decided that the remote logging is the way to choose here. Thow the Game State Integration seemed promising I don't want to see all the aggregations and summaries the Game State integration offers, because I want to collect the raw events. 
   Nobody wants to deal with FTP and cleaning up the server all the time. And having RCON access just to collect some stats seems to be a bad idea.
   
   There are two ways to collect log entries remotely. CS offers http and udp. First I chose http, as it seems to be the standard nowadays. I ran into troubles, because I was receining requests, but the body was empty. So I switched to UDP. this has the advantage, that that is a much cheaper operation for the CS server that will not infer the CS servers performance, even if the log receiver is not responding. So there will be a number of post concerning these topics in the future here.
   
   
   ## Enable the logging
   
   
   





log                                      : cmd      :                  : Enables logging to file, console, and udp < on | off >.
logaddress_add                           : cmd      :                  : Set address and port for remote host <ip:port>.
logaddress_del                           : cmd      :                  : Remove address and port for remote host <ip:port>.
logaddress_delall                        : cmd      :                  : Remove all udp addresses being logged to
logaddress_list                          : cmd      :                  : List all addresses currently being used by logaddress.


Resources:
   - https://developer.valvesoftware.com/wiki/Console_Command_List
   - https://developer.valvesoftware.com/wiki/HL_Log_Standard
   - https://developer.valvesoftware.com/wiki/HL_Log_Standard_Examples
