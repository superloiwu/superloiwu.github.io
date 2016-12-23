/**
 * Baked at toaster.co by Will Donohoe
 *
 */

var SnowflakeApp = function() {
  /**
   * @type {THREE.PerspectiveCamera}
   * @private
   */
  this.camera_ = null;
  
  /**
   * @type {THREE.Scene}
   * @private
   */
  this.scene_ = null;
 
  /**
   * @type {THREE.WebGLRenderer}
   * @private
   */
  this.renderer_ = null;
  
  /**
   * @type {THREE.OrbitControls}
   * @private
   */
  this.controls_ = null;
  
  /**
   * The snowflake controller, manages the 3D snowflake animation and initiation.
   * @type {Snowflake}
   * @private
   */
  this.snowflake_ = null;
  
  /**
   * Manages the cutting stage of the application, creates the 2D canvas and
   * drawing tools.
   * @type {CuttingStage}
   * @private
   */
  this.cuttingArea_ = null;
  
  /**
   * Stores the start again button that appears at the end.
   * @type {Element}
   * @private
   */
  this.startAgainButton_ = null;
  
  /**
   * Cache the initial position of the camera. It will be used to translate back
   * to the original position restarting the app.
   * @type {THREE.Vector3}
   * @private
   */
  this.cameraInitialPosition_ = new THREE.Vector3();
};

/**
 * Setup standard THREE js scene, renderer, cameras, lights and controls.
 * App bootup.
 */
SnowflakeApp.prototype.init = function() {
  this.camera_ = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 15000);
  this.camera_.position.z = 10;
  this.camera_.position.y = 5;
  
  this.cameraInitialPosition_ = this.camera_.position.clone();
  
  this.camera_.lookAt(new THREE.Vector3(0, 0, 0));
  
  this.scene_ = new THREE.Scene();
  
  this.renderer_ = new THREE.WebGLRenderer({ alpha: true });
  this.renderer_.setPixelRatio(window.devicePixelRatio);
  this.renderer_.setSize(window.innerWidth, window.innerHeight);
  this.renderer_.shadowMap.enabled = true;
  
  this.controls_ = new THREE.OrbitControls(this.camera_, this.renderer_.domElement);
  this.controls_.enableDamping = true;
  this.controls_.dampingFactor = 0.25;
  this.controls_.enabled = false;
  this.controls_.enableZoom = false;
  this.controls_.autoRotateSpeed = 0.5;
  
  
  var spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.castShadow = true;
  spotLight.position.set(-10, 3, -2);
  spotLight.castShadow = true;
  spotLight.angle = 0.3;
  spotLight.penumbra = 0.2;
  spotLight.decay = 2;
  spotLight.distance = 30;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  
  spotLight.shadow.camera.near = 0;
  spotLight.shadow.camera.far = 10;
  spotLight.shadow.camera.fov = 2;
  
  this.scene_.add( spotLight );
  
  var ambient = new THREE.AmbientLight(0xffffff,  1);
  this.scene_.add(ambient);
  this.scene_.add(spotLight.target);
  
  document.body.appendChild(this.renderer_.domElement);
  this.renderer_.domElement.classList.add('snowflake-3d');
  
  window.addEventListener('resize', this.onResize_.bind(this), false);
  
  this.startAgainButton_ = document.getElementById('js-start-again-button');
  this.startAgainButton_.addEventListener('click', this.startAgain_.bind(this), false);
  
  this.addSnowflake_();
  
  this.update_();
};


/**
 * Fired when the start again button is clicked.
 * Reset the app back to the snowflake intro animation.
 * @private
 */
SnowflakeApp.prototype.startAgain_ = function() {
  this.startAgainButton_.classList.remove('button--active');
  
  this.snowflake_.reset();
  
  // Disable the controls.
  this.controls_.enabled = false;
  this.controls_.autoRotate = false;
  
  // Animate the camera back to the initial position.
  var tl = new TimelineMax();
  tl.to(this.camera_.position, .5, {
    x: this.cameraInitialPosition_.x,
    y: this.cameraInitialPosition_.y,
    z: this.cameraInitialPosition_.z
  });
};


/**
 * Initiate the snowflake.
 * @private
 */
SnowflakeApp.prototype.addSnowflake_ = function() {
  this.snowflake_ = new Snowflake();
  this.snowflake_.init();
  
  this.snowflake_.addEventListener(Snowflake.Events.FOLDING_ANIMATION_COMPLETE,
      this.initDrawMode_.bind(this));
  
  this.scene_.add(this.snowflake_.mesh);
};


/**
 * Initiate the cutting stage.
 * @private
 */
SnowflakeApp.prototype.initDrawMode_ = function() {
  this.cuttingArea_ = new CuttingStage();
  this.cuttingArea_.init();
  
  this.cuttingArea_.addEventListener(CuttingStage.Events.COMPLETED,
      this.cuttingComplete_.bind(this), false);
};


/**
 * Fired when CuttingStage.Events.COMPLETED is sent. The segment canvas is sent
 * with the event. Create a new snowflakeTexture to create the whole texture.
 *
 * @param e
 * @private
 */
SnowflakeApp.prototype.cuttingComplete_ = function(e) {
  var snowflakeTexture = new SnowflakeTexture();
  
  // Create the snowflake texture from segment.
  var snowflakeImage = snowflakeTexture.createTexture(e.segment);
  // Send the texture to the snowflake.
  this.snowflake_.addSnowflakeTexture(snowflakeImage);
  
  // Destroy the cuttingArea, a new instance will be created if the user
  // restarts the app.
  this.cuttingArea_.destroy();
  this.cuttingArea_ = null;
  
  // After 250ms, run the unfolding animation, and re-enable the orbit controls.
  setTimeout(function() {
    this.snowflake_.unfold();
    
    this.startAgainButton_.classList.add('button--active');
    
    this.controls_.enabled = true;
    this.controls_.autoRotate = true;
    
  }.bind(this), 250);
};


/**
 * The update loop.
 * @private
 */
SnowflakeApp.prototype.update_ = function() {
  
  this.controls_.update();
  this.render_();
  requestAnimationFrame(this.update_.bind(this));
};


/**
 * When the window is resized, update THREE with new window size, along with
 * the cutting area if it exists.
 * @private
 */
SnowflakeApp.prototype.onResize_ = function() {
  
  var w = window.innerWidth;
  var h = window.innerHeight;
  
  this.camera_.aspect = w / h;
  this.camera_.updateProjectionMatrix();
  
  this.renderer_.setSize(w, h);
  
  if (this.cuttingArea_) {
    this.cuttingArea_.onResize();
  }
};


