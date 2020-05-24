---
layout: post
category: project
title: "SitemapMS"
date: 2015-01-20
description: "Hihoho"
---

SitemapMS is a google sitemap (sitemap.xml) generator for websites powered by CMSMS (CMS Made Simple) - [www.cmsmadesimple.org](https://www.cmsmadesimple.org). It reads the pages and related information straight out of the CMSMS database. Thus it is really fast, its access is not tracked by analytics tools as Piwik etc. and it is perfectly fitting to be run as a cron job.

The page priorities in the sitemap.xml are calculated by the page/menu hierarchy inside of the CMS.

Everything can be controlled using command line switches. The command-line options are overruling the config file settings. So first the config file gets loaded and afterwards the command line arguments are set.


### Example configuration file:

```ini
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
