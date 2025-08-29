---
layout: post
category: blog
title: "Xplanet on macOS"
tags: osx macos
date: 2022-09-30
---

Installation of [Xplanet](https://xplanet.sourceforge.net) on macOS is rather simple, but the configuration can be tricky to find for basic use cases. Xplanet is extremely powerful and has a lot of possibilities; please check its homepage for more details. However, achieving a simple display of the classic blue marble background with day/night boundaries and clouds is straightforward.

You can install it using Homebrew. The standard files will be in `${HOMEBREW_PREFIX}/share/xplanet` (so `/opt/homebrew/share/xplanet` on an Arm Mac).

On macOS, Xplanet will look for a directory at `~/Library/Xplanet`. You can store your own maps (i.e., earth images) and configuration files there to protect them from being overwritten by Homebrew updates.

Install the basic Xplanet and create the initial files:
```bash
brew install xplanet
XPLANETHOME=$(brew --prefix xplanet)
mkdir -p "${HOME}/Library/Xplanet/images"
cp "${XPLANETHOME}/share/xplanet/images/earth.jpg" "${HOME}/Library/Xplanet/images/earth2k.jpg"
cp "${XPLANETHOME}/share/xplanet/images/night.jpg" "${HOME}/Library/Xplanet/images/night2k.jpg"
touch "${HOME}/Library/Xplanet/default"
xplanet -num_times 1
xplanet -num_times 1 -projection mercator
```

During the first two runs of Xplanet, macOS (at least on Monterey) will ask for permission to access and change desktop settings. You will need to grant this permission.

Try different settings for `-projection`. No value (omitting the switch completely), `mercator`, `rectangular`... many others are [available](https://xplanet.sourceforge.net/README).

## Configuration

Configuring Xplanet with your own map files is simple. Create a file called `default` in `~/Library/Xplanet` containing the following lines:
```config
# all images need to be of the same resolution
map=earth2k.jpg               # This image needs to be cloud-free
night_map=night2k.jpg         # This image needs to be cloud-free
cloud_map=clouds2k.jpg
cloud_threshold=120
```

You can find the default files in `~/Library/Xplanet/images`. You may replace these files with anything you like. All images (day, night, and clouds) must be the exact same size; otherwise, a warning will be generated. And `cron` might send you an email every time that warning is generated.

If you don't like the default files, several nicer alternatives are available:

   * [NASA Visible Earth](http://visibleearth.nasa.gov). Search for _Blue Marble_ and _Black Marble_.
   * Jan Kaluza's nice [night map](https://xplanet.sourceforge.net/Extras/night_jk.jpg)
   * There is a 2k day image at [Xglobe](http://www.radcyberzine.com/xglobe)

## Getting Clouds

In 2022, it is surprisingly difficult to find regularly updated cloud maps. Thankfully, [Matt Eason](https://github.com/matteason/daily-cloud-maps#available-images) provides some.
   * [4096x2048](https://matteason.github.io/daily-cloud-maps/4096x2048-clouds.jpg)
   * [2048x1024](https://matteason.github.io/daily-cloud-maps/2048x1024-clouds.jpg)

The images are updated once a day, around 15:30 UTC.

Download the clouds using:
```bash
curl https://matteason.github.io/daily-cloud-maps/2048x1024-clouds.jpg -o ~/Library/Xplanet/clouds2k.jpg
```

## Automation

Automation can be easily achieved using `cron`. We need to run Xplanet frequently to see the progression of the day/night boundaries. Downloading the clouds once a day is sufficient.

Add the following lines using the command `crontab -e`:

```bash
*/30 * * * *    /opt/homebrew/bin/xplanet -num_times=1 -projection mercator > /dev/null 2>&1
45 17 * * *    /usr/bin/curl -s https://matteason.github.io/daily-cloud-maps/2048x1024-clouds.jpg -o ~/Library/Xplanet/clouds2k.jpg > /dev/null 2>&1
```
Please check and adjust the path to xplanet using `which xplanet`. The above will be correct on M1 Macs, but the path is different on Intel machines.

The first line will execute Xplanet every 30 minutes. The second one will download the cloud map at 17:45 local time.
