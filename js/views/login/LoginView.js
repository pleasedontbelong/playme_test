define([
  'zepto',
  'underscore',
  'backbone',
  'tween',
  'text!templates/login/loginTemplate.html'
  
], function($, _, Backbone, Tween, loginTemplate){

  var LoginView = Backbone.View.extend({
    el: $('#login'),
	
	events: function() {
		
		var events = {};
		var press = '';
		if (Modernizr.touch) { press = 'tap'; } else { press = 'click'; }

		events[press + ' .connexion'] = 'auth';
		return events
	},

	initialize: function() {
		_.bindAll(this, 'render', 'auth');
		this.$el.css('display', 'block');
	},

    render: function(){
    	this.$el.html(loginTemplate);
    	
    	///////////////////////////////////
    	
	    	stage = new createjs.Stage("demoCanvas");
		    //Create a Shape DisplayObject.
		    circle = new createjs.Shape();
		    circle.graphics.beginFill("red").drawCircle(0, 0, 40);
		    //Set position of Shape instance.
		    circle.x = circle.y = 50;
		    circle.alpha = 0.5;
		    //Add Shape instance to stage display list.
		    stage.addChild(circle);
		    
		    createjs.Tween.get(circle,{loop:true})
				.wait(1000) // wait for 1 second
				.to({scaleX:0.2,scaleY:0.2},1000,createjs.Ease.bounceOut) // jump to the new scale properties (default duration of 0)
				.wait(1000)
				.to({scaleX:1,scaleY:1},1000,createjs.Ease.bounceOut) // tween to scaleX/Y of 1 with ease bounce out
		    
		    //Update stage will render next frame
		    stage.update();
		
		    createjs.Ticker.addEventListener("tick", stage);
	    ////////////////////////////////////
    },
    
    auth: function() {

    	var email = this.$('.email').first().attr('value');
		var password = this.$('.password').first().attr('value');

    	var self = this;
    	var host = this.options.host;
    	
        $.ajax({
	  		type: 'POST',
	  		url: host + '/api/v1/tokens.json',
	  		data: { email: email, password: password },
	  		dataType: 'json',
	  		beforeSend: function() { $('.overlay').css('display','block'); },
	  		success: function(data){ self.gotoHome(data); },
	  		error: function(xhr, type){
	  				$('.overlay').css('display','none');
	  			    var out = '';
	  			    for (var i in xhr) {
	  			        out += i + ": " + xhr[i] + "\n";
	  			    }

	  			    alert('Error: ' + type + "\n" + out);
	  		}
        });
    },
    
    gotoHome: function(data) {
    	localStorage.setItem('playMeId', data.id);
    	localStorage.setItem('playMeNickname', data.nickname);
    	localStorage.setItem('playMeToken', data.token);
    	localStorage.setItem('playMeCredits', data.credits);
    	
    	$('.overlay').css('display','none');
    	Backbone.history.navigate('singles', { trigger: true, replace: false });
    	this.remove();
    	this.unbind();
    }

  });

  return LoginView;
  
});
