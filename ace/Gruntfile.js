/*
 * ACE
 * https://github.com/tain335/tain335
 *
 * Copyright (c) 2014 tain335
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    ACE: {
      options: {
        encoding: 'utf-8',
        root: '/home/paul/Project/ace/modMock'
      },
      'scan-all': {
        options: {
          
        }
      },
      'copy-all': {
        options: {
          dest: '/home/paul/Project/ace/proj',
          indeed: true
        }
      }
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['jshint', 'clean' ,'ACE']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['ACE']);

};
