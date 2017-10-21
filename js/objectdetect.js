/**
 * Real-time object detector based on the Viola Jones Framework.
 * Compatible to OpenCV Haar Cascade Classifiers (stump based only).
 *
 * Copyright (c) 2012, Martin Tschirsich
 */
var objectdetect = (function() {
  'use strict';

  var detector = (function() {
    function detector(width, height, scaleFactor, classifier) {
    }

    detector.prototype.detect = function {
    };

    return detector;
  })();

  return {
    convertRgbaToGrayscale: convertRgbaToGrayscale,
    rescaleImage: rescaleImage,
    mirrorImage: mirrorImage,
    computeCanny: computeCanny,
    equalizeHistogram: equalizeHistogram,
    computeSat: computeSat,
    computeRsat: computeRsat,
    computeSquaredSat: computeSquaredSat,
    mirrorClassifier: mirrorClassifier,
    compileClassifier: compileClassifier,
    detect: detect,
    groupRectangles: groupRectangles,
    detector: detector
  };
})();