module.exports = function(grunt) {
  grunt.initConfig({
    requirejs: {
      production: {
        options: {
          baseUrl: "./app",
          mainConfigFile: "./app/config.js",
          out: "./public/javascripts/main.js",
          name : "./main",
          optimize: "uglify"
        }
      },
      dev : {
        options: {
          baseUrl: "./app",
          mainConfigFile: "./app/config.js",
          out: "./public/javascripts/main.js",
          name : "./main",
          optimize: "none"
        }
      },
      compile: {
        options: {
          baseUrl: "./app",
          mainConfigFile: "./app/config.js",
          out: "./public/javascripts/main.js",
          name : "./main",
          optimize: "none"
        }
      }
    },
    less : {
      dev: {
        options: {
          compress: false,
          yuicompress: false,
          optimization: 2
        },
        files: {
          "./public/stylesheets/style.css": "./less/app.less" // destination file and source file
        }
      },
      production : {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          "./public/stylesheets/style.css": "./less/app.less" // destination file and source file
        }
      }
    },
    watch: {
      scripts: {
        files: ['./app/**/*.js'],
        tasks: ['requirejs:dev'],
        options: {
          spawn: false,
        }
      },
      less : {
          files: ['./less/*.less'],
          tasks: ['less:dev'],
          options: {
            spawn: false,

        }
      },
      template : {
          files : ['./app/templates/**/*.html'],
          tasks: ['requirejs:dev'],
          options : {
            spawn: false
          }
      },
      express : {
        files : ['./server/**/*.js'],
        tasks : ['express:dev'],
        options : {
          spawn:false
        }
      }
    },
    server: {
      port: 3000,
      base: './public'
    },
    express : {
      options: {
        port: 3000,
      },
      dev :{
        options : {
          script: './server/bin/www'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('default' , ['requirejs:dev' , 'less:dev', 'express' , 'watch']);
  grunt.registerTask('heroku' , ['requirejs:production' , 'less:production'])
};
