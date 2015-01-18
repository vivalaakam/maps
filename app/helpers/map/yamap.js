define(['ymaps'] , function(ymaps) {
  function YaMap(container , center , zoom) {
    this._map;
    this._objects = {};
    this.init(container , center , zoom);
  }

  YaMap.prototype.init = function(container , center , zoom) {
    var self = this;
    this.ready(function() {
      self._map = new ymaps.Map(container , {
        center: [center.lat , center.lng],
        zoom: zoom,
        controls: ['zoomControl']
      });
      self._objects['#map'] = self._map;
    })
  }

  YaMap.prototype.addMarker = function(data) {
    var options = {};
    if(data.icon) {
      options.iconLayout =  'default#image';
      options.iconImageHref = data.icon.href;
      options.iconImageSize = data.icon.size;
      options.iconImageOffset = data.icon.offset;
    }
    var marker = new ymaps.GeoObject({
      geometry: {
        type: "Point",
        coordinates: [data.center.lat , data.center.lng]
      }
    } , options);
    this._objects[data.hash] = marker;
    this._map.geoObjects.add(marker);
  };

  YaMap.prototype.setCenter = function(coord) {
    this._map.setCenter([coord.lat , coord.lng]);
  }

  YaMap.prototype.ready = ymaps.ready;

  YaMap.prototype.on = function(event , hash , action) {
    var element = this._objects[hash];
    element.events.add(event, action);
  };

  YaMap.prototype.getCenterAndZoom = function(data) {
    var center = this._map.getCenter();
    return {
      center : {
        lat : center[0],
        lng : center[1]
      },
      zoom : this._map.getZoom()
    }
  };

  return YaMap;
})
