define(['helpers/map/yamap'], function(YaMap) {
  var Map = (function() {
    var instance;

    function Map() {
      if (instance) {
        return instance;
      }

      if (this && this.constructor === Map) {
        this.init();
        instance = this;
      } else {
        return Map;
      }
    }

    Map.prototype.setMap = function(container, center, zoom) {
      this._map = new YaMap(container, center, zoom);

      this.ready = this._map.ready;
      this._ready.forEach(this._map.ready);
    };

    Map.prototype.setCenter = function(coord) {
      this._map.setCenter(coord);
    };

    Map.prototype.setZoom = function(val, callback) {
      this._map.setZoom(val, callback);
    };

    Map.prototype.getZoom = function() {
      return this._map.getZoom();
    };

    Map.prototype.init = function() {
      this._counter = 0;
      this._ready = [];
    };

    Map.prototype.ready = function(callback) {
      this._ready.push(callback);
    };

    Map.prototype.addMarker = function(data) {
      if (!data.hash) {
        data.hash = this.unique();
      }
      this._map.addMarker(data);
      return data.hash;
    };

    Map.prototype.on = function(event, elem, action, context) {
      this._map.on(event, elem, action, context);
    };

    Map.prototype.unique = function() {
      return '#hash' + this._counter++;
    };

    Map.prototype.getCenterAndZoom = function(data) {
      return this._map.getCenterAndZoom(data);
    };

    Map.prototype.resetViewport = function() {
      this._map.resetViewport();
    };

    Map.prototype.getMinMaxZoom = function(callback, context) {
      this._map.getMinMaxZoom(callback, context);
    };

    return Map;
  }());
  return Map;
});
