define([
  'zepto',
  'underscore',
  'backbone',
  'iscroll',
  'text!templates/panel/panelTemplate.html'
], function($, _, Backbone, Iscroll, panelTemplate){

  var PanelView = Backbone.View.extend({
    el: '#menu-panel',
	
	events: function() {
		
		var events = {};
		var press = '';
		var swipe = '';
		if (Modernizr.touch) { press = 'tap'; swipe = 'swipeLeft' } else { press = 'click'; swipe = 'click' }

		events[press + ' .item-me'] = 'goToProfile';
		events[press + ' .item-skim']='goToSingles';
		//events[swipe + ' #menu-panel'] = 'goToSingles';
		
		return events
	},

    render: function(){
    	
    	this.$el.html(panelTemplate);
    	
    	var panelScroll = new window.iScroll('menu-panel', {
											bounce: true,
							    			vScrollbar: false,
							    			lockDirection: true});
    	
    	if(!this.options.init) {
    		$('#app-loader').animate({ translate3d: '50%,0,0' }, 200, 'ease-out');
    	}
    },
    
    goToProfile: function() {
    	$('.overlay').css('display','block');
    	Backbone.history.navigate('profile', { trigger:true });
    },
    
    goToSingles: function() {
    	$('.overlay').css('display','block');
    	Backbone.history.navigate('singles', { trigger: true });
    }

  });
  
  return PanelView;
  
});