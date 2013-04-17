require.config({

  shim: {
	easel: {
		exports: 'createjs'
	},
	tween: {
		deps: ['easel'],
		exports: 'Tween'
	}
  },
  
  paths: {
    zepto: 'libs/zepto/zepto.min',
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-min',
    templates: '../templates',
    iscroll: 'libs/iscroll/iscroll',
    easel: 'libs/createjs/easeljs-0.6.0.min',
    tween: 'libs/createjs/tweenjs-0.4.0.min'
  }

});

require([
  // Load our app module and pass it to our definition function
  'app',

], function(App){
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  App.initialize();
});
