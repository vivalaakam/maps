define(['jquery',  'underscore',  'backbone' , 'helpers/map'  ,
    'collections/items' , 'collections/groups',
    'views/map/element' , 'views/map/group',  'views/map/finder' ,
    'text!templates/map.html'],
    function($, _, Backbone , MapHelper , Items , Groups, MapElement , MapGroup, MapFinder , mapTemplate){

    var Map = Backbone.View.extend({
        el : $('.container .content'),
        events : {
            "keyup .search__element" : "searchElement",
            "click .map .map_toggler" : "toggleMap",
            "blur .map_finder__element" : "blurFinder",
            "focus .map_finder__element" : "focusFinder",
            "keyup .map_finder__element" : "searchFinder",
            "change .groupItems" : "groupItems"
        },
        finderResults : [],
        template: _.template(mapTemplate),
        grouped: false,
        initialize: function() {
            this.groups = new Groups();
            this.placemarks = new Items();
            this.groups.setLinks(this.placemarks);
            this.placemarks.on('add', this.addItem, this);
            this.placemarks.on('reset', this.addItems, this);
            this.groups.on('add' , this.addGroup , this);
            this.groups.on('reset' , this.addGroups , this);

        },
        render : function() {
            this.$el.html(mapTemplate)
            this.list = this.$el.find('.list .elements');
            this.map = new MapHelper();
            this.map.setMap(this.$el.find(".map .map_container").get(0) , [55.76, 37.64],10);
            this.toggler = this.$el.find(".map .map_toggler");
            this.search = this.$el.find('.search__element');
            this.togglerState = "active";
            this.finder = this.$el.find(".map_finder__element");

            this.placemarks.fetch();
            this.groups.fetch({reset:true});
        },
        addGroup: function(model) {

            var view = new MapGroup({model: model, parent:  this});
            this.list.append(view.render().el);
        },
        addGroups: function() {
            if(this.grouped) {
                this.groups.each(this.addGroup , this)
            }
        },
        addItem : function(model) {
            var self = this;
            var view = new MapElement({model: model , parent : this});
            self.list.append(view.render().el);
            if(!model.get('onMap'))  {
              this.setPlaceMark(model);
              model.set('onMap' , true);
            }
        },
        addItems : function() {
            this.placemarks.each(this.addItem , this);
        } ,
        setPlaceMark : function(model) {
          var attributes = model.attributes ,
              self = this,
              center = [attributes.coord.lat , attributes.coord.lng ],
              hash = model.get('hash');

          self.map.ready(function() {
            var icon = {
              href : '/images/'+ attributes.image +'.png',
              size : [23, 32],
              offset : [-12, 0]
            };
            self.map.addMarker({center: center , hash: hash , icon:icon});
            model.on('remove' , function() {
              self.map.removeMarker(hash);
            });
            model.on("change:active" , function() {
              if(model.get("active")) {
                self.map.setCenter(center);
              }
            });

            self.map.on('click' , hash , function() {
              self.activatePlaceMark(model);
            });
          });
          /*
          ymaps.ready(function() {
            var placemark = new ymaps.Placemark(center, { },
            {
              iconLayout: 'default#image',
              iconImageHref: '/images/'+ attributes.image +'.png',
              iconImageSize: [23, 32],
              iconImageOffset: [-12, 0]
            });
            self.map.geoObjects.add(placemark);
            model.on('remove' , function(point) {
              self.map.geoObjects.remove(placemark);
            });

            model.on("change:active" , function() {
              if(model.get("active")) {
                self.map.setCenter(center);
              }
            });

            placemark.events.add('click' , function() {
              self.activatePlaceMark(model);
            });
          }); */
        },
        activatePlaceMark : function(model) {
            this.placemarks.where({active : true}).forEach(function(placemark) {
                placemark.set("active" , false);
            });
            model.set("active" , true);
        } ,

        searchElement : function(e) {
            var search = this.search.val();
            if(search !== "" && e.keyCode !== 27) {
                this.list.addClass("active_search");
                this.placemarks.forEach(function(placemark) {
                    var substr = new RegExp(search);
                    placemark.set("search" , substr.test(placemark.get("name")));
                });
            } else {
                this.search.val("");
                this.list.removeClass("active_search");
                this.placemarks.forEach(function(placemark) {
                    placemark.set("search" , false);
                });
            }
        },
        toggleMap : function() {
            var map = this.$el.find(".map") , list = this.$el.find(".list") , mainpane = this.$el.find(".mainpane");
            if(this.togglerState === "active") {
                mainpane.addClass("list_hidden");
                this.togglerState = "hidden";
            } else {
                mainpane.removeClass("list_hidden");
                this.togglerState = "active";
            }
            this.map.container.fitToViewport();
        },
        blurFinder : function(state) {
            var finder = this.finder.closest(".map_finder");
            if( finder.hasClass("active") &&  ( this.finder.val() === "" || state === true) ) {
                finder.removeClass("active");
                this.finderResults.forEach(function(result) {
                    result.remove();
                });
                this.finderResults = [];
            }
        },
        focusFinder : function() {
            var finder = this.finder.closest(".map_finder");
            if(! finder.hasClass("active")) {
                finder.addClass("active");
            }

            if(this.finder.val() !== "") {
                this.searchFinder();
            }
        },
        searchFinder: function() {
            var substr = this.finder.val() ,
                test = new RegExp(substr) ,
                self = this,
                results = this.$el.find(".map_finder__results");

            this.finderResults.forEach(function(result) {
                result.remove();
            });
            this.finderResults = [];
            if(substr !== "") {
            var placemarks = this.placemarks
                .filter(function(placemark) {
                    if(test.test(placemark.get('name'))) {
                        return true;
                    }
                }).
                forEach(function(placemark) {
                    var result = new MapFinder({model: placemark , parent: self });
                    self.finderResults.push(result);
                    results.append(result.render().el);
                });
            }
        },
        groupItems: function() {
            this.list.empty();
            this.grouped = !this.grouped;
            if(this.grouped && this.groups.length) {
                this.addGroups();
            } else {
                this.addItems();
            }
        }
    });

    return Map;

});
