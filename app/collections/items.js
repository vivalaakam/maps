define(['underscore' , 'backbone' , 'models/item'] , function(_ , Backbone , Item) {
    var ItemColleciton = Backbone.Collection.extend({
        model : Item,
        url : "/items",
        search : function(search) {
            var self = this;
            return this.filter(function(placemark) {
                var substr = new RegExp(search);
                return substr.test(placemark.get("name"));
            })
        }
    });

    return ItemColleciton;
}) ;
