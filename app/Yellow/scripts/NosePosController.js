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

  Parse.initialize("r0KuXabCgDMYoC1v62X0D5j3hyvDcEI2IDNSPRJM", "Cux3e19rL6sqTDRunw1WWJWbMAlpY1XYg3FsePFH");
  var ParseImageObject = Parse.Object.extend("image");


  var NoserPoser = {

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
    noseXOffset: 0,
    noseYOffset: 0,
    noseWidth: 38,
    noseHeight: 44,
    drawNose: false,

    nImages: 2,
    nLoadedImages: 0,

    noseImg: new Image,
    faceImg: new Image,
    
    userNewImage: new ParseImageObject(),

    init: function() {


      NoserPoser.noseImg.onload = function(){
        NoserPoser.nLoadedImages += 1;
        NoserPoser.maybeLoop();
      }
      NoserPoser.noseImg.src = '/images/nose.png';

      NoserPoser.faceImg.onload = function() {
        NoserPoser.nLoadedImages += 1;
        NoserPoser.maybeLoop();
      }

      // get an image
      navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY });

      // save the image along with device id
      function onSuccess(imageData) {
        NoserPoser.faceImg.src = "data:image/jpeg;base64," + imageData;

        var bitmap = new Parse.File("someimage.jpg", {base64: "data:image/jpeg;base64," + imageData});
        NoserPoser.userNewImage.set('bitmap', bitmap);
        NoserPoser.userNewImage.set('deviceid', device.uuid);

        NoserPoser.userNewImage.save(null, {
          success: function(userNewImage) {
            // Execute any logic that should take place after the object is saved.
            alert('New image created with objectId: ' + userNewImage.id);
          },
          error: function(image, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to create new image, with error code: ' + error.message);
          }
        });
      }

      function onFail(message) {
          alert('Failed to get picture because: ' + message);
      }


      // the proportion of width to height
      NoserPoser.RATIO = NoserPoser.WIDTH / NoserPoser.HEIGHT;
      // these will change when the screen is resized
      NoserPoser.currentWidth = NoserPoser.WIDTH;
      NoserPoser.currentHeight = NoserPoser.HEIGHT;
      // this is our canvas element
      NoserPoser.canvas = document.getElementsByTagName('canvas')[0];
      // setting this is important
      // otherwise the browser will
      // default to 320 x 200
      NoserPoser.canvas.width = NoserPoser.WIDTH;
      NoserPoser.canvas.height = NoserPoser.HEIGHT;
      // the canvas context enables us to 
      // interact with the canvas api
      NoserPoser.ctx = NoserPoser.canvas.getContext('2d');

      // listen for clicks
      window.addEventListener('click', function(e) {
          e.preventDefault();
          NoserPoser.Input.set(e);
      }, false);
      // listen for touches
      window.addEventListener('touchstart', function(e) {
          e.preventDefault();
          // the event object has an array
          // called touches, we just want
          // the first touch
          NoserPoser.Input.set(e.touches[0]);
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
      NoserPoser.resize();
    },

    maybeLoop: function() {
      if (NoserPoser.nLoadedImages == NoserPoser.nImages) {
        NoserPoser.loop();
      }
    },

    loop: function() {
      requestAnimFrame( NoserPoser.loop );

      NoserPoser.update();
      NoserPoser.render();
    },

    update: function() {
    },
   
    // this is where we draw all the entities
    render: function() {

      NoserPoser.Draw.clear();

      // draw the green bar on the bottom
      NoserPoser.Draw.rect(0,NoserPoser.HEIGHT-45,NoserPoser.WIDTH,45, 'green');

      // draw the face images, and a reference green rec on the face
      NoserPoser.ctx.drawImage(NoserPoser.faceImg, 0, 0, NoserPoser.WIDTH, NoserPoser.HEIGHT);

      NoserPoser.Draw.text('Touch the nose\'s location', 9, 60, 20, '#000');
      //NoserPoser.Draw.text(NoserPoser.noseXOffset, 70, 80, 20, '#FFF');
      //NoserPoser.Draw.text(NoserPoser.noseYOffset, 100, 80, 20, '#FFF');

      
      NoserPoser.ctx.drawImage(NoserPoser.noseImg, NoserPoser.noseXOffset-NoserPoser.noseWidth/2,NoserPoser.noseYOffset-NoserPoser.noseHeight/2,NoserPoser.noseWidth, NoserPoser.noseHeight);

    },


    resize: function() {

      NoserPoser.currentHeight = window.innerHeight;
      // resize the width in proportion
      // to the new height
      NoserPoser.currentWidth = NoserPoser.currentHeight * NoserPoser.RATIO;

      // this will create some extra space on the
      // page, allowing us to scroll past
      // the address bar, thus hiding it.
      if (NoserPoser.android || NoserPoser.ios) {
        //document.body.style.height = (window.innerHeight + 50) + 'px';
      }

      // set the new canvas style width and height
      // note: our canvas is still 320 x 480, but
      // we're essentially scaling it with CSS
      NoserPoser.canvas.style.width = NoserPoser.currentWidth + 'px';
      NoserPoser.canvas.style.height = NoserPoser.currentHeight + 'px';
      
      // the amount by which the css resized canvas
      // is different to the actual (480x320) size.
      NoserPoser.scale = NoserPoser.currentWidth / NoserPoser.WIDTH;
      // position of canvas in relation to
      // the screen
      NoserPoser.offset.top = NoserPoser.canvas.offsetTop;
      NoserPoser.offset.left = NoserPoser.canvas.offsetLeft;


      // we use a timeout here because some mobile
      // browsers don't fire if there is not
      // a short delay
      window.setTimeout(function() {
        window.scrollTo(0,1);
      }, 1);
    }
  };

	window.addEventListener('load', NoserPoser.init, false);
	window.addEventListener('resize', NoserPoser.resize, false);

	// we need to sniff out Android and iOS
	// so that we can hide the address bar in
	// our resize function
	NoserPoser.ua = navigator.userAgent.toLowerCase();
	NoserPoser.android = NoserPoser.ua.indexOf('android') > -1 ? true : false;
	NoserPoser.ios = ( NoserPoser.ua.indexOf('iphone') > -1 || NoserPoser.ua.indexOf('ipad') > -1  ) ? 
	    true : false;

  	// abstracts various canvas operations
	NoserPoser.Draw = {

    clear: function() {
      NoserPoser.ctx.clearRect(0, 0, NoserPoser.WIDTH, NoserPoser.HEIGHT);
    },

    rect: function(x, y, w, h, col) {
      NoserPoser.ctx.fillStyle = col;
      NoserPoser.ctx.fillRect(x, y, w, h);
    },

    circle: function(x, y, r, col) {
      NoserPoser.ctx.fillStyle = col;
      NoserPoser.ctx.beginPath();
      NoserPoser.ctx.arc(x + 5, y + 5, r, 0,  Math.PI * 2, true);
      NoserPoser.ctx.closePath();
      NoserPoser.ctx.fill();
    },

    text: function(string, x, y, size, col) {
      NoserPoser.ctx.font = 'bold '+size+'px Monospace';
      NoserPoser.ctx.fillStyle = col;
      NoserPoser.ctx.fillText(string, x, y);
    }
	};



  NoserPoser.Input = {

    x: 0,
    y: 0,

    set: function(data) {
        this.x = (data.pageX - NoserPoser.offset.left) / NoserPoser.scale;
        this.y = (data.pageY - NoserPoser.offset.top) / NoserPoser.scale;




        NoserPoser.noseXOffset = this.x;
        NoserPoser.noseYOffset = this.y;

        //NoserPoser.drawNose = true;
        
        NoserPoser.render();

        var confirmPos=confirm("Is this the right nose position?");

        if(confirmPos){
          alert("Nose pos "+this.x+" "+this.y);
        }

        
      }
  };
//steroids.view.setBackgroundImage("/img/space-background.png");

  });
