---
layout: post
category: blog
title: "Update of my library FEIERTAGE"
date: 2020-05-04
---

I did two updates on my personal favourite side project, the library and command line tool [_feiertage_](https://github.com/wlbr/feiertage).

1. I added the possibility to the command line tool to specify the region by a shortname. So for example if you want the bank holidays in 2020 for Baden-Württemberg you needed to use `feiertage -region baden-württemberg 2020` (or actually imminting the - or using ue instead of ü), where you may use `feiertage -region bw 2020` now as well. The short names are the "official" codes of the states, for example _hb_ for _Hansestadt Bremen_.
2. Because I like them and simply because I **_can do this_** I added two new special dates. Both are no public holidays in Germany nor Astria.
  * Towel day
  * System administrator appreciaton day
  