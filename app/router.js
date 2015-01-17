define([  'jquery',  'underscore',  'backbone',
          'views/map'],
          function($, _, Backbone, Map ){
    var AppRouter = Backbone.Router.extend({
        routes: {
            'map': 'showMap',
            '' : 'showMap'
        }
    });

    var initialize = function(){
        var app_router = new AppRouter();
        app_router.on('route:showMap', function(){
            var map = new Map();
                map.render();
        });
        app_router.on('route:defaultAction', function(actions){
          var map = new Map();
            map.render();
        });
        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});
