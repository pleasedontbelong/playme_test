// Filename: views/projects/list
define([
  'zepto',
  'underscore',
  'backbone',
  'iscroll',
  'views/topmenu/TopmenuView',
  // Pull in the Collection module from above,
  'models/user/UserModel',
  'text!templates/users/singlesTemplate.html',
  'text!templates/users/singleTemplate.html'

], function($, _, Backbone, Iscroll, TopmenuView, UserModel, singlesTemplate, singleTemplate){
  var SinglesView = Backbone.View.extend({                                     
    tagName: 'div',
    id: 'current-panel',
	//el: $("#content"),
	
	events: function() {
		
		var events = {};
		var press = '';
		if (Modernizr.touch) { press = 'tap'; swipe = 'swipeLeft' } else { press = 'click'; swipe = 'click' }

		events[press + ' .play'] = 'play';
		events[press + ' .next'] = 'next';
		events[swipe + ' .singlePics'] = 'next';
		return events
	},

	initialize: function() {
		_.bindAll(this, 'render');
		$('#app-loader').css('display','block');
	},

    render: function(){
    	
    	var self = this;
    	this.infosScroll = [];
    	
    	// Load the top bar
        var topmenuView = new TopmenuView();
    	topmenuView.render();
        
        // Load Singles template
    	this.$el.html(singlesTemplate);
    	
    	// Create css style depends on device height
    	var wH = $(window).height();
    	var ch = Math.round(((wH - (wH*10/100)) * 72 / 100) * 16 /100);
    	$('#customStyles').append('.stars-container{ height: ' + (ch/2) + 'px; line-height: ' + (ch/2) + 'px; }'+"\n"+'.match-container{ height: ' + (ch/2) + 'px; line-height: ' + (ch/2) + 'px; }');
    	
    	this.displayedIds = [];
    	var self = this;
    	var token = localStorage.getItem('playMeToken');    	
    	var host = this.options.host;
        
    	// optimiser pour en charger 'n' d'un coup,
    	// puis attendre la fin des 'n' avant
    	// d'en recharger 'n' autres
    	$.ajax({
    		type: 'GET',
	  		url: host + '/api/v1/users/load_singles/2.json?auth_token=' + token,
	  		dataType: 'json',
	  		success: function(data){ 
	  			self.addProfile(data);
	  		},
	  		error: function(xhr, type){ console.log(xhr); alert('Ajax error: ' + type); }
    	}); 
    },
    
    addProfile: function(data) {
      var self = this;
      var aUsers = [];  
      data.user.forEach(function(value, index){
        aUsers[index] = new UserModel(value);
        self.displayedIds.push(value.id);
      });
    
      var params = { users: aUsers, _: _ };
      var compiledTemplate = _.template( singleTemplate, params );
      
      $('#singles').append(compiledTemplate);
      
      data.user.forEach(function(value, index){
        $('#details'+value.id).on('click',function(e){
          
          var currentLink = $(this);
          var status = currentLink.attr('open');
          var singlePics = $('#singlePics'+value.id);
          var singleInfos= $('#singleInfos'+value.id);
          
          if(status == 'false') {
        	  var values = { pics: '-100%', infos: '-84%' };
        	  currentLink.attr('open', 'true');
              self.infosScroll[value.id] = new window.iScroll('singleInfos'+value.id, {
					bounce: true,
					vScroll: true,
					vScrollbar: false,
					lockDirection: true,
					});
          } else {
        	  var values = { pics: '0', infos: '0' };
        	  currentLink.attr('open', 'false');
        	  self.infosScroll[value.id].vScroll = false;
        	  var index = self.infosScroll.indexOf(value.id);
        	  self.infosScroll.splice(index,1);
          }
	        
          singlePics.animate({ translateY: values.pics }, 200, 'ease-out');
          singleInfos.animate({ translateY: values.infos }, 200, 'ease-out');
          
          console.log(self.infosScroll);
        });
      });
      
      $('.overlay').css('display','none');
      $('#app-loader').animate({ translate3d: '0,0,0' }, 200, 'ease-out');
      
    },
    
    play: function() {
        // Load the game
    	var self = this;
    	var game = $('#game');
    	var player = localStorage.getItem('playMeId');
    	var currentUser = new UserModel({id: 1});
   
    	currentUser.save({ credits: 22 }, {
    		success: function (user) {
    			console.log(user);
    		}
    	});
    	//game.css('display', 'block');
    	//game.attr('src', 'http://ks384914.kimsufi.com/quizz/#g/' + player + '/' + self.displayedIds[0]);
    },
    
    next: function() {
    	
    	$('.overlay').css('display','block');
		var first = $('.single').first();
		var last = $('.single').last();
    	var self = this;
        var host = this.options.host;
    	
    	$.ajax({
	  		type: 'GET',
	  		url: host + '/api/v1/users/load_singles/1.json',
	  		dataType: 'json',
	  		success: function(data){
	    		$('.overlay').css('display','none');
	  			first.animate({ translate3d: '-100%,0,0' }, 200, 'ease-out', function(){ 
	  				self.displayedIds.shift();
	  				first.remove();
	  				last.animate({ translateX: '0' }, 0);
	  			});
	  			last.animate({ translate3d: '-100%,0,0' }, 200, 'ease-out' );
	  			self.addProfile(data);
	  		},
	  		error: function(xhr, type){ alert('Ajax error: ' + type); }
    	});
    },
    
    update_credits: function(data) {
    	console.log('Décrémente ' + data.coins);
    },
    
    endGame: function (data){
        $('#game').css('display','none');
        $('#game').attr('src', 'loading-game.html');
    }
    
  });
  return SinglesView;
});