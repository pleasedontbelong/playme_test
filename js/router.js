// Filename: router.js
define([
  'zepto',
  'underscore',
  'backbone',
  'views/login/LoginView',
  'views/users/SinglesView',
  'views/users/ProfileView',
  'views/panel/PanelView'
], function($, _, Backbone, LoginView, SinglesView, ProfileView, PanelView ) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'singles' : 'showSingles',
      'quizz/:id' : 'quizz',
      'profile' : 'showProfile',
      'panel' : 'showPanel',
      
      // Default
      '*actions': 'defaultAction'
    },
  
    params: {
        host: 'http://ks384914.kimsufi.com'
    },
	
	currentView: null,

	setCurrentView: function(view) {
		this.currentView = view;
	},
	
	removeCurrentView: function() {
		if(this.currentView) {
			this.currentView.remove();
			this.currentView.unbind();
		}
	},
	
	gameListeners: function() {
    	var methods = {};
    	methods.addEventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    	methods.removeEventMethod = window.removeEventListener ? "removeEventListener" : "detachEvent";
    	methods.messageEvent = methods.addEventMethod == "attachEvent" ? "onmessage" : "message";    	
    	
    	return methods;
    }
    
  });
  
  var initialize = function(){

    var app_router = new AppRouter;

    var panelView = new PanelView({ init: true });
    panelView.render();
    
    // Initialize the Game Listener and callback
    var methods = app_router.gameListeners();
    var f = function(e) {
    	var callback = app_router.currentView[e.data.action](e.data.values);    	
    }
    window[methods.addEventMethod](methods.messageEvent, f);
    
    app_router.on('route:defaultAction', function (actions) {
        var loginView = new LoginView({ host: app_router.params.host });
        loginView.render();
    });

    app_router.on('route:showSingles', function (id) {
    	var singlesView = new SinglesView({ host: app_router.params.host });
        singlesView.render();
        $('#content').html(singlesView.$el);
        app_router.setCurrentView(singlesView);
    });

    app_router.on('route:showProfile', function () {
        var profileView = new ProfileView({ host: app_router.params.host });
        profileView.render();
        $('#content').html(profileView.$el);
        app_router.setCurrentView(profileView);
    });

    app_router.on('route:showPanel', function () {
        app_router.removeCurrentView();
        var panelView = new PanelView();
        panelView.render();
    });

    app_router.on('route:quizz', function (id) {

        app_router.setCurrentView('quizz');

        var quizzView = new QuizzView({ host: app_router.params.host, id: id });
        quizzView.render();
    });

    Backbone.history.start();
  };
  return { 
    initialize: initialize
  };
});
