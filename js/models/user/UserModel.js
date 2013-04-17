define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  
  var UserModel = Backbone.Model.extend({
		urlRoot: function() {
			var base = 'http://ks384914.kimsufi.com/api/v1/users';
			if (this.isNew()) return base + '.json';
			return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id + '.json';
	    }, 
		url: function() {
			var base = 'http://ks384914.kimsufi.com/api/v1/users';
			if (this.isNew()) return base + '.json';
			return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id + '.json';
	    },

		defaults: {

		},
	    
	    toJSON: function(){
	    	json = { user: _.clone(this.attributes.user) };
	    	if(this.get('profile')) {
		    	json.user.profile_attributes = this.get('profile');
		    	this.unset('profile');
		    }
	    	return json;
		}
  });

  return UserModel;

});
