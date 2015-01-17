define(['jquery' , 'underscore' , 'backbone' ,  'views/map/element' , 'text!templates/map/group.html'] , function($ , _ , Backbone ,  MapElement ,MapGroup) {
    var GroupElement = Backbone.View.extend({
                tagName : 'div',
                className: 'group ',
                template: _.template(MapGroup),
                initialize: function(opts) {
                    this.parent = opts.parent;
                },
                events : {
                    'click a.group_expand_link' : "expandGroupEvent"
                },
                expanded : true,
                render: function() {
                    var model = this.model.toJSON();
                    this.$el.html(this.template(model));
                    this.renderLinks(this.model);
                    this.model.on('change:links' , this.renderLinks , this);
                    this.model.on("change:expanded" , this.expandGroup , this);
                    this.expandGroup();
                    return this;
                },
                renderLinks : function(group) {
                    var self = this;
                    self.$el.find(".group_values").empty();
                    group.get("links").forEach(function(link) {
                        var view = new MapElement({model: link , parent:self.parent});
                        self.$el.find(".group_values").append(view.render().el);
                    });
                }, 
                expandGroupEvent: function(e) {
                    e.preventDefault();
                    var expanded = !this.model.get("expanded");
                    this.model.set("expanded" , expanded);
                },
                
                expandGroup : function() {
                    if(this.model.get("expanded")){
                        this.$el.addClass('expanded'); 
                        this.$el.find('a.group_expand_link .group_expand_status').html("-");
                    } else {
                        this.$el.removeClass('expanded');
                        this.$el.find('a.group_expand_link .group_expand_status').html("+");
                    }
                }
                
            });
    
    
    
    return GroupElement;
});