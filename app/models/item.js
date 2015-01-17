define(['underscore' , 'backbone'] , function(_ , Backbone) {
    var Item = Backbone.Model.extend({
        defaults : {
            active: false,
            search: false,
            groups : []
        }
    }); 
    return Item;
})
