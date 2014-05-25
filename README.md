# MultiFocus JavaScript Library

## Description

This library allows the user to produce a "click to focus" image, with a set of pictures taken at all focal length.

## Usage

```JAVASCRIPT
var myzone = document.getElementById('myzone');

var options = {
  container: myzone,                            // Container of MultiFocus widget
  width: 1024,                                  // Width of container in PX (typically width of each image)
  height: 768,                                  // Height of container in PX (typically height of each image)
  preload: true,                                // Define if the set of images should be preloaded
  speed: 100,                                   // Duration between two frames in ms
  images: [                                     // All images of the set in the right focal length order
    // ...
    {
      src: 'images/focus-01.jpg',               // Image path
      focus: [                                  // All focus rectangles for this image
        {
          x1: 0.1,                              // x1, y1 : Top left point of the sharp zone
          y1: 0.1,
          x2: 0.5,                              // x2, y2 : Bottom right point of the sharp zone
          y2: 0.5
        },
        // ...                                  // Define other sharp zone for this image
      ]
    }
    // ...
  ]
};

var multifocus = new MultiFocus(options);

multifocus.init();
```

All coordinates x1, y1, x2, y2 should be set in percentage of the width or height of the full sized image.

## Sample 

