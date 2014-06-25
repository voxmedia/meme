# Meme

Contributors: Yuri Victor

Tags: meme

Stable tag: 0.1.0

License: GPLv2 or later

License URI: http://www.gnu.org/licenses/gpl-2.0.html

## Description

The meme generator Vox uses to create social sharing images

![screenshot](https://raw.githubusercontent.com/yurivictor/meme/master/source/images/screenshot.png)

**examples**
* https://twitter.com/voxdotcom/status/481671889094340608
* https://twitter.com/voxdotcom/status/479228288221470721
* https://twitter.com/voxdotcom/status/481619042545844225

## Install

* `git clone https://github.com/yurivictor/meme.git`
* `bundle install`
* `bundle exec middleman`


## Design decisions

Images are base64 and javascript is inline because of some strange canvas constructs which don't allow external data sources which can happen when using CDNs or other stuff.

I chose middleman because there are great sensible defaults, but there's no reason this couldn't be a single page html file.


## Extras

### Add fonts
Add your fonts in `stylesheets/_fonts.scss`

Fonts are handled as data attributes in `source/partials/_editor.html.erb`

### Add watermark

Convert an svg to base64 and [add here](https://github.com/yurivictor/meme/blob/master/source/partials/_javascripts.html.erb#L158)
