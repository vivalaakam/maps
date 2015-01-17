define(['underscore' , 'backbone'] , function(_ , Backbone) {
    var Group = Backbone.Model.extend({
                defaults: {
                    expanded: false
                },
                initialize : function() {
                    if(! this.get('links')) {
                        this.set('links' , []);
                    }
                },
                setLink: function(link) {
                    var links = this.get("links"); 
                    links.push(link);
                    this.set("links" , links);
                    this.trigger("change:links" , this);
                },
                removeLink : function(link) {
                    var links = this.get("links") , index = links.indexOf(link);
                    links.splice(index , 1);
                    this.set("links" , links);
                    this.trigger("change:links" , this);
                    
                }
            });
    return Group;
})