/**
 * Render the scene.
 * @private
 */
SnowflakeApp.prototype.render_ = function() {
  this.renderer_.render(this.scene_, this.camera_);
};


// DEBOUNCE METHOD

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
var debounce = function(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};


/**
 * Is the user on iOS? I'm not a fan of user agent sniffing, but sometimes it's
 * necessary.
 * @return {Boolean}
 */
var isIOS = function() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};




// SNOWFLAKE

/**
 * Manages the 3D snowflake, along with the folding and unfolding animations.
 *
 * @constructor
 */
var Snowflake = function() {
  /**
   * The snowflake mesh.
   * @type {THREE.Mesh}
   */
  this.mesh = null;
  
  /**
   * Store the current index in the morph targets array.
   * @type {number}
   * @private
   */
  this.animationStage_ = 0;
  
  /**
   * The TimelineMax instance for the main folding and unfolding animation.
   * @type {TimelineMax}
   * @private
   */
  this.animationTimeline_ = null;
  
  /**
   * Store the initial paper texture, to re-apply if the user resets.
   * @type {THREE.Texture}
   * @private
   */
  this.initialTexture_ = null;
};

// Extend the THREE.EventDispatcher prototype, to allow events to be fired from
// this class.
Object.assign(Snowflake.prototype, THREE.EventDispatcher.prototype);

/**
 * Initiate the snowflake, load the geometry, create the material, and load
 * the paper texture.
 */
Snowflake.prototype.init = function() {
  
  var textureLoader = new THREE.TextureLoader();
  textureLoader.crossOrigin = 'anonymous';
  
  var material = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
    morphTargets: true,
    morphNormals: true,
    transparent: true,
    alphaTest: 0.5,
    color: 0xffffff
  });
  
  if (!isIOS()) {
    // Load the paper texture, once loaded, apply it to the material.
    textureLoader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/934290/paper-tex2.png', function(texture) {
      material.map = texture;
      material.needsUpdate = true;
      
      // Store for later use.
      this.initialTexture_ = texture;
    }.bind(this));
  }
  
  // Instantiate a loader
  var loader = new THREE.JSONLoader();
  var model = loader.parse(Snowflake.data);
  model.geometry.computeMorphNormals();
  
  // Create the mesh from the loaded geometry and material.
  this.mesh = new THREE.Mesh(model.geometry, material);
  this.mesh.castShadow = true;
  this.mesh.receiveShadow = true;
  
  this.mesh.position.set(0, -7, -1.2);
  this.mesh.rotation.set(
      THREE.Math.degToRad(-5.7),
      THREE.Math.degToRad(-45.8),
      0
  );
  
  // Wait for 2 seconds and start the folding animation.
  setTimeout(function() {
    this.playFoldingUpAnimation_();
  }.bind(this), 2000);
};


/**
 * Create the unfolding animation timeline.
 */
Snowflake.prototype.unfold = function() {
  // Get the morph target animation.
  this.animationTimeline_ = this.createTimeline_(-1);
  
  // Get the amount of time it takes to complete the morph targets animation.
  var time = this.animationTimeline_.totalDuration();
  
  // Set position and rotation animations based off the computed time.
  this.animationTimeline_.to(this.mesh.position, time, {
    x: -0.7,
    y: 1.2,
    z: 0,
    ease: Power2.easeInOut
  }, 0);

  this.animationTimeline_.to(this.mesh.rotation, time, {
    x: THREE.Math.degToRad(67),
    y: THREE.Math.degToRad(166),
    z: THREE.Math.degToRad(-358),
    ease: Power2.easeInOut
  }, 0.5);
};


/**
 * Create and play the folding animation.
 * @private
 */
Snowflake.prototype.playFoldingUpAnimation_ = function() {
  // Create the morph targets animation.
  this.animationTimeline_ = this.createTimeline_(1, this.onFoldingAnimationComplete_.bind(this));
  
  // Get the amount of time it takes to animate the morph targets.
  var time = this.animationTimeline_.totalDuration();
  
  // Add position and rotation of the mesh to the timeline, based off the
  // computed time.
  this.animationTimeline_.to(this.mesh.position, 0.5, {
    x: 0,
    y: -1,
    z: 0.8,
    ease: Power2.easeInOut
  }, 0);
  
  this.animationTimeline_.to(this.mesh.rotation, time - 0.5, {
    x: THREE.Math.degToRad(-90),
    y: THREE.Math.degToRad(-40),
    z: THREE.Math.degToRad(22.9),
    ease: Power2.easeInOut
  }, 0.3);
  
  this.animationTimeline_.to(this.mesh.position, time - 0.5, {
    x: 0.04,
    y: 2.69,
    z: 5.44,
    ease: Power2.easeInOut
  }, 0.5);
};


/**
 * This method creates a timeline, which goes through the morph targets array
 * and interpolates each target between 0 and 1 to create a seamless animation.
 *
 * @param {number} direction - Use 1 for forwards (folding up), -1 for backwards (unfolding).
 * @param {Function} callback - A function to run when the morph targets animation has completed.
 * @return {TimelineMax}
 * @private
 */
Snowflake.prototype.createTimeline_ = function(direction, callback) {
  var stages = 8;
  // Set the animationStage depending on direction.
  this.animationStage_ = direction === 1 ? 0 : stages;
  
  // Get the next animation stage.
  this.getNextAnimationStage_(this.animationStage_, direction);
  
  // Create the timeline, which should run in sequence.
  var timeline = new TimelineMax({
    align: 'sequence',
    onComplete: callback
  });
  
  // The amount of time each animation takes.
  var stageDuration = 0.5;
  // The amount of time the next animation should start before the last finishes.
  var stageOverlap = 0.3;
  
  var i = 0;
  var morphTo;
  
  // Depending on the direction, queue the morphTargetInfluence animations in
  // stages.
  if (direction === 1) {
    for (i = 0; i < stages; i++) {
      morphTo = this.getNextAnimationStage_(i, direction);
      timeline.to(this.mesh.morphTargetInfluences, stageDuration, morphTo, '-=' + stageOverlap);
    }
  } else {
    for (i = stages; i > 0; i--) {
      morphTo = this.getNextAnimationStage_(i, direction);
      timeline.to(this.mesh.morphTargetInfluences, stageDuration, morphTo, '-=' + stageOverlap);
    }
  }
  
  return timeline;
};


/**
 * Create a new array with the next set of morph targets to interpolate to.
 * @param {number} stage - The animation stage.
 * @param {number} direction - The direction (-1 for backwards, 1 for forwards).
 * @return {Array}
 * @private
 */
