module.exports = function(grunt) {
  var path = require('path');

  grunt.initConfig({
    // bowerでインストールしたライブラリをsource以下に置く
    bower: {
      install: {
        options: {
          targetDir: './source/js/lib',
          layout: function(type, component, source) {
            return path.join();
          },
          install: true,
          verbose: false,
          cleanTargetDir: true,
          cleanBowerDir: false
        }
      }
    },

    // 監視用の設定
    watch: {
      files: [
        './source/js/main.js',
        './source/js/main-*.js'
      ],
      tasks: ['requirejs']
    },

    // requirejs用の設定
    requirejs: {
      compile: {
        options: {
          name : 'main',  // mainで読み込むjsのpath
          baseUrl: "./source/js",
          mainConfigFile: './source/js/build.js',
          out: "./source/js/all.js",
          optimize: "none"
        }
      }
    },

    // middlemanの設定
    middleman: {
      options: {
        useBundle: true
      },
      server: {
        options: {
          command: "server",
          useBundle: false,
          environment: "development",
          host: "192.168.1.8",
          port: 4567,
          clean: true,
        }
      },
      build: {
        options: {
          command: 'build'
        }
      }
    }
  });

  //matchdepでpackage.jsonから"grunt-*"で始まる設定を読み込む
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('init', ['bower:install']);
  grunt.registerTask('server', ['middleman:server']);
  grunt.registerTask('build', ['requirejs:compile', 'middleman:build']);
}
