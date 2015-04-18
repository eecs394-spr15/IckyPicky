angular
  .module('Yellow')
  .controller('NosePosController', function($scope, supersonic) {
    // Controller functionality here
    
// http://paulirish.com/2011/requestanimationframe-for-smart-animating
    // shim layer with setTimeout fallback
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  var NosePoser = {

    // set up some initial values
    WIDTH: 320, 
    HEIGHT:  480,
    scale:  1,
    offset: {top: 0, left: 0}, 

    // we'll set the rest of these
    // in the init function
    RATIO:  null,
    currentWidth:  null,
    currentHeight:  null,
    canvas: null,
    ctx:  null,

    // variables for the face
    faceXPos: 50,
    faceYPos: 90,
    faceHeight: 300,
    faceWidth: 200,
    noseXOffset: 0,
    noseYOffset: 0,

    faceImg: new Image;

    init: function() {


      // the proportion of width to height
      NosePoser.RATIO = NosePoser.WIDTH / NosePoser.HEIGHT;
      // these will change when the screen is resized
      NosePoser.currentWidth = NosePoser.WIDTH;
      NosePoser.currentHeight = NosePoser.HEIGHT;
      // this is our canvas element
      NosePoser.canvas = document.getElementsByTagName('canvas')[0];
      // setting this is important
      // otherwise the browser will
      // default to 320 x 200
      NosePoser.canvas.width = NosePoser.WIDTH;
      NosePoser.canvas.height = NosePoser.HEIGHT;
      // the canvas context enables us to 
      // interact with the canvas api
      NosePoser.ctx = NosePoser.canvas.getContext('2d');

      // set initial face for first level
      NosePoser.currentFaceImg = NosePoser.arisaFaceImg;
      NosePoser.currentHeartImg = NosePoser.heartFullImg;

      // load images
      NosePoser.faceImg.onload = function() {
        NosePoser.render()

        // listen for clicks
        window.addEventListener('click', function(e) {
            e.preventDefault();
            NosePoser.Input.set(e);
        }, false);

        // listen for touches
        window.addEventListener('touchstart', function(e) {
            e.preventDefault();
            // the event object has an array
            // called touches, we just want
            // the first touch
            NosePoser.Input.set(e.touches[0]);
        }, false);
        window.addEventListener('touchmove', function(e) {
            // we're not interested in this
            // but prevent default behaviour
            // so the screen doesn't scroll
            // or zoom
            e.preventDefault();
        }, false);
        window.addEventListener('touchend', function(e) {
            // as above
            e.preventDefault();
        }, false);
      }
      NosePoser.handImg.src = '/images/arisaface.png';


      

      // we're ready to resize
      NosePoser.resize();

      // it will then repeat continuously
      //NosePoser.loop();
    },

   
    // this is where we draw all the entities
    render: function() {

      NosePoser.Draw.clear();

      // draw the green bar on the bottom
      NosePoser.Draw.rect(0,NosePoser.HEIGHT-45,NosePoser.WIDTH,45, 'green');

      // draw the face images, and a reference green rec on the face
      NosePoser.ctx.drawImage(NosePoser.faceImg, NosePoser.faceXPos, NosePoser.faceYPos, NosePoser.faceWidth, NosePoser.faceHeight);
      
      }
      
    
      NosePoser.Draw.text('Touch the nose\'s location', 5, 60, 20, '#000');

    },


    resize: function() {

      NosePoser.currentHeight = window.innerHeight;
      // resize the width in proportion
      // to the new height
      NosePoser.currentWidth = NosePoser.currentHeight * NosePoser.RATIO;

      // this will create some extra space on the
      // page, allowing us to scroll past
      // the address bar, thus hiding it.
      if (NosePoser.android || NosePoser.ios) {
        //document.body.style.height = (window.innerHeight + 50) + 'px';
      }

      // set the new canvas style width and height
      // note: our canvas is still 320 x 480, but
      // we're essentially scaling it with CSS
      NosePoser.canvas.style.width = NosePoser.currentWidth + 'px';
      NosePoser.canvas.style.height = NosePoser.currentHeight + 'px';

      // we use a timeout here because some mobile
      // browsers don't fire if there is not
      // a short delay
      window.setTimeout(function() {
        window.scrollTo(0,1);
      }, 1);
    }
  };

	window.addEventListener('load', NosePoser.init, false);
	window.addEventListener('resize', NosePoser.resize, false);

	// we need to sniff out Android and iOS
	// so that we can hide the address bar in
	// our resize function
	NosePoser.ua = navigator.userAgent.toLowerCase();
	NosePoser.android = NosePoser.ua.indexOf('android') > -1 ? true : false;
	NosePoser.ios = ( NosePoser.ua.indexOf('iphone') > -1 || NosePoser.ua.indexOf('ipad') > -1  ) ? 
	    true : false;

  	// abstracts various canvas operations
	NosePoser.Draw = {

    clear: function() {
      NosePoser.ctx.clearRect(0, 0, NosePoser.WIDTH, NosePoser.HEIGHT);
    },

    rect: function(x, y, w, h, col) {
      NosePoser.ctx.fillStyle = col;
      NosePoser.ctx.fillRect(x, y, w, h);
    },

    circle: function(x, y, r, col) {
      NosePoser.ctx.fillStyle = col;
      NosePoser.ctx.beginPath();
      NosePoser.ctx.arc(x + 5, y + 5, r, 0,  Math.PI * 2, true);
      NosePoser.ctx.closePath();
      NosePoser.ctx.fill();
    },

    text: function(string, x, y, size, col) {
      NosePoser.ctx.font = 'bold '+size+'px Monospace';
      NosePoser.ctx.fillStyle = col;
      NosePoser.ctx.fillText(string, x, y);
    }
	};

  NosePoser.Input = {

    x: 0,
    y: 0,

    set: function(data) {
        this.x = (data.pageX - NosePoser.offset.left) / NosePoser.scale;
        this.y = (data.pageY - NosePoser.offset.top) / NosePoser.scale;

        NosePoser.noseXOffset = this.x - NosePoser.faceXPos;
        NosePoser.noseYOffset = this.y - NosePoser.faceYPos;

        NosePoser.Draw.text('Nose position set!', 5, 250, 20, '#000');
        NosePoser.Draw.text('X:' + NosePoser.noseXOffset.toString(), 5, 265, 20, '#000');
        NosePoser.Draw.text('Y:' + NosePoser.noseYOffset.toString(), 5, 280, 20, '#000');

    }
  };
//steroids.view.setBackgroundImage("/img/space-background.png");

  });