Snowflake.prototype.getNextAnimationStage_ = function(stage, direction) {
  // Duplicate the morphTargetInfluences array.
  var morphTo = this.mesh.morphTargetInfluences.slice(0);
  // Set all morph targets to 0.
  for (var i = 0; i < morphTo.length; i++) {
    morphTo[i] = 0;
  }
  // Find the next stage and set to 1.
  var nextStage = stage + direction;
  morphTo[nextStage] = 1;
  
  return morphTo;
};


/**
 * Fired when the folding animation is complete. Dispatch an event to notify
 * the parent.
 * @private
 */
Snowflake.prototype.onFoldingAnimationComplete_ = function() {
  this.dispatchEvent({
    type: Snowflake.Events.FOLDING_ANIMATION_COMPLETE
  });
};


/**
 * Create a new texture with the generated canvas and apply it to the material.
 * @param {HTMLCanvasElement} canvas
 */
Snowflake.prototype.addSnowflakeTexture = function(canvas) {
  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  this.mesh.material.map = texture;
  this.mesh.material.needsUpdate = true;
};


/**
 * Reset the snowflake. Create a new Timeline to animate teh current snowflake
 * off-screen, reset the texture and play the folding animation again.
 */
Snowflake.prototype.reset = function() {
  var timeline = new TimelineMax({
    align: 'sequence'
  });
  
  timeline.to(this.mesh.position, 1, {
    y: -10
  });
  timeline.set(this.mesh.position, {
    x: 0,
    y: 5,
    z: 0
  });
  timeline.set(this.mesh.rotation, {
    x: 0,
    y: 0,
    z: 0
  });
  timeline.addCallback(this.resetTexture_.bind(this));
  timeline.addCallback(this.playFoldingUpAnimation_.bind(this));
};


/**
 * Set the texture to the initial paper texture that was loaded at the beginning.
 * @private
 */
Snowflake.prototype.resetTexture_ = function() {
  this.mesh.material.map = this.initialTexture_;
  this.mesh.material.needsUpdate = true;
};

/**
 * The snowflake geometry, uvs and animations were generated created in Blender.
 * The morph targets were modified slightly to milestones instead of a
 * frame-by-frame animation. This reduces the amount of data needed considerably.
 * @type {Object}
 */
Snowflake.data = {
    "metadata":{
        "type":"Geometry",
        "normals":9,
        "uvs":1,
        "generator":"io_three",
        "morphTargets":250,
        "version":3,
        "faces":12,
        "vertices":16
    },
    "name":"PlaneGeometry.502",
    "uvs":[[0.170373,1.09826,0.510954,0.500103,0.517938,1.00289,0.073923,0.746748,0.009312,0.511277,-0.087204,0.159522,0.761375,0.936097,1.10911,0.840683,0.259988,0.064257,1.01241,0.488241,0.948011,0.253553,0.851534,-0.098055,0.503382,-0.002527]],
    "normals":[0,-0,-1,0,-0,-1,0,-0,-1,-0,-0,-1,-0,-0,-1,-0,-0,-1,0,-0,-1,-0,-0,-1,0,-0,-1],
    "morphTargets":[{
        "name":"animation_000000",
        "vertices":[-1.04052,0,1.92489,-3.84915,0.015564,-0.899306,-1.04052,-0,-3.7235,-1.04052,-0,-0.899306,-2.79745,0.009736,0.158219,-2.09294,0.005832,0.866636,-2.08092,0.005765,-2.67734,-2.80927,0.009802,-1.94495,-1.04052,0,1.92489,1.78368,-0,-0.899306,-1.04052,-0,-3.7235,-1.04052,-0,-0.899306,0.725862,-0,-1.95712,0.019804,-0,-2.66318,0.004008,0,0.880361,0.73626,0,0.14811]
    },{
        "name":"animation_000020",
        "vertices":[-1.04052,0,1.92489,-1.02496,2.80861,-0.899306,-1.04052,-0,-3.7235,-1.04052,-0,-0.899306,-1.03078,1.75692,0.158219,-1.03469,1.05241,0.866636,-1.03476,1.04039,-2.67734,-1.03072,1.76873,-1.94495,-1.04052,0,1.92489,1.78368,-0,-0.899306,-1.04052,-0,-3.7235,-1.04052,-0,-0.899306,0.725862,-0,-1.95712,0.019804,-0,-2.66318,0.004008,0,0.880361,0.73626,0,0.14811]
    },{
        "name":"animation_000040",
        "vertices":[-1.04052,0,1.92489,1.78367,-0.004724,-0.899306,-1.04052,0.015564,-3.70794,-1.04052,-0,-0.899306,0.726148,-0.002955,0.158219,0.017732,-0.00177,0.866636,0.005643,0.008049,-2.66754,0.738025,0.002788,-1.93919,-1.04052,0,1.92489,1.78368,-0,-0.899306,-1.04052,0.015564,-3.70794,-1.04052,-0,-0.899306,0.725862,0.00583,-1.95129,0.019804,0.009721,-2.65346,0.004008,0,0.880361,0.73626,0,0.14811]
    },{
        "name":"animation_000060",
        "vertices":[-1.04052,0,1.92489,1.78367,-0.004724,-0.899306,-1.04052,2.80863,-0.883742,-1.04052,-0,-0.899306,0.726148,-0.002955,0.158219,0.017732,-0.00177,0.866636,0.005643,1.76648,-0.889507,0.738025,1.03691,-0.893544,-1.04052,0,1.92489,1.78368,-0,-0.899306,-1.04052,2.80863,-0.883742,-1.04052,-0,-0.899306,0.725862,1.05198,-0.893477,0.019804,1.75415,-0.889585,0.004008,0,0.880361,0.73626,0,0.14811]
    },{
        "name":"animation_000080",
        "vertices":[-1.04052,0,1.92489,1.77761,0.004499,-0.896183,-1.04052,9.5e-05,1.92489,-1.04052,-0,-0.899306,0.726148,-0.002955,0.158219,0.017732,-0.00177,0.866636,0.005643,-0.00169,0.878726,0.738025,-0.00294,0.146342,-1.04052,0,1.92489,1.77776,0.009366,-0.896172,-1.04052,9.5e-05,1.92489,-1.04052,-0,-0.899306,0.725862,3.5e-05,0.158508,0.019804,5.9e-05,0.864566,0.004008,0,0.880361,0.73626,0,0.14811]
    },{
        "name":"animation_000100",
        "vertices":[-1.04052,0,1.92489,0.682133,1.65966,-0.323971,-1.04052,9.5e-05,1.92489,-1.04052,-0,-0.899306,0.726148,-0.002955,0.158219,0.017732,-0.00177,0.866636,0.005643,-0.00169,0.878726,0.738025,-0.00294,0.146342,-1.04052,0,1.92489,0.708388,1.69021,-0.321824,-1.04052,9.5e-05,1.92489,-1.04052,-0,-0.899306,0.725862,3.5e-05,0.158508,0.019804,5.9e-05,0.864566,0.004008,0,0.880361,0.73626,0,0.14811]
    },{
        "name":"animation_000120",
        "vertices":[-1.03749,0.009238,1.91812,0.243204,0.007408,1.22895,-1.03748,0.009582,1.9178,-1.04052,-0,-0.899306,0.726148,-0.002955,0.158219,0.017732,-0.00177,0.866636,0.005643,-0.00169,0.878726,0.738025,-0.00294,0.146342,-1.03766,0.009582,1.91789,0.241797,0.007381,1.24887,-1.03749,0.009471,1.91768,-1.04052,-0,-0.899306,0.725862,3.5e-05,0.158508,0.019804,5.9e-05,0.864566,0.004008,0,0.880361,0.73626,0,0.14811]
    },{
        "name":"animation_000140",
        "vertices":[-0.481006,1.66734,0.695937,0.243204,0.007408,1.22895,-0.478381,1.7127,0.636911,-1.04052,-0,-0.899306,0.726148,-0.002955,0.158219,0.017732,-0.00177,0.866636,0.005643,-0.00169,0.878726,0.738025,-0.00294,0.146342,-0.51189,1.72963,0.653594,0.241797,0.007381,1.24887,-0.480098,1.6926,0.615886,-1.04052,-0,-0.899306,0.725862,3.5e-05,0.158508,0.019804,5.9e-05,0.864566,0.004008,0,0.880361,0.73626,0,0.14811]
    },{
        "name":"animation_000160",
        "vertices":[1.29201,0.073208,0.499518,0.243204,0.007408,1.22895,1.3241,0.104109,0.501091,-1.04052,-0,-0.899306,0.726148,-0.002955,0.158219,0.017732,-0.00177,0.866636,0.005643,-0.00169,0.878726,0.738025,-0.00294,0.146342,1.31646,0.105782,0.485952,0.241797,0.007381,1.24887,1.30659,0.086137,0.499062,-1.04052,-0,-0.899306,0.725862,3.5e-05,0.158508,0.019804,5.9e-05,0.864566,0.004008,0,0.880361,0.73626,0,0.14811]
    }],
    "faces":[40,1,3,7,0,1,2,0,0,0,40,3,4,5,1,3,4,1,1,1,40,4,3,1,3,1,0,0,0,0,40,5,0,3,4,5,1,0,0,0,40,6,3,2,6,1,7,2,2,2,40,7,3,6,2,1,6,3,3,3,40,8,14,11,5,8,1,4,4,4,40,10,11,13,7,1,9,5,5,5,40,12,11,9,10,1,11,6,6,6,40,13,11,12,9,1,10,7,7,7,40,11,14,15,1,8,12,8,8,8,40,15,9,11,12,11,1,2,2,2],
    "vertices":[-1.04052,0,1.92489,-3.86472,-0,-0.899306,-1.04052,-0,-3.7235,-1.04052,-0,-0.899306,-2.80719,0,0.158219,-2.09877,0,0.866636,-2.08668,-0,-2.67734,-2.81907,-0,-1.94495,-1.04052,0,1.92489,1.78368,-0,-0.899306,-1.04052,-0,-3.7235,-1.04052,-0,-0.899306,0.725862,-0,-1.95712,0.019804,-0,-2.66318,0.004008,0,0.880361,0.73626,0,0.14811]
};

