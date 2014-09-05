# Meme v.2

Contributors: Yuri Victor, Joshua Benton, Matt Montgomery, Ivar Vong, Steve Peters, Flip Stewart. Version-2 refactor by Greg MacWilliam.

Meme is a generator that Vox Media uses to create social sharing images. See working version at [http://www.sbnation.com/a/meme](http://www.sbnation.com/a/meme).

![screenshot](readme.png)

## What's new in version 2.0?

* Refactored into a formal MV* app.
* Fixed bugs with rendering state and repeat drag-n-drop images.
* Improved initial rendering with loaded web fonts.
* Improved cross-origin options: both for base64 images and CORS.
* Highly (and easily!) customizable editor and theme options.
* Watermark selector.

## Install

* `git clone https://github.com/voxmedia/meme.git`
* `bundle install`
* `bundle exec middleman`

This will start a local web server running at: `http://localhost:4567/`

## Customization

### Setup

Settings and controls are customized through `source/javascripts/settings.js.erb`.

### Fonts

Include your own fonts in `stylesheets/_fonts.scss`. Then add your fonts as options into the settings file.

### Editor theme

Set the `$theme-color` variable in `source/stylesheets/_vars.scss`.

## Examples

* http://www.sbnation.com/a/meme
* https://twitter.com/voxdotcom/status/481671889094340608
* https://twitter.com/voxdotcom/status/479228288221470721
* https://twitter.com/voxdotcom/status/481619042545844225

## Contributing

1. Fork it ( https://github.com/voxmedia/meme/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

