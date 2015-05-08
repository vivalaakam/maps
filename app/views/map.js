define(['jquery', 'underscore', 'backbone', 'helpers/map',
    'collections/items', 'collections/groups',
    'views/map/element', 'views/map/group', 'views/map/finder', 'views/map/zoomer',
    'text!templates/map.html', 'models/mapdefault'
  ],
  function($, _, Backbone, MapHelper, Items, Groups, MapElement, MapGroup, MapFinder, MapZoomer, mapTemplate, Settings) {

    var Map = Backbone.View.extend({
      el: $('.container .content'),
      events: {
        "keyup .search__element": "searchElement",
        "click .map .map_toggler": "toggleMap",
        "blur .map_finder__element": "blurFinder",
        "focus .map_finder__element": "focusFinder",
        "keyup .map_finder__element": "searchFinder",
        "change .groupItems": "groupItems"
      },
      finderResults: [],
      template: _.template(mapTemplate),
      grouped: false,
      initialize: function() {
        this.settings = new Settings();
        this.groups = new Groups();
        this.placemarks = new Items();
        this.groups.setLinks(this.placemarks);
        this.placemarks.on('add', this.addItem, this);
        this.placemarks.on('reset', this.addItems, this);
        this.groups.on('add', this.addGroup, this);
        this.groups.on('reset', this.addGroups, this);
        this.placemarks.on('add', this.mapItem, this);
        this.placemarks.on('reset', this.mapItems, this);

      },
      render: function() {
        var self = this;
        this.$el.html(this.template());
        if (self.settings.get('group')) {
          this.$el.find('.groupItems').attr('checked', 'checked');
        }
        this.list = this.$el.find('.list .elements');
        this.map = new MapHelper();
        this.map.setMap(this.$el.find(".map .map_container").get(0), this.settings.get('center'), this.settings.get('zoom'));
        this.map.ready(function() {
          self.map.on('boundschange', '#map', function(e) {
            var data = self.map.getCenterAndZoom(e);
            self.settings.set(data);
          });
          self.zoomer = new MapZoomer();
          self.$el.find('.map').append(self.zoomer.el);
        });
        this.toggleMap(false);
        this.search = this.$el.find('.search__element');
        this.finder = this.$el.find(".map_finder__element");

        this.placemarks.fetch();
        this.groups.fetch({
          reset: true
        });


      },
      addGroup: function(model) {

        var view = new MapGroup({
          model: model,
          parent: this
        });
        this.list.append(view.render().el);
      },
      addGroups: function() {
        if (this.settings.get('group')) {
          this.groups.each(this.addGroup, this);
        }
      },
      addItem: function(model) {
        if (!this.settings.get('group')) {
          var self = this;
          var view = new MapElement({
            model: model,
            parent: this
          });
          self.list.append(view.render().el);
        }
      },
      addItems: function() {
        if (!this.settings.get('group')) {
          this.placemarks.each(this.addItem, this);
        }
      },
      mapItem: function(model) {
        if (!model.get('onMap')) {
          this.setPlaceMark(model);
          model.set('onMap', true);
        }
      },
      mapItems: function() {
        this.placemarks.each(this.mapItem, this);
      },
      setPlaceMark: function(model) {
        var attributes = model.attributes,
          self = this,
          hash = model.get('hash');

        self.map.ready(function() {
          var icon = {
            href: '/images/' + attributes.image + '.png',
            size: [23, 32],
            offset: [-12, 0]
          };
          self.map.addMarker({
            center: attributes.coord,
            hash: hash,
            icon: icon
          });
          model.on('remove', function() {
            self.map.removeMarker(hash);
          });
          model.on("change:active", function() {
            if (model.get("active")) {
              self.map.setCenter(attributes.coord);
            }
          });

          self.map.on('click', hash, function() {
            self.activatePlaceMark(model);
          });
        });
      },
      activatePlaceMark: function(model) {
        this.placemarks.where({
          active: true
        }).forEach(function(placemark) {
          placemark.set("active", false);
        });
        model.set("active", true);
      },

      searchElement: function(e) {
        var search = this.search.val();
        if (search !== "" && e.keyCode !== 27) {
          this.list.addClass("active_search");
          this.placemarks.forEach(function(placemark) {
            var substr = new RegExp(search);
            placemark.set("search", substr.test(placemark.get("name")));
          });
        } else {
          this.search.val("");
          this.list.removeClass("active_search");
          this.placemarks.forEach(function(placemark) {
            placemark.set("search", false);
          });
        }
      },
      toggleMap: function(reset) {
        var mainpane = this.$el.find(".mainpane"),
          self = this;
        if (reset !== false) {
          this.settings.toggle('objects');
        }

        if (this.settings.get('objects')) {
          mainpane.removeClass("list_hidden");
        } else {
          mainpane.addClass("list_hidden");
        }
        this.map.ready(function() {
          self.map.resetViewport();
        });

      },
      blurFinder: function(state) {
        var finder = this.finder.closest(".map_finder");
        if (finder.hasClass("active") && (this.finder.val() === "" || state === true)) {
          finder.removeClass("active");
          this.finderResults.forEach(function(result) {
            result.remove();
          });
          this.finderResults = [];
        }
      },
      focusFinder: function() {
        var finder = this.finder.closest(".map_finder");
        if (!finder.hasClass("active")) {
          finder.addClass("active");
        }

        if (this.finder.val() !== "") {
          this.searchFinder();
        }
      },
      searchFinder: function() {
        var substr = this.finder.val(),
          test = new RegExp(substr),
          self = this,
          results = this.$el.find(".map_finder__results");

        this.finderResults.forEach(function(result) {
          result.remove();
        });
        this.finderResults = [];
        if (substr !== "") {
          var placemarks = this.placemarks
            .filter(function(placemark) {
              if (test.test(placemark.get('name'))) {
                return true;
              }
            }).
          forEach(function(placemark) {
            var result = new MapFinder({
              model: placemark,
              parent: self
            });
            self.finderResults.push(result);
            results.append(result.render().el);
          });
        }
      },
      groupItems: function() {
        this.list.empty();
        this.settings.toggle('group');
        if (this.settings.get('group') && this.groups.length) {
          this.addGroups();
        } else {
          this.addItems();
        }
      }
    });

    return Map;

  });