/**
 * An enum of events that are fired from this class.
 * @enum {String}
 */
Snowflake.Events = {
  FOLDING_ANIMATION_COMPLETE: 'folding-animation-complete'
};



// SNOWFLAKE TEXTURE

/**
 * Manages the creation of the texture using a 2D canvas.
 *
 * @constructor
 */
var SnowflakeTexture = function() {
  /**
   * Store the HTML canvas element.
   * @type {HTMLCanvasElement}
   * @private
   */
  this.canvas_ = null;
};


/**
 * Create the texture.
 * @param {HTMLCanvasElement} halfSegment - Half the segment.
 * @return {HTMLCanvasElement}
 */
SnowflakeTexture.prototype.createTexture = function(halfSegment) {
  // Create a whole segment from half.
  var segment = this.createSegment_(halfSegment);
  
  this.canvas_ = document.createElement('canvas');
  var context = this.canvas_.getContext('2d');
  
  // Double the size of the canvas to make sure it has enough space.
  this.canvas_.width = segment.height * 2;
  this.canvas_.height = segment.height * 2;
  
  var numSegments = 6;
  
  context.translate((this.canvas_.width / 2) - (340 / 2), 0);
  
  // Draw all of the segments.
  for (var i = 0; i < numSegments; i++) {
    var angle = (360 / numSegments) * i;
    
    context.save();
    context.translate(segment.width / 2, segment.height);
    context.rotate(angle * Math.PI / 180);
    context.translate(-(segment.width / 2), -segment.height);
    context.drawImage(segment, 0, 2);
    context.restore();
  }
  return this.canvas_;
};


/**
 * This method takes half a segment and flips horizontally, rotates so both
 * segments are merged together seamlessly. This also deals with rotating the
 * whole segment so it's easy to loop when it comes to creating the full texture.
 * @param {HTMLCanvasElement} halfSegment Pass the html5 canvas element of the half segment.
 * @returns {HTMLCanvasElement} a canvas with a full segment.
 * @private
 */
