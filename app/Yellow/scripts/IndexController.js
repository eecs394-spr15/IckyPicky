angular
  .module('Yellow')
  .controller('IndexController', function($scope, supersonic) {
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

  var IckyPicky = {

    // set up some initial values
    WIDTH: 320, 
    HEIGHT:  480,
    scale:  1,
    offset: {top: 0, left: 0}, 
    hit: 0,
    score: 0,
    heart: 3,
    level: 1,
    allLevel: 3,
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
    faceRate: 1.0,
    faceHeight: 300,
    faceWidth: 200,
    faceRateFlag: 1,
    noseXOffset: 100,
    noseYOffset: 150,
    noseWidth: 15,
    noseHeight: 15,

    // varibles for the hand
    handPos: 400,
    handXOffset: 115,
    handRate: 5.0,
    fingerXOffset: 18,
    fingerYOffset: 3,
    fingerWidth: 15,
    fingerHeight: 15,

    gameIsOver: 0,
    continueGame: 0,
    endGame: 0,

    nImages: 7,
    nLoadedImages: 0,
    handImg: new Image,
    arisaFaceImg: new Image,
    jonFaceImg: new Image,
    elsieFaceImg: new Image,
    bingFaceImg: new Image,
    obamaFaceImg: new Image,
    currentFaceImg: new Image,

    heartZeroImg: new Image,
    heartOneImg: new Image,
    heartTwoImg: new Image,
    heartFullImg: new Image,
    currentHeartImg: new Image,

    flippyFingerImg: new Image,
    flippyFinger2Img: new Image,
    nFlipped: 0,

    snotBubbleImg: new Image,
    splatImg: new Image,


    init: function() {


      // the proportion of width to height
      IckyPicky.RATIO = IckyPicky.WIDTH / IckyPicky.HEIGHT;
      // these will change when the screen is resized
      IckyPicky.currentWidth = IckyPicky.WIDTH;
      IckyPicky.currentHeight = IckyPicky.HEIGHT;
      // this is our canvas element
      IckyPicky.canvas = document.getElementsByTagName('canvas')[0];
      // setting this is important
      // otherwise the browser will
      // default to 320 x 200
      IckyPicky.canvas.width = IckyPicky.WIDTH;
      IckyPicky.canvas.height = IckyPicky.HEIGHT;
      // the canvas context enables us to 
      // interact with the canvas api
      IckyPicky.ctx = IckyPicky.canvas.getContext('2d');

      // set initial face for first level
      IckyPicky.currentFaceImg = IckyPicky.arisaFaceImg;
      IckyPicky.currentHeartImg = IckyPicky.heartFullImg;

      // load images
      IckyPicky.handImg.onload = function() {
        IckyPicky.nLoadedImages += 1;
        IckyPicky.maybeLoop();
      }
      IckyPicky.handImg.src = '/images/finger.png';


      IckyPicky.arisaFaceImg.onload = function() {
        IckyPicky.nLoadedImages += 1;
        IckyPicky.maybeLoop();
      }
      IckyPicky.arisaFaceImg.src = '/images/arisaface.png';

      IckyPicky.jonFaceImg.onload = function() {
        IckyPicky.nLoadedImages += 1;
        IckyPicky.maybeLoop();
      }
      IckyPicky.jonFaceImg.src = '/images/jonface.png';

      IckyPicky.elsieFaceImg.onload = function() {
        IckyPicky.nLoadedImages += 1;
        IckyPicky.maybeLoop();
      }
      IckyPicky.elsieFaceImg.src = '/images/elsieface.png';

      IckyPicky.bingFaceImg.onload = function() {
        IckyPicky.nLoadedImages += 1;
        IckyPicky.maybeLoop();
      }
      IckyPicky.bingFaceImg.src = '/images/bingface.png';

      IckyPicky.obamaFaceImg.onload = function() {
        IckyPicky.nLoadedImages += 1;
        IckyPicky.maybeLoop();
      }
      IckyPicky.obamaFaceImg.src = '/images/obamaface.png';            

      IckyPicky.heartZeroImg.onload = function() {
        IckyPicky.nLoadedImages += 1;
        IckyPicky.maybeLoop();
      }
      IckyPicky.heartZeroImg.src = '/images/heart_zero.png';

      IckyPicky.heartOneImg.onload = function() {
        IckyPicky.nLoadedImages += 1;
        IckyPicky.maybeLoop();
      }
      IckyPicky.heartOneImg.src = '/images/heart_one.png';

      IckyPicky.heartTwoImg.onload = function() {
        IckyPicky.nLoadedImages += 1;
        IckyPicky.maybeLoop();
      }
      IckyPicky.heartTwoImg.src = '/images/heart_two.png';

      IckyPicky.heartFullImg.onload = function() {
        IckyPicky.nLoadedImages += 1;
        IckyPicky.maybeLoop();
      }
      IckyPicky.heartFullImg.src = '/images/heart_full.png';

      IckyPicky.flippyFinger2Img.onload = function() {
        IckyPicky.nLoadedImages += 1;
        IckyPicky.maybeLoop();
      }
      IckyPicky.flippyFinger2Img.src = '/images/finger_2.png';
      IckyPicky.flippyFingerImg = IckyPicky.handImg;

      IckyPicky.snotBubbleImg.onload = function() {
        IckyPicky.nLoadedImages += 1;
        IckyPicky.maybeLoop();
      }
      IckyPicky.snotBubbleImg.src = '/images/bubble.png';

      IckyPicky.splatImg.onload = function() {
        IckyPicky.nLoadedImages += 1;
        IckyPicky.maybeLoop();
      }
      IckyPicky.splatImg.src = '/images/splat.png'



      // listen for clicks
      window.addEventListener('click', function(e) {
          e.preventDefault();
          IckyPicky.Input.set(e);
      }, false);

      // listen for touches
      window.addEventListener('touchstart', function(e) {
          e.preventDefault();
          // the event object has an array
          // called touches, we just want
          // the first touch
          IckyPicky.Input.set(e.touches[0]);
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

      // we're ready to resize
      IckyPicky.resize();

      // it will then repeat continuously
      //IckyPicky.loop();
    },

    // this is where all entities will be moved
    // and checked for collisions, etc.
    update: function() {

      if ( (IckyPicky.faceXPos < -40 && !IckyPicky.hit) || (IckyPicky.faceXPos > IckyPicky.WIDTH - IckyPicky.faceWidth + 10 && !IckyPicky.hit)) {
        IckyPicky.faceRate = IckyPicky.faceRate * -1;
        IckyPicky.faceRateFlag = IckyPicky.faceRateFlag * -1;
      }
      IckyPicky.faceXPos += IckyPicky.faceRate * IckyPicky.level * 0.5;

      var nose = {
        left: IckyPicky.noseXOffset + IckyPicky.faceXPos,
        right: IckyPicky.noseXOffset + IckyPicky.faceXPos + IckyPicky.noseWidth,
        top: IckyPicky.faceYPos + IckyPicky.noseYOffset,
        bottom: IckyPicky.faceYPos + IckyPicky.noseYOffset + IckyPicky.noseHeight
      };
      
      var finger = {
        left: IckyPicky.handXOffset + IckyPicky.fingerXOffset,
        right: IckyPicky.handXOffset + IckyPicky.fingerXOffset + IckyPicky.fingerWidth,
        top: IckyPicky.handPos + IckyPicky.fingerYOffset,
        bottom: IckyPicky.handPos + IckyPicky.fingerYOffset + IckyPicky.fingerHeight
      };

      IckyPicky.hit = IckyPicky.collides(nose, finger);

      if(IckyPicky.level <= IckyPicky.allLevel) { 

        switch(IckyPicky.level) {
          case 1:
              if(IckyPicky.score == 5) {
                IckyPicky.currentFaceImg = IckyPicky.jonFaceImg;
                IckyPicky.level += 1;
              }
              break;
          case 2:
              if(IckyPicky.score == 10) {
                IckyPicky.currentFaceImg = IckyPicky.elsieFaceImg;
                IckyPicky.level += 1;
              }
              break;
          case 3:
              if(IckyPicky.score == 15) {
                IckyPicky.currentFaceImg = IckyPicky.bingFaceImg;
                IckyPicky.level += 1;
              }
              break;
          case 4:
              if(IckyPicky.score == 20) {
                IckyPicky.currentFaceImg = IckyPicky.obamaFaceImg;
                IckyPicky.level += 1;
              }
              break;
          case 5:
              if(IckyPicky.score == 25) {
                IckyPicky.level += 1;
              }
              break;
        }

    }

      if (IckyPicky.hit) {

        if(IckyPicky.nFlipped < 100) {
          IckyPicky.faceRate = 0;
          switch(IckyPicky.nFlipped % 50) {
            case 0:
                IckyPicky.handImg = IckyPicky.flippyFinger2Img;
                IckyPicky.nFlipped += 1;
                break;
            case 25:
                IckyPicky.handImg = IckyPicky.flippyFingerImg;
                IckyPicky.nFlipped += 1;
                break;
            default:
                IckyPicky.nFlipped += 1;
                break;
          }
        }
        else {
          if(IckyPicky.faceRateFlag < 0) {
            IckyPicky.faceRate = -1.0;
          }
          else {
            IckyPicky.faceRateFlag = 1;
            IckyPicky.faceRate = 1.0;
          }

          IckyPicky.handImg = IckyPicky.flippyFingerImg;
          IckyPicky.nFlipped = 0; 
          IckyPicky.handPos = 400;
          IckyPicky.hit = false;
          IckyPicky.Input.tapped = false;
          IckyPicky.score += 1;

        }

      }

      if (IckyPicky.Input.tapped && IckyPicky.handPos > -155 && !IckyPicky.hit) {
          IckyPicky.handPos -= IckyPicky.handRate;
      }

      function gameOver(index) {
        switch(index) {
          case 2:
            supersonic.ui.layers.pop();
            break;
          case 1:
            break;
        }
          
      }
      if(IckyPicky.heart == 0 && IckyPicky.continueGame == 1) {
        //window.alert("Game Over");
        /*navigator.notification.confirm(
          'Try Again?', 
          gameOver,
          'GAME OVER',
          ['Yes', 'No']);*/       
        IckyPicky.heart = 3;
        IckyPicky.score = 0;
        IckyPicky.level = 1;
        IckyPicky.handPos = 400;
        IckyPicky.Input.tapped = false;
        IckyPicky.currentFaceImg = IckyPicky.arisaFaceImg;
        IckyPicky.currentHeartImg = IckyPicky.heartFullImg;
        IckyPicky.handImg = IckyPicky.flippyFingerImg;
        if(IckyPicky.faceRateFlag < 0) {
          IckyPicky.faceRate = -1.0;
        }
        else {
          IckyPicky.faceRateFlag = 1;
          IckyPicky.faceRate = 1.0;
        }
      }

      if (IckyPicky.gameIsOver == 0 && IckyPicky.heart == 0) {
         IckyPicky.gameIsOver = 1; 
         IckyPicky.faceRate = 0;        
      }
      

      if(IckyPicky.handPos < -154) {
        IckyPicky.heart -= 1;

        switch(IckyPicky.heart) {
          case 2:
              IckyPicky.currentHeartImg = IckyPicky.heartTwoImg;
              break;
          case 1:
              IckyPicky.currentHeartImg = IckyPicky.heartOneImg;
              break;
          case 0:
              IckyPicky.currentHeartImg = IckyPicky.heartZerImg;
              break;
        }

        /*
        if (IckyPicky.nBubble < 100) {
          IckyPicky.faceRate = 0;
          switch(IckyPicky.nBubble % 50) {
            case 0:
                IckyPicky.handImg = IckyPicky.flippyFinger2Img;
                IckyPicky.nFlipped += 1;
                break;
            case 25:
                IckyPicky.handImg = IckyPicky.flippyFingerImg;
                IckyPicky.nFlipped += 1;
                break;
            default:
                IckyPicky.nFlipped += 1;
                break;          
          }
        }
        
        else {
          // face resumes moving with previous direction
          if(IckyPicky.faceRateFlag < 0) {
            IckyPicky.faceRate = -1.0;
          }
          else {
            IckyPicky.faceRateFlag = 1.0;
          }
        }

        */

        if(IckyPicky.heart != 0) {
          IckyPicky.handPos = 400;
          IckyPicky.Input.tapped = false;
        }
      } 
    },

    // this is where we draw all the entities
    render: function() {

      IckyPicky.Draw.clear();

      // draw the green bar on the bottom
      IckyPicky.Draw.rect(0,IckyPicky.HEIGHT-45,IckyPicky.WIDTH,45, 'green');

      // draw the face images, and a reference green rec on the face
      IckyPicky.ctx.drawImage(IckyPicky.currentFaceImg, IckyPicky.faceXPos, IckyPicky.faceYPos, IckyPicky.faceWidth, IckyPicky.faceHeight);

      // draw the finger images, and a reference green rec on the finger
      IckyPicky.ctx.drawImage(IckyPicky.handImg, IckyPicky.handXOffset, IckyPicky.handPos, 70, 150);

      // draw the score board
      IckyPicky.Draw.text('score:' + IckyPicky.score.toString(), 5, 25, 16, '#000');

      IckyPicky.ctx.drawImage(IckyPicky.currentHeartImg, 5, 30, 54, 17);
      //      IckyPicky.Draw.text('heart:' + IckyPicky.heart.toString(), 5, 50, 12, '#000');

      switch (IckyPicky.heart) {

        case 2:
            IckyPicky.ctx.drawImage(IckyPicky.snotBubbleImg, IckyPicky.faceXPos + IckyPicky.noseXOffset - 25, IckyPicky.faceYPos + IckyPicky.noseYOffset - 5, 50, 50);
            break;
        case 1:
            IckyPicky.ctx.drawImage(IckyPicky.snotBubbleImg, IckyPicky.faceXPos + IckyPicky.noseXOffset - 40, IckyPicky.faceYPos + IckyPicky.noseYOffset - 20, 100, 100);
            break;
        case 0:
            IckyPicky.ctx.drawImage(IckyPicky.snotBubbleImg, IckyPicky.faceXPos + IckyPicky.noseXOffset - 65, IckyPicky.faceYPos + IckyPicky.noseYOffset - 35, 150, 150);
            break;
      
      }
      
      
      switch(IckyPicky.level) {
        case 1:
            IckyPicky.Draw.text('level:' + IckyPicky.level.toString(), 5, 60, 16, '#000000');
            break;
        case 2:
            IckyPicky.Draw.text('level:' + IckyPicky.level.toString(), 5, 60, 16, '#0000FF');
            break;
        case 3:
            IckyPicky.Draw.text('level:' + IckyPicky.level.toString(), 5, 60, 16, '#00BFFF');
            break;
        case 4:
            IckyPicky.Draw.text('level:' + IckyPicky.level.toString(), 5, 60, 16, '#32CD32');
            break;
        case 5:
            IckyPicky.Draw.text('level:' + IckyPicky.level.toString(), 5, 60, 16, '#B22222');
            break;
      }
      
    
      IckyPicky.Draw.text('level:' + IckyPicky.level.toString(), 5, 60, 16, '#000');

      if(IckyPicky.gameIsOver == 1) {
         IckyPicky.ctx.drawImage(IckyPicky.splatImg, IckyPicky.faceXPos, IckyPicky.faceYPos, 200, 200);
      }

    },

    maybeLoop: function() {
      if (IckyPicky.nLoadedImages == IckyPicky.nImages) {
        IckyPicky.loop();
      }
    },

    // the game loop
    loop: function() {
      requestAnimFrame( IckyPicky.loop );

      IckyPicky.update();
      IckyPicky.render();
    },

    resize: function() {

      IckyPicky.currentHeight = window.innerHeight;
      // resize the width in proportion
      // to the new height
      IckyPicky.currentWidth = IckyPicky.currentHeight * IckyPicky.RATIO;

      // this will create some extra space on the
      // page, allowing us to scroll past
      // the address bar, thus hiding it.
      if (IckyPicky.android || IckyPicky.ios) {
        //document.body.style.height = (window.innerHeight + 50) + 'px';
      }

      // set the new canvas style width and height
      // note: our canvas is still 320 x 480, but
      // we're essentially scaling it with CSS
      IckyPicky.canvas.style.width = IckyPicky.currentWidth + 'px';
      IckyPicky.canvas.style.height = IckyPicky.currentHeight + 'px';

      // we use a timeout here because some mobile
      // browsers don't fire if there is not
      // a short delay
      window.setTimeout(function() {
        window.scrollTo(0,1);
      }, 1);
    }
  };

	window.addEventListener('load', IckyPicky.init, false);
	window.addEventListener('resize', IckyPicky.resize, false);

	// we need to sniff out Android and iOS
	// so that we can hide the address bar in
	// our resize function
	IckyPicky.ua = navigator.userAgent.toLowerCase();
	IckyPicky.android = IckyPicky.ua.indexOf('android') > -1 ? true : false;
	IckyPicky.ios = ( IckyPicky.ua.indexOf('iphone') > -1 || IckyPicky.ua.indexOf('ipad') > -1  ) ? 
	    true : false;

  	// abstracts various canvas operations
	IckyPicky.Draw = {

    clear: function() {
      IckyPicky.ctx.clearRect(0, 0, IckyPicky.WIDTH, IckyPicky.HEIGHT);
    },

    rect: function(x, y, w, h, col) {
      IckyPicky.ctx.fillStyle = col;
      IckyPicky.ctx.fillRect(x, y, w, h);
    },

    circle: function(x, y, r, col) {
      IckyPicky.ctx.fillStyle = col;
      IckyPicky.ctx.beginPath();
      IckyPicky.ctx.arc(x + 5, y + 5, r, 0,  Math.PI * 2, true);
      IckyPicky.ctx.closePath();
      IckyPicky.ctx.fill();
    },

    text: function(string, x, y, size, col) {
      IckyPicky.ctx.font = 'bold '+size+'px Monospace';
      IckyPicky.ctx.fillStyle = col;
      IckyPicky.ctx.fillText(string, x, y);
    }
	};

  IckyPicky.Input = {

    x: 0,
    y: 0,
    tapped :false,

    set: function(data) {
        this.x = (data.pageX - IckyPicky.offset.left) / IckyPicky.scale;
        this.y = (data.pageY - IckyPicky.offset.top) / IckyPicky.scale;
        this.tapped = true;
    }
  };


  IckyPicky.collides = function(r1, r2) {

          return !(r2.left > r1.right || 
            r2.right < r1.left || 
            r2.top > r1.bottom ||
            r2.bottom < r1.top);

  };
//steroids.view.setBackgroundImage("/img/space-background.png");

  });
