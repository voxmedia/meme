module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({

    // Empty directories before build process
    clean: {
      css: ["dist/*.css", "dist/*.css.map"],
      js: ["dist/*.js", "dist/*.js.map"]
    },

    // Use Uglify to bundle up a pym file for the home page
    uglify: {
      options: {
        sourceMap: true
      },
      homepage: {
        files: {
          'dist/scripts.js': [
            'source/javascripts/vendor/jquery.js',
            'source/javascripts/vendor/underscore.js',
            'source/javascripts/vendor/backbone.js',
            'source/javascripts/main.js',
            'source/javascripts/models/meme.js',
            'source/javascripts/views/meme-canvas.js',
            'source/javascripts/views/meme-editor.js',
            'source/javascripts/helpers/font-monitor.js',
            'source/javascripts/settings.js'
          ]
        }
      }
    },

    // Transpile SASS
    sass: {
      dist: {
        options: {
          style: 'compressed',
          compass: true
        },
        files: {
          'dist/styles.css': 'source/stylesheets/main.scss'
        }
      }
    }

  });

  // Load the task plugins
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['clean', 'sass', 'uglify']);

};