SnowflakeTexture.prototype.createSegment_ = function(halfSegment) {
  var segmentCanvas = document.createElement('canvas');
  var segmentContext = segmentCanvas.getContext('2d');
  
  var trimmedImage = document.createElement('canvas');
  var trimmedImageCtx = trimmedImage.getContext('2d');
  
  trimmedImage.width = CuttingStage.FULLSIZE_CANVAS.width + 16;
  trimmedImage.height = CuttingStage.FULLSIZE_CANVAS.height;
  
  // Draw the half segment onto a trimming canvas, then trim the transparent pixels.
  trimmedImageCtx.drawImage(halfSegment, 0, 0, trimmedImage.width, trimmedImage.height);
  trimmedImage = this.cropImageFromCanvas_(trimmedImageCtx, trimmedImage);
  
  segmentContext.save();
  
  // Make the segment canvas double the size of the half segment, for room to double the image and rotate.
  segmentCanvas.width = trimmedImage.width * 2;
  segmentCanvas.height = trimmedImage.height * 2;
  
  // Draw half the segment to 0, 0.
  segmentContext.drawImage(trimmedImage, 0, 0);
  
  // Translate the context to the top right position of the half segment.
  segmentContext.translate(trimmedImage.width, 0);
  // Rotate the canvas enough so the other half segment will draw next to it.
  segmentContext.rotate(33.3 * Math.PI / 180);
  // Translate the canvas back.
  segmentContext.translate(-trimmedImage.width, 0);
  
  // Translate the context to the opposite side of the canvas and scale to flip horizontally.
  segmentContext.translate((trimmedImage.width * 2) - 1, 0);
  segmentContext.scale(-1, 1);
  // Draw the other side of the segment.
  segmentContext.drawImage(trimmedImage, 1, 0);
  
  segmentContext.restore();
  
  // Create a temporary canvas to store the current state of the segment,
  // used at a later stage to rotate the segment.
  var tempCanvas = document.createElement('canvas');
  var tempContext = tempCanvas.getContext('2d');
  tempCanvas.width = segmentCanvas.width;
  tempCanvas.height = segmentCanvas.height;
  tempContext.drawImage(segmentCanvas, 0, 0);
  
  // Clear the segment canvas ready for the next draw.
  segmentContext.clearRect(0, 0, segmentCanvas.width, segmentCanvas.height);
  // Rotate the canvas so the segment can be placed correctly.
  segmentContext.rotate(16.5 * Math.PI / 180);
  // Redraw the segment in the rotated position.
  segmentContext.drawImage(tempCanvas, 0, 0);
  // Trim the transparent pixels.
  segmentCanvas = this.cropImageFromCanvas_(segmentContext, segmentCanvas);
  
  return segmentCanvas;
};


/**
 * Method for trimming the transparent pixels from a canvas.
 * See http://stackoverflow.com/questions/11796554/automatically-crop-html5-canvas-to-contents
 *
 * @param {CanvasRenderingContext2D} ctx the canvas context to trim
 * @param {HTMLCanvasElement} canvas The canvas to trim.
 * @return {HTMLCanvasElement} Returns the trimmed canvas.
 * @private
 */
SnowflakeTexture.prototype.cropImageFromCanvas_ = function(ctx, canvas) {

  var w = canvas.width,
      h = canvas.height,
      pix = {x:[], y:[]},
      imageData = ctx.getImageData(0,0,canvas.width,canvas.height),
      x, y, index;
  
  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      index = (y * w + x) * 4;
      if (imageData.data[index+3] > 0) {

        pix.x.push(x);
        pix.y.push(y);

      }
    }
  }
  pix.x.sort(function(a,b){return a-b});
  pix.y.sort(function(a,b){return a-b});
  var n = pix.x.length-1;
  
  w = pix.x[n] - pix.x[0];
  h = pix.y[n] - pix.y[0];
  var cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);
  
  canvas.width = w;
  canvas.height = h;
  ctx.putImageData(cut, 0, 0);
  
  return canvas;
};




// CUTTING AREA

/**
 * Manages the cutting stage of the process. Loads in 2 2D canvases, one for
 * drawing the segment and one for displaying the marching cubes.
 *
 * @constructor
 */
var CuttingStage = function() {
  /**
   * The segment canvas, renders the paper texture with the cutouts.
   * @type {HTMLCanvasElement}
   * @private
   */
  this.segmentCanvas_ = null;
  
  /**
   * Segment context, used for making draw calls.
   * @type {CanvasRenderingContext2D}
   * @private
   */
  this.segmentContext_ = null;
  
  /**
   * The canvas element which shows the marching ants.
   * @type {HTMLCanvasElement}
   * @private
   */
  this.marchingAntsCanvas_ = null;
  
  /**
   * Marching ants context, used for making draw calls.
   * @type {CanvasRenderingContext2D}
   * @private
   */
  this.marchingAntsContext_ = null;
  
  /**
   * A bit of a hack, this is the width / height ratio of the segment canvas.
   * Used for getting precise canvas size for the segment.
   * @type {number}
   * @private
   */
  this.sizeRatio_ = 0.49333333333333335;
  
  /**
   * Flag to tell if the user is currently drawing or not. Used to choose
   * between using lineTo or moveTo.
   * @type {boolean}
   */
  this.drawing = false;
  
  /**
   * Stores the initial point from when the user starts drawing from.
   * @type {Object}
   * @private
   */
  this.startPoint_ = null;
  
  /**
   * An array of points to store the lines the user has made.
   * @type {Array}
   */
  this.lines = null;
  
  /**
   * Store the number of points in the current draw.
   * @type {number}
   * @private
   */
  this.numPoints_ = 0;
  
  /**
   * An object which stores methods that are bound to this. Makes it easy to add
   * and remove listeners.
   * @type {Object}
   * @private
   */
  this.bindings_ = null;
  
  /**
   * Store the last time the ants were drawn.
   * @type {number}
   * @private
   */
  this.lastTime_ = 0;
  
  /**
   * Store the ant offset. This is incremented in the update method to give the
   * impression of marching ants.
   * @type {number}
   * @private
   */
  this.antOffset_ = 0;
  
  /**
   * A scale factor between 0 and 1. Calculated by taking the current canvas
   * scale and the full size canvas.
   * @type {number}
   * @private
   */
  this.canvasScale_ = 1;
  
  /**
   * Cache the reference to the next button.
   * @type {Element}
   * @private
   */
  this.nextButton_ = null;
  
  /**
   * The cursor element.
   * @type {Element}
   * @private
   */
  this.cursor_ = null;
  
  /**
   * Store all of the lines arrays. This will be used to redraw all the cutouts
   * if the user resizes the window.
   * @type {Array}
   * @private
   */
  this.allLines_ = [];
};

// Extend the THREE.EventDispatcher prototype, to allow events to be fired from
// this class.
Object.assign(CuttingStage.prototype, THREE.EventDispatcher.prototype);


/**
 * Create the marching ants canvas and add it to the document body.
 * @private
 */
CuttingStage.prototype.createMarchingAntsCanvas_ = function() {
  this.marchingAntsCanvas_ = document.createElement('canvas');
  this.marchingAntsContext_ = this.marchingAntsCanvas_.getContext('2d');
  this.marchingAntsCanvas_.classList.add('ants-canvas');
  
  this.marchingAntsCanvas_.width = window.innerWidth;
  this.marchingAntsCanvas_.height = window.innerHeight;
  
  // Marching ants line config.
  this.marchingAntsContext_.setLineDash([7]);
  this.marchingAntsContext_.lineJoin = 'round';
  this.marchingAntsContext_.strokeStyle = '#000';
  this.marchingAntsContext_.lineWidth = '3';
  
  document.body.appendChild(this.marchingAntsCanvas_);
};


