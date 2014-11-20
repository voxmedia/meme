# Statesman meme generator

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

The Statesman's meme generator is a lightly-modified fork of the [Vox meme generator](https://github.com/voxmedia/meme). It has been modified to work without Ruby (except Compass, which is required to run the build process).

Assets are now built using Grunt, which transpiles the SASS files and concatenates/minifies the JavaScript. We modified the app this way to make it more easily deployable on our internal infrastructure.

![screenshot](readme.png)

## Deploying

Statesman images, fonts, etc. are currently in the app so you'll need to follow the steps below to customize the app for your use:

1. Edit the settings file at `source/javascripts/settings.js`.
2. Add any fonts you'll need at `source/stylesheets/_fonts.scss`.
3. `npm install`
4. Run `grunt`
5. Open the `index.html` file in your browser and meme away.

See the original repo at https://github.com/voxmedia/meme for additional info.
