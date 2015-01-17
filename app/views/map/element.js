define(['jquery' , 'underscore' , 'backbone' , 'text!templates/map/element.html'] , function($ , _ , Backbone , MapElement) {
    var ListElement = Backbone.View.extend({
        className : "element row",
        events : {
            "click .element_name a" : "activatePlaceMark",
            "click .element_image img" : "activatePlaceMark"
        },
        initialize : function(opts) {
            var self = this;
            this.parent = opts.parent;
            this.model.on("change:search", this.toggleSearch.bind(this));
            this.model.on("change:active", this.toggleActive.bind(this));
        },
        template : _.template(MapElement),
        render: function() {
            var model = this.model.toJSON();
            this.$el.attr("id" , "element_"+ model.id);
            this.$el.html(this.template(model));
            return this;
        },
        activatePlaceMark : function() {
            this.parent.activatePlaceMark(this.model);
        },
        toggleSearch :function() { 
            if(this.model.get("search")) {
                this.$el.addClass('searched');
            } else {
                this.$el.removeClass('searched');
            }
        },
        toggleActive : function() {
           if(this.model.get("active")) {
                this.$el.addClass('active');
            } else {
                this.$el.removeClass('active');
            } 
        }
    });
    return ListElement;
})