/**
 * Create the segment canvas, add it to the document body.
 * @private
 */
CuttingStage.prototype.createSegmentCanvas_ = function() {
  this.segmentCanvas_ = document.createElement('canvas');
  this.segmentCanvas_.classList.add('segment-canvas');
  
  this.segmentContext_ = this.segmentCanvas_.getContext('2d');
  
  document.body.appendChild(this.segmentCanvas_);
  
  // Wait for next frame to render on screen before taking measurements.
  requestAnimationFrame(function() {
    this.resize();
    
    this.loadAndRenderSegmentPaper_();
    
    // Add a class to the body to trigger a transition between the 3d and 2d
    // canvas elements.
    document.body.classList.add('cutting-mode');
    
    // After a second, run the demo animation to make the inital cut.
    setTimeout(function() {
      this.makeInitialCut_(true);
    }.bind(this), 1000);
  }.bind(this));
};


/**
 * Load the paper texture,
 * @type {Function} callback - an optional callback to notify when the paper
 * is drawn.
 * @private
 */
CuttingStage.prototype.loadAndRenderSegmentPaper_ = function(callback) {
  this.segmentContext_.save();
  this.segmentContext_.fillStyle = "#f00";
  this.segmentContext_.beginPath();
  
  if (!isIOS()) {
    var image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = function() {
      this.renderSegmentPaper_(image, callback);
    }.bind(this);
    image.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/934290/paper-tex2.png';
  } else {
    this.renderSegmentPaper_(null, callback);
  }
  
  
};

/**
 * Once image is loaded, draw and create a clipping mask so only the triangle
 * shape is rendered.
 * @param  {Image} image The image to render
 * @param  {Function} callback
 */
CuttingStage.prototype.renderSegmentPaper_ = function(image, callback) {
  
  if (image) {
    // After the image has loaded, draw the paper to the canvas
    this.segmentContext_.drawImage(image, 0, 0, this.segmentCanvas_.width, this.segmentCanvas_.height);
  } else {
    this.segmentContext_.fillStyle = '#fff';
    this.segmentContext_.fillRect(0, 0, this.segmentCanvas_.width, this.segmentCanvas_.height);
  }
  
  
  
  // Set the globalCompositeOperation so future draws will mask the paper.
  this.segmentContext_.globalCompositeOperation = 'destination-in';
  
  // The positions to make the folded paper shape.
  var positions = [{
    x: 0,
    y: 55
  }, {
    x: 127,
    y: 619
  }, {
    x: 300,
    y: 10
  }, {
    x: 122,
    y: 110
  }];
  
  // Draw the paper shape.
  this.segmentContext_.moveTo(positions[0].x * this.canvasScale_, positions[0].y * this.canvasScale_);
  //
  for (var i = 1; i < positions.length; i++) {
    this.segmentContext_.lineTo(positions[i].x * this.canvasScale_, positions[i].y * this.canvasScale_);
  }

  this.segmentContext_.closePath();
  this.segmentContext_.fill();
  
  if (callback) {
    callback.call(this);
  }
};

/**
 * Close off the path and draw finished path to the segment canvas.
 * Reset the drawing property, ready for a new draw.
 * @private
 */
CuttingStage.prototype.finishPath_ = function() {
  if (!this.startPoint_) {
    this.startPoint_ = this.lines[0];
  }
  this.marchingAntsContext_.lineTo(this.startPoint_.x, this.startPoint_.y);
  this.marchingAntsContext_.stroke();
  
  this.lines.push({
    x: this.startPoint_.x,
    y: this.startPoint_.y
  });
  
  // Convert the line positions so they're relative to the segment canvas.
  var segmentCanvasPosition = this.segmentCanvas_.getBoundingClientRect();
  var lines = this.lines.map(function(l) {
    var line = {};
    line.x = l.x - segmentCanvasPosition.left;
    line.y = l.y - segmentCanvasPosition.top;
    return line;
  });
  
  // Draw the cutout.
  this.drawCutout_(lines);
  
  this.allLines_.push(lines);
  
  // Reset the marching ants, clear, and remove listeners
  this.resetMarchingAnts_();
  
  this.drawing = false;
};

/**
 * Draw the cutout to the canvas to cutout areas of the segment.
 * @param lines
 * @private
 */
CuttingStage.prototype.drawCutout_ = function(lines) {
  // Draw to the segment canvas. globalCompositeOperation set to
  // destination-out, so these fills will delete parts of the segment.
  this.segmentContext_.globalCompositeOperation = 'destination-out';
  this.segmentContext_.beginPath();
  this.segmentContext_.moveTo(lines[0].x, lines[0].y);

  for (var i = 1; i < lines.length; i++) {
    this.segmentContext_.lineTo(lines[i].x, lines[i].y);
  }

  this.segmentContext_.fill();
};

/**
 * Reset the marching ants, clear, and remove listeners.
 * @private
 */
CuttingStage.prototype.resetMarchingAnts_ = function() {
  // Reset the marching ants, clear, and remove listeners
  this.marchingAntsContext_.clearRect(0, 0, this.marchingAntsCanvas_.width, this.marchingAntsCanvas_.height);
  this.marchingAntsCanvas_.removeEventListener('mousemove', this.bindings_.onMouseMove, false);
  this.marchingAntsCanvas_.removeEventListener('dblclick', this.bindings_.onDoubleClick, false);
  document.removeEventListener('keydown', this.bindings_.onKeyPress, false);
  
  this.drawing = false;
};


/**
 * In the folding process, the end part is to chop diagonally across the top of
 * the segment. This is done to produce the 6 sided snowflake.
 * This method makes that initial cut.
 *
 * @param {boolean} animate If truthy, an animation will be played out to show
 * the user how to cut.
 * @private
 */
CuttingStage.prototype.makeInitialCut_ = function(animate) {
  // The positions for the initial cut.
  var lines = [{
    x: 277,
    y: 123
  }, {
    x: 1,
    y: 283
  }, {
    x: -110,
    y: 10
  }, {
    x: 341,
    y: -47
  }, {
    x: 267,
    y: 136
  }];
  
  if (animate) {
    // Initiate the demo animation.
    var animation = new DemoAnimation(this, lines, this.canvasScale_);
    animation.init();
    animation.addEventListener(DemoAnimation.Events.ANIMATION_COMPLETE, this.bindings_.demoComplete, false );
  } else {
    // Just draw the cutout.
    var scaledLines = this.scaleLines_(lines);
    this.drawCutout_(scaledLines);
  }
};


