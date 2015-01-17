 require.config({
    paths: {
        jquery: '../scripts/jquery',
        underscore: '../scripts/underscore',
        backbone: '../scripts/backbone',
        ymaps : "//api-maps.yandex.ru/2.1/?lang=ru-RU"
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
        }
    },

});
