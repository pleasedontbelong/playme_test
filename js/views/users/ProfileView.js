// Filename: views/projects/list
define([
  'zepto',
  'underscore',
  'backbone',
  'iscroll',
  'views/topmenu/TopmenuView',
  // Pull in the Collection module from above,
  'models/user/UserModel',
  'collections/users/UsersCollection',
  'text!templates/users/profileTemplate.html'

], function($, _, Backbone, Iscroll, TopmenuView, UserModel, UsersCollection, profileTemplate){
  var ProfileView = Backbone.View.extend({
	tagName: 'div',
	id: 'current-panel',
	className: 'profile',
	//el: '#content',

	initialize: function() {
		_.bindAll(this, 'render');
		$('#app-loader').css('display','block');
		
	},
	
    render: function(){
    	
        var topmenuView = new TopmenuView();
    	topmenuView.render();
    	
    	var self = this;  
    	var token = localStorage.getItem('playMeToken');
    	var host = this.options.host;
    	
    	var profile = new UserModel();
    	profile.fetch({
            success: function(model, resp) {
                self.generateProfile(profile.toJSON());
            },
            error: function() {
                new Error({ message: 'Could not find that Profile.' });
                window.location.hash = '#';
            }
        });
    },
    
    generateProfile: function(data) {
    	
        var params = { data: data , _: _ };
        var compiledTemplate = _.template( profileTemplate, params );

    	this.$el.html(compiledTemplate);
    	
    	var panelScroll = new window.iScroll('current-panel', {
    														bounce: true,
															vScrollbar: false,
															lockDirection: true});
    	
    	$('.overlay').css('display','none');
    	$('#app-loader').animate({ translate3d: '0,0,0' }, 200, 'ease-out');
    }
    
  });
  return ProfileView;
});