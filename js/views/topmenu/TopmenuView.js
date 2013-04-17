define([
  'zepto',
  'underscore',
  'backbone',
  
  'text!templates/topmenu/topmenuTemplate.html'
], function($, _, Backbone, topmenuTemplate){

  var TopmenuView = Backbone.View.extend({
	el: '#top-bar',
	
	events: function() {
		
		var events = {};
		var press = '';
		var swipe = '';
		if (Modernizr.touch) { press = 'tap'; swipe = 'swipeLeft' } else { press = 'click'; swipe = 'click' }
		
		events[press + ' .gotopanel'] = 'goToPanel';
		
		return events
	},

	initialize: function() {
		_.bindAll(this, 'render', 'goToPanel');
	},
	
    render: function(){
    	
    	var wH = $(window).height();
    	var lineHeight  = Math.round(wH*10/100);
    	$('#customStyles').append('.top-coin-bg{ line-height: ' + lineHeight + 'px; }');
    	
    	var infos = [{ nickname: localStorage.getItem('playMeNickname'), credits: localStorage.getItem('playMeCredits') }];
        var params = { infos: infos , _: _ };
    	var compiledTemplate = _.template( topmenuTemplate, params );
    	this.$el.html(compiledTemplate);
    },
    
    goToPanel: function() {
    	Backbone.history.navigate('panel', true);
    	//document.location.hash = '/panel'; 
    }

  });
  
  return TopmenuView;
  
});
