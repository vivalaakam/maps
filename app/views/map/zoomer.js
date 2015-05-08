define(['jquery', 'underscore', 'backbone', 'helpers/map', 'text!templates/map/zoomer.html'],
  function($, _, Backbone, Map, zoomerTemplate) {
    var Zoomer = Backbone.View.extend({
      template: _.template(zoomerTemplate),
      events: {
        'click .zoomIn': 'zoomIn',
        'click .zoomOut': 'zoomOut'
      },
      initialize: function() {
        this.map = new Map();



        this.map.getMinMaxZoom(function(data) {
          this.render();
          this.checkZoom(data);
        }, this);
      },
      render: function() {
        this.$el.html(this.template());

        this.map.on('zoomChange', '#map', this.checkZoom, this);
      },
      checkZoom: function(zoom) {
        this._zoom = zoom;
        this.$el.find('.zoomIn , .zoomOut').removeAttr('disabled');
        if (this._zoom.min === this._zoom.zoom) {
          this.$el.find('.zoomOut').attr('disabled', 'disabled');
        }
        if (this._zoom.max === this._zoom.zoom) {
          this.$el.find('.zoomIn').attr('disabled' , 'disabled');
        }
      },
      zoomIn: function() {
        if (this._zoom.zoom < this._zoom.max) {
          this.map.setZoom(++this._zoom.zoom);
        }
      },
      zoomOut: function() {
        if (this._zoom.zoom > this._zoom.min) {
          this.map.setZoom(--this._zoom.zoom);
        }
      }
    });
    return Zoomer;
  });
