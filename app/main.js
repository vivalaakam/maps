 require.config({
    paths: {
        templates: './templates',
        ymaps : "//api-maps.yandex.ru/2.1/?lang=ru-RU"
    },
    shim: {
        ymaps: {
            exports: 'ymaps'
        }
    },
});

require(['app'], function(App){
    App.initialize();
});