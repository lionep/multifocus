/*
 * MultiFocus JavaScript library
 * https://github.com/lionep/multifocus
 *
 * Copyright 2014, Lionel Penaud
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
function MultiFocus (options) {

  // Default options
  this.defaultOptions = {
    width: 128,
    height: 128,
    speed: 100,
    preload: true,
    images:[]
  };

  // Set user options
  this.options = options;

  // Set default options on undefined keys
  for (var key in this.defaultOptions) {
    if (!(key in this.options)) {
      this.options[key] = this.defaultOptions[key];
    }
  }

  // Image node
  var _img = null;

  // View offset X in px
  var _x = null;

  // View offset Y in px
  var _y = null;

  // Current item index
  var _current = 0;

  // Images array
  var _images = new Array();

  // Focussing state
  var _focussing = false;

  // Predicate :
  // Return true if one of zones contains (x, y)
  function isInZone (zones, x, y) {
    if (typeof(zones) === 'undefined' || zones.length === 0) {
      return false;
    }
    for (var i in zones){
      if (x >= zones[i].x1 
        && x <= zones[i].x2
        && y >= zones[i].y1
        && y <= zones[i].y2) {
        return true;
      }
    }
    return false;
  }

  // Initialize
  this.init = function() {
    // Container node
    var c = this.options.container;

    // Set zone style
    c.style.width = this.options.width+'px';
    c.style.height = this.options.height+'px';
    c.style.overflow = 'hidden';

    // Do nothing if no image provided
    if (this.options.images.length === 0){
      return;
    }

    // Image node
    _img = document.createElement('img');
    _img.alt = '';
    _img.style.width = this.options.width + 'px';
    _img.style.height = this.options.height + 'px';
    _img.src = this.options.images[0].src;

    // Add image node to node
    c.appendChild(_img);

    // Retreive bounds of view to get offsets
    var bounds = c.getBoundingClientRect();
    _x = bounds.left;
    _y = bounds.top;

    var $this = this;

    // Preload images
    if (this.options.preload) {
      this._preload(this.options.images);  
    }

    // Listen to click events
    _img.addEventListener('click', function(e){
      // Initialize focus with click point
      $this._initFocus((e.pageX - _x) / $this.options.width, (e.pageY - _y) / $this.options.height);
    });

    // Prevent dragging image with mouse
    _img.onmousedown = function(e){
      e.preventDefault();
    };
  };

  // Initialize focus
  this._initFocus = function(x, y) {
    // Do nothing if focussing
    if (_focussing) {
      return;
    }
    _focussing = true;
    // Measure way and find the target image
    var target = null;
    for (var i in this.options.images) {
      if (isInZone(this.options.images[i].focus, x, y)) {
        target = i;
        break;
      }
    }
    
    // Do nothing if target image is current one
    if (target === _current) {
      _focussing = false;
      return;
    }
    
    // Launch focussing
    var wayback = (target < _current);
    this._focus(x, y, target, wayback);
  }

  // Focussing
  this._focus = function(x, y, target, wayback) {
    // Correct current index value if needed
    if (_current < 0 || _current >= this.options.images.length) {
      _current = Math.min(this.options.images.length-1, Math.max(0, _current));
      _focussing = false;
      return;
    }
    // Check if current image exists
    if (typeof(this.options.images[_current]) === 'undefined') {
      _focussing = false;
      return;
    }
    // Set new image source
    _img.src = this.options.images[_current].src;
    // If target reached, stop focussing
    if (_current == target) {
      _focussing = false;
      return;
    } 
    // If it does not, continue focussing
    else {
      if (wayback) {
        _current--;
      } else {
        _current++;  
      }
      
      // Go to next image after speed ms
      var $this = this;
      setTimeout(function(){
        $this._focus(x, y, target, wayback);
      }, this.options.speed);
    }
  };

  // Preload images
  this._preload = function(images) {
    for (i = 0; i < images.length; i++) {
      _images[i] = new Image()
      _images[i].src = images[i].src
    }
  }

}

