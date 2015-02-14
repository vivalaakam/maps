define(['underscore' , 'backbone' , 'localStorage'] , function(_ , Backbone , localStorage) {
  var Defaults = Backbone.Model.extend({
    defaults : {
      center : [55.76, 37.64],
      zoom:12,
      group: false,
      objects : true
    },
    toggle : function(name) {
      this.set(name , !this.get(name));
    },
    initialize : function() {
      this.fetch();
      this.on('change', this.save, this);
    },
    localStorage: new localStorage("map-default"),
    fetch: function() {
      this.set(JSON.parse(this.localStorage.localStorage().getItem("map-default")));
    },

    save: function(attributes) {
      this.localStorage.localStorage().setItem("map-default", JSON.stringify(this.toJSON()));
    },

    destroy: function(options) {
      this.localStorage.localStorage().removeItem("map-default");
    },

    isEmpty: function() {
      return (_.size(this.attributes) <= 1); // just 'id'
    }
  });
  return Defaults;
})
