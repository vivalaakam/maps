define([  'jquery',  'underscore',  'backbone',   'views/map', 'ymaps'], function($, _, Backbone, Map , ymaps){
    var AppRouter = Backbone.Router.extend({
        routes: {
            'map': 'showMap',
            '' : 'showMap'
        }
    });
    
    console.log(ymaps);

    var initialize = function(){
        var app_router = new AppRouter();
        app_router.on('route:showMap', function(){
            var map = new Map();
            console.log('showMap')
            ymaps.ready(function() {
                console.log('ready');
                map.render();
            });
        }); 
        app_router.on('route:defaultAction', function(actions){
            var map = new Map();
            console.log('defaultAction');
            ymaps.ready(function() {
                console.log('ready2');
                map.render();
            });
        });
        Backbone.history.start();
    };
    
    return {
        initialize: initialize
    };
});