/**
 * When the demo animation completes, finish the path, and add the listeners to
 * interact with the canvas.
 * @private
 */
CuttingStage.prototype.onDemoComplete_ = function() {
  this.finishPath_();
  
  document.addEventListener('mousemove', this.bindings_.updateCursor, false);
  this.marchingAntsCanvas_.addEventListener('mousedown', this.bindings_.onMouseDown, false);
};


/**
 * If the user is not drawing, set a new start point and reset drawing stats.
 * If a draw is currently active, update the draw stats with the latest mouse
 * positions.
 * @param {Event} e Mouse event object.
 * @private
 */
CuttingStage.prototype.onMouseDown_ = function(e) {
  // If the user is not drawing yet (i.e. the path has not started), set the
  // start point, set drawing to true, and add listeners to track the mouse
  // movements and key presses.
  if (!this.drawing) {
    this.startPoint_ = {
      x: e.clientX,
      y: e.clientY
    };
    
    this.drawing = true;
    this.lines = [this.startPoint_];
    this.numPoints_ = 1;
    
    this.marchingAntsCanvas_.addEventListener('mousemove', this.bindings_.onMouseMove, false);
    this.marchingAntsCanvas_.addEventListener('dblclick', this.bindings_.onDoubleClick, false);
    document.addEventListener('keydown', this.bindings_.onKeyPress, false);
    // Start the draw cycles.
    this.update();
  } else {
    // If the user is already drawing, update the line.
    this.marchingAntsContext_.lineTo(e.clientX, e.clientY);
    
    var point = {
      x: e.clientX,
      y: e.clientY
    };
    
    this.lines.push(point);
    this.numPoints_ ++;
    
    // If the click is within 10 pixels of the start point on both the x and y
    // axis, assume the user wants to close the path.
    if (Math.abs(e.clientX - this.startPoint_.x) < 10 &&
        Math.abs(e.clientY - this.startPoint_.y) < 10) {
      this.finishPath_();
    }
  }
};

/**
 * If drawing, update the latest line to the current mouse position. So the
 * marching ants line can move with the mouse.
 * @param {Event} e The mouse event object.
 * @private
 */
CuttingStage.prototype.onMouseMove_ = function(e) {
  if (this.drawing) {
    this.lines[this.numPoints_] = {
      x: e.clientX,
      y: e.clientY
    };
  }
};

/**
 * If the user double clicked, close off the path.
 * @private
 */
CuttingStage.prototype.onDoubleClick_ = function() {
  if (this.drawing) {
    this.finishPath_();
  }
};

/**
 * If the user hits the escape key, cancel the current path.
 * @param {KeyboardEvent} e
 * @private
 */
CuttingStage.prototype.onKeyPress_ = function(e) {
  if (e.keyCode === 27) { // Escape key
    this.resetMarchingAnts_();
  }
};

/**
 * Draw the marching ants for the current draw positions. Only repeat the draw
 * call if the drawing flag is set to true.
 */
CuttingStage.prototype.update = function() {
  
  if (this.drawing) {
    
    if (this.lines.length > 0) {
      
    
      var currentTime = Date.now();
      // Only update the ant offsets every 20 ms.
      if (currentTime - this.lastTime_ > 20) {
        this.antOffset_ ++;
        this.lastTime_ = currentTime;
      }
      
      this.marchingAntsContext_.clearRect(0, 0, this.marchingAntsCanvas_.width, this.marchingAntsCanvas_.height);
      
      // Draw the marching ants line.
      this.marchingAntsContext_.lineDashOffset = this.antOffset_;
      this.marchingAntsContext_.beginPath();
      this.marchingAntsContext_.moveTo(this.lines[0].x, this.lines[0].y);
      
      this.lines.forEach(function(line) {
        this.marchingAntsContext_.lineTo(line.x, line.y);
      }.bind(this));
      
      this.marchingAntsContext_.stroke();
    }
    
    // Only request another update if the user is still drawing.
    requestAnimationFrame(this.update.bind(this));
  }
  
  
};

/**
 * Fired when the user clicks on the "Next" button. Dispatch an event to notify
 * parent that this area is complete.
 * @private
 */
CuttingStage.prototype.finishCutting_ = function() {
  document.body.classList.remove('cutting-mode');
  this.dispatchEvent({
    type: CuttingStage.Events.COMPLETED,
    segment: this.segmentCanvas_
  });
};


/**
 * On mouse move, update the cursor graphic. The reason why I'm doing this with
 * JS rather than using the cursor css property, is because I wanted to use a
 * blend mode on the cursor.
 * @param {MouseEvent} e
 * @private
 */
CuttingStage.prototype.updateCursorPosition_ = function(e) {
  this.cursor_.style.transform = 'translate3d(' + e.clientX + 'px, ' + e.clientY + 'px, 0)';
};


/**
 * Resize the 2d canvas elements.
 */
CuttingStage.prototype.resize = function() {
  var height = this.segmentCanvas_.offsetHeight;
  var width = height * this.sizeRatio_;
  
  this.segmentCanvas_.style.width = width + 'px';
  this.segmentCanvas_.width = width;
  
  this.segmentCanvas_.height = height;
  
  this.canvasScale_ = this.segmentCanvas_.height / CuttingStage.FULLSIZE_CANVAS.height;
};


/**
 * When the browser is resized, resize the canvas element and re-render the
 * paper and lines.
 */
CuttingStage.prototype.onResize = debounce(function() {
  this.resize();
  this.rerender_();
}, 500);


/**
 * Re-render the paper segment, along with the initial cut and lines.
 * This method is only called if the browser is resized.
 * @private
 */
CuttingStage.prototype.rerender_ = function() {
  this.segmentContext_.clearRect(0, 0, this.segmentCanvas_.width, this.segmentCanvas_.height);
  this.segmentContext_.restore();
  this.loadAndRenderSegmentPaper_(function() {
    this.makeInitialCut_(false);
    
    this.allLines_.forEach(function(lines) {
      var scaledLines = this.scaleLines_(lines);
      this.drawCutout_(scaledLines);
    }.bind(this));
  }.bind(this));
  
};


/**
 * Scale a point's position by the scale of the canvas.
 * @param {Array} lines
 * @return {Array}
 * @private
 */
CuttingStage.prototype.scaleLines_ = function(lines) {
  return lines.map(function(line) {
    return {
      x: line.x * this.canvasScale_,
      y: line.y * this.canvasScale_
    }
  }.bind(this));
};


