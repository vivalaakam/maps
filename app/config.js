 require.config({
    paths: {
        jquery: '../scripts/jquery',
        underscore: '../scripts/underscore',
        backbone: '../scripts/backbone',
        ymaps : "//api-maps.yandex.ru/2.1/?lang=ru-RU",
        localStorage : "../scripts/backbone.localStorage"
    },
    shim: {
        backbone: {
            deps: ['jquery','underscore'],
            exports: 'Backbone'
        },
        underscore : {
            exports: '_'
        },
        ymaps: {
            exports: 'ymaps'
        },
        localStorage : {
          deps : ['backbone'],
          exports: 'Backbone'
        }
    },

});
