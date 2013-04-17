define([
  'underscore',
  'backbone',
  'models/user/UserModel'
], function(_, Backbone, UserModel){

  var UsersCollection = Backbone.Collection.extend({
      
      model: UserModel,

      initialize : function(models, options) {},
      
      url : function() {
        return 'http://ks384914.kimsufi.com/api/v1/users.json';
      }
     
  });

  return UsersCollection;

});