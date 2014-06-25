# Meme

Contributors: Yuri Victor

Tags: meme

Stable tag: 0.1.0

License: GPLv2 or later

License URI: http://www.gnu.org/licenses/gpl-2.0.html

## Description

A meme generator used to create social sharing images

## Design decisions

Images are base64 and javascript is inline because of some strange canvas constructs which don't allow external data sources which can happen when using CDNs or other stuff.

I chose middleman because there are great sensible defaults, but there's no reason this couldn't be a single page html file.


## Extras

### Add fonts
Add your fonts in `stylesheets/_fonts.scss`

Fonts are handled as data attributes in `source/partials/_editor.html.erb`

### Add watermark

Convert an svg to base64 and add here
