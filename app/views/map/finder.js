define(['jquery' , 'underscore' , 'backbone', 'text!templates/map_finder.html'] , function($ , _ , Backbone , MapFinder) {
    var FinderElement = Backbone.View.extend({
        tagName : "li",
        events: {
            "click a" : "activatePlaceMark"
        },
        initialize : function(opts) {
            var self = this;
            this.parent = opts.parent;

        },
        className : "finder list-group-item",
        template : _.template(MapFinder),
        render : function() {
            var model = this.model.toJSON();
            this.$el.html(this.template(model));
            return this;
        },
        activatePlaceMark : function() {
            this.parent.activatePlaceMark(this.model);
            this.parent.blurFinder(true);
        }
    });
    return FinderElement;
})