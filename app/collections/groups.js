define(['underscore' , 'backbone' , 'models/group' ] , function(_ , Backbone , Group) {
    var GroupColleciton = Backbone.Collection.extend({
                model:Group,
                url: '/groups',
                setLinks : function(links) {
                    var self = this;
                    this.links = links;
                    this.links.on('add' , self.setLink , this);
                    this.links.on('remove' , this.removeLink , this);
                    this.links.on('reset' , this.resetLinks , this);
                },
                setLink : function(link) {
                    var self = this , test = false;
                    if(self.length ) {
                        link.get('groups').forEach(function(groupId) {
                            var group = self.get(groupId);
                            if( group ) {
                                test = true;
                                group.setLink(link);
                            }
                        });

                        if(!test) {
                            self.get("notInGroup").setLink(link);
                        }

                        self.get("allObjects").setLink(link);
                    }
                },
                resetLinks : function() {
                    this.links.forEach(this.setLink , this);
                },
                initialize: function() {
                    this.on('reset' , this.resetLinks , this);

                },
                search : function(search) {
                    var links = this.links.search(search);

                    links.forEach(function() {

                    });
                },
                removeLink: function(link) {
                    var self = this;
                    link.get('groups').forEach(function(groupId) {
                        var group = self.get(groupId);
                        if(group) {
                            group.removeLink(link);
                        }
                    })
                }});
    return GroupColleciton;
}) ;
