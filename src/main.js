/**
 * Real-time object detector based on the Viola Jones Framework.
 * Compatible to OpenCV Haar Cascade Classifiers (stump based only).
 *
 * Copyright (c) 2017, Alex Lemanski
 */

import convertRgbaToGrayscale from './util/convert-rgba-to-grayscale.js';
import rescaleImage from './util/rescale-image.js';
import mirrorImage from './util/mirror-image.js';
import computeCanny from './util/compute-canny.js';
import computeSat from './util/compute-sat.js';
import computeSquaredSat from './util/compute-squared-sat.js';
import computeRsat from './util/compute-rsat.js';
import equalizeHistogram from './util/equalize-histogram.js';
import mirrorClassifier from './util/mirror-classifier.js';
import compileClassifier from './util/compile-classifier.js';
import detect from './util/detect.js';
import groupRectangles from './util/group-rectangles.js';

/**
 * Creates a new detector - basically a convenient wrapper class around
 * the js-objectdetect functions and hides away the technical details
 * of multi-scale object detection on image, video or canvas elements.
 *
 * @param width       Width of the detector
 * @param height      Height of the detector
 * @param scaleFactor Scaling factor for multi-scale detection
 * @param classifier  Compiled cascade classifier
 */
class ObjectDetect {
  constructor(width, height, scaleFactor, classifier) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext('2d');
    this.tilted = classifier.tilted;
    this.scaleFactor = scaleFactor;
    this.numScales = ~~(
      Math.log(Math.min(width / classifier[0], height / classifier[1])) /
      Math.log(scaleFactor)
    );
    this.scaledGray = new Uint32Array(width * height);
    this.compiledClassifiers = [];
    var scale = 1;
    for (var i = 0; i < this.numScales; ++i) {
      var scaledWidth = ~~(width / scale);
      this.compiledClassifiers[i] = compileClassifier(classifier, scaledWidth);
      scale *= scaleFactor;
    }
  }
  /**
   * Multi-scale object detection on image, video or canvas elements.
   *
   * @param image          HTML image, video or canvas element
   * @param [group]        Detection results will be grouped by proximity
   * @param [stepSize]     Increase for performance
   * @param [roi]          Region of interest, i.e. search window
   *
   * @return Grouped rectangles
   */
  detect(image, group, stepSize, roi, canny) {
    if (stepSize === undefined) stepSize = 1;
    if (group === undefined) group = 1;

    var width = this.canvas.width;
    var height = this.canvas.height;

    var ratio = Math.max(roi[2] / width, roi[3] / height);

    if (roi)
      this.context.drawImage(
        image,
        roi[0],
        roi[1],
        roi[2],
        roi[3],
        (width - roi[2] / ratio) / 2,
        (height - roi[3] / ratio) / 2,
        roi[2] / ratio,
        roi[3] / ratio
      );
    else this.context.drawImage(image, 0, 0, width, height);
    var imageData = this.context.getImageData(0, 0, width, height).data;
    this.gray = convertRgbaToGrayscale(imageData, this.gray);

    var rects = [];
    var scale = 1;
    for (var i = 0; i < this.numScales; ++i) {
      var scaledWidth = ~~(width / scale);
      var scaledHeight = ~~(height / scale);

      if (scale === 1) {
        this.scaledGray.set(this.gray);
      } else {
        this.scaledGray = rescaleImage(
          this.gray,
          width,
          height,
          scale,
          this.scaledGray
        );
      }

      if (canny) {
        this.canny = computeCanny(
          this.scaledGray,
          scaledWidth,
          scaledHeight,
          this.canny
        );
        this.cannySat = computeSat(
          this.canny,
          scaledWidth,
          scaledHeight,
          this.cannySat
        );
      }

      this.sat = computeSat(
        this.scaledGray,
        scaledWidth,
        scaledHeight,
        this.sat
      );
      this.ssat = computeSquaredSat(
        this.scaledGray,
        scaledWidth,
        scaledHeight,
        this.ssat
      );
      if (this.tilted)
        this.rsat = computeRsat(
          this.scaledGray,
          scaledWidth,
          scaledHeight,
          this.rsat
        );

      var newRects = detect(
        this.sat,
        this.rsat,
        this.ssat,
        this.cannySat,
        scaledWidth,
        scaledHeight,
        stepSize,
        this.compiledClassifiers[i]
      );
      for (var j = newRects.length - 1; j >= 0; --j) {
        var newRect = newRects[j];
        newRect[0] *= scale;
        newRect[1] *= scale;
        newRect[2] *= scale;
        newRect[3] *= scale;
      }
      rects = rects.concat(newRects);

      scale *= this.scaleFactor;
    }
    return (group ? groupRectangles(rects, group) : rects).sort(function(
      r1,
      r2
    ) {
      return r2[4] - r1[4];
    });
  }
}

export {
  ObjectDetect,
  convertRgbaToGrayscale,
  rescaleImage,
  mirrorImage,
  computeCanny,
  computeSat,
  computeSquaredSat,
  computeRsat,
  equalizeHistogram,
  mirrorClassifier,
  compileClassifier,
  detect,
  groupRectangles
};
