---
layout: post
category: blog
title: "SitemapMS"
date: 2015-01-20
---

I did a rework of my [archery club's](https://bsc-karlsruhe.de) homepage and decided to use a content management system called [CMS Made Simple](https://www.cmsmadesimple.org/) or, shorter, CmsMS. It did not generate a goog sitemap automatically. Yet another plugin just did not seem to work.

Well, so I wrote a simple sitemap generator. It connects to the database of the content management system and creates a sitemap.xml file. The hiararchy of the pages in the menu drives the priority in the sitemap. It can be run frequently as a cronjob.

It reads a file named  .sitemapms.ini that resides in the home directory of the user running the tool and takes a number of command line switches.

Configuration:
```
; SiteMapMS Config file
[Database]
  Database = cms_db
  User     = mabuse
  Password = fkhdb4322rb
[Site]
  BaseUrl     = http://www.mysite.com
  SiteMapPath = /var/www/sitemap.xml
  Filter     = ^/doc/.*
  Filter     = ^/stats.*
```

See [https://github.com/wlbr/sitemapms](https://github.com/wlbr/sitemapms) for details.
