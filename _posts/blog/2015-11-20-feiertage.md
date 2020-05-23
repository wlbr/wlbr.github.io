---
layout: post
category: blog
title: "New library (and cmd tool) FEIERTAGE"
date: 2015-11-20
---

Actually I don't why, but I implemented a new Go library to calculate a huge number of holidays. Propably simply because I _can_. Holiday in the sense of public holiday oder memorial days etc. The library offers these special days as an extension to Go's `time` object, so that all standard methods will work on them.

In addition, for Germany (_edit_: and Austria, this was later added by [Mike Knell](https://github.com/uffish)) the library offers functions to see what holiday is a free day in which region of Germany. This is different in each state (Bundesland). For example Christmas is a public holiday throughout the whole country, while Epiphanias is free only in a few states.

It turned out that there are some interesting points in these dates:
  
  * a number of these days have a fixed date, for example Christmas is obviously always on December 25th.
  * others (and not only a few) shift every year somehow by some weeks. Most of them are somehow dependent on 2 special dates that are a kind of anchor. Easter and first of Advent. So there are funny definitions like
    * n days after/before easter
    * last Wednesday before first of advent
    * others float around the beginning or ending of a month like 'last Sunday of March'
  * the calculation of Easter is crucial and ridiculously complicated. In fact it was one of the few remaining parts of science in the dark times of the middle ages. It took someone like Gaus to deliver an algorithm to (more or less) easily compute it. See [Computus](https://en.wikipedia.org/wiki/Computus#Gauss's_Easter_algorithm)

It can be used as a library, but a command line tool for a quick info on the dates of a year is included as well. Check the [releases](https://github.com/wlbr/feiertage/releases) subpage on Github. This tool generates plain text as default, but it can be used to generate valid [Taskuggler](https://taskjuggler.org/) code to exclude the free days in your project planning.

Take a look at its [project page]({% post_url projects/2015-11-04-feiertage %}) for more details, for example all the available days like Daylight Saving, Blackfriday, Towel Day, System Administrator Appeciation Day ...