/**
 * Initiate the cutting stage, create the segment canvas, marching ants canvas,
 * and cache the elements that are needed at this stage.
 */
CuttingStage.prototype.init = function() {
  // Store the event listener bindings, this makes it easier to add and remove
  // listeners, while maintaining scope.
  this.bindings_ = {
    onMouseDown: this.onMouseDown_.bind(this),
    onMouseMove: this.onMouseMove_.bind(this),
    onDoubleClick: this.onDoubleClick_.bind(this),
    onKeyPress: this.onKeyPress_.bind(this),
    onNextClicked: this.finishCutting_.bind(this),
    updateCursor: this.updateCursorPosition_.bind(this),
    demoComplete: this.onDemoComplete_.bind(this)
  };
  this.createSegmentCanvas_();
  this.createMarchingAntsCanvas_();
  
  this.nextButton_ = document.getElementById('js-next-button');
  this.nextButton_.addEventListener('click', this.bindings_.onNextClicked, false);
  
  this.cursor_ = document.getElementById('cursor');
};

/**
 * Kill the cutting stage, remove listeners, nullify variables.
 */
CuttingStage.prototype.destroy = function() {
  
  this.marchingAntsContext_.clearRect(0, 0, this.marchingAntsCanvas_.width, this.marchingAntsCanvas_.height);
  this.marchingAntsCanvas_.removeEventListener('mousemove', this.bindings_.onMouseMove, false);
  this.marchingAntsCanvas_.removeEventListener('dblclick', this.bindings_.onDoubleClick, false);
  document.removeEventListener('keydown', this.bindings_.onKeyPress, false);
  
  this.segmentCanvas_.parentNode.removeChild(this.segmentCanvas_);
  this.marchingAntsCanvas_.parentNode.removeChild(this.marchingAntsCanvas_);
  
  document.removeEventListener('mousemove', this.bindings_.updateCursor, false);
  
  this.cursor_ = null;
  this.segmentCanvas_ = null;
  this.segmentContext_ = null;
  this.marchingAntsCanvas_ = null;
  this.marchingAntsContext_ = null;
  this.drawing = false;
  this.startPoint_ = null;
  this.lines = null;
  this.numPoints_ = 0;
  this.bindings_ = null;
  this.lastTime_ = 0;
  this.antOffset_ = 0;
  this.canvasScale_ = 1;
};

/**
 * An enum of events that are fired from this class.
 * @enum {String}
 */
CuttingStage.Events = {
  COMPLETED: 'cutting-stage-complete'
};

/**
 * Store the full size canvas dimensions. Used to calculate the scale.
 * @type {{width: number, height: number}}
 */
CuttingStage.FULLSIZE_CANVAS = {
  width: 305,
  height: 619
};




// DEMO ANIMATION

/**
 * Class that controls the demo animation within the cutting stage.
 *
 * @param {CuttingStage} cuttingArea - Reference to the cutting area.
 * @param {Array} points - The array of points to animate.
 * @param {number} scale - The canvas scale.
 * @constructor
 */
var DemoAnimation = function(cuttingArea, points, scale) {
  
  /**
   * Store the cutting area reference.
   * @type {CuttingStage}
   * @private
   */
  this.cuttingArea_ = cuttingArea;
  
  /**
   * The touch element.
   * @type {Element}
   * @private
   */
  this.touchMarker_ = null;
  
  /**
   * The cursor element.
   * @type {Element}
   * @private
   */
  this.cursor_ = null;
  
  /**
   * The TimelineMax timeline.
   * @type {TimelineMax}
   * @private
   */
  this.timeline_ = null;
  
  /**
   * The array of points to animate between.
   * @type {Array}
   * @private
   */
  this.points_ = points;
  
  /**
   * Store the canvas scale
   * @type {number}
   * @private
   */
  this.canvasScale_ = scale;
  
};

// Extend the THREE.EventDispatcher prototype, to allow events to be fired from
// this class.
Object.assign(DemoAnimation.prototype, THREE.EventDispatcher.prototype);

/**
 * Setup the animation.
 * @private
 */
DemoAnimation.prototype.setup_ = function() {
  this.timeline_ = new TimelineMax({
    align: 'sequence',
    onComplete: this.complete_.bind(this)
  });
  
  // Convert points relative to canvas.
  var worldPoints = this.getWorldPoints_(this.points_);
  
  // Set the properties on the CuttingStage to allow the marching ants to start.
  this.cuttingArea_.drawing = true;
  this.cuttingArea_.lines = [];
  this.cuttingArea_.update();
  
  // Setup the steps on the timeline.
  for (var i = 0; i < worldPoints.length; i++) {
    
    this.timeline_.to(this.cursor_, 0.5, {
      x: worldPoints[i].x,
      y: worldPoints[i].y
    });
    this.timeline_.set(this.touchMarker_, {
      x: worldPoints[i].x,
      y: worldPoints[i].y,
      opacity: 1,
      scale: 0
    });
    this.timeline_.to(this.touchMarker_, 0.5, {
      scale: 1,
      opacity: 0
    });
    this.timeline_.addCallback(this.simulateTouch_, null, [worldPoints[i]], this);
  }
};

/**
 * Convert the points which are relative to the canvas to world points.
 * @param {Array} points
 * @return {Array}
 * @private
 */
DemoAnimation.prototype.getWorldPoints_ = function(points) {
  var canvasRect = this.cuttingArea_.segmentCanvas_.getBoundingClientRect();
  return points.map(function(point) {
    return {
      x: canvasRect.left + (point.x * this.canvasScale_),
      y: canvasRect.top + (point.y * this.canvasScale_)
    };
  }.bind(this));
};

/**
 * Push the point to the lines array.
 * @param point
 * @private
 */
DemoAnimation.prototype.simulateTouch_ = function(point) {
  this.cuttingArea_.lines.push(point);
};

/**
 * When the demo animation completes, fire an event.
 * @private
 */
DemoAnimation.prototype.complete_ = function() {
  this.dispatchEvent({
    type: DemoAnimation.Events.ANIMATION_COMPLETE
  });
};

/**
 * Get the dom elements that are needed and run setup.
 */
DemoAnimation.prototype.init = function() {
  this.touchMarker_ = document.getElementById('touch-marker');
  this.cursor_ = document.getElementById('cursor');
  
  this.setup_();
};

/**
 * An enum of events that are fired from this class.
 * @enum {String}
 */
DemoAnimation.Events = {
  ANIMATION_COMPLETE: 'demo-animation-complete'
};



(function() {
  // Systems are go!
  var snowflake = new SnowflakeApp();
  snowflake.init();
})();