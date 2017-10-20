/**
 * Real-time object detector based on the Viola Jones Framework.
 * Compatible to OpenCV Haar Cascade Classifiers (stump based only).
 *
 * Copyright (c) 2012, Martin Tschirsich
 */
var objectdetect = (function() {
  'use strict';

  var /**
		 * Groups rectangles together using a rectilinear distance metric. For
		 * each group of related rectangles, a representative mean rectangle
		 * is returned.
		 *
		 * @param {Array}  rects        Rectangles (Arrays of 4 floats)
		 * @param {Number} minNeighbors Minimum neighbors for returned groups
		 * @param {Number} confluence	Neighbor distance threshold factor
		 * @return {Array} Mean rectangles (Arrays of 4 floats)
		 */
  groupRectangles = function(rects, minNeighbors, confluence) {
    var rectsLength = rects.length;
    if (!confluence) confluence = 0.25;

    // Partition rects into similarity classes:
    var numClasses = 0;
    var labels = new Array(rectsLength);
    for (var i = 0; i < rectsLength; ++i) {
      labels[i] = 0;
    }

    var abs = Math.abs,
      min = Math.min;
    for (var i = 0; i < rectsLength; ++i) {
      var found = false;
      for (var j = 0; j < i; ++j) {
        // Determine similarity:
        var rect1 = rects[i];
        var rect2 = rects[j];
        var delta =
          confluence * (min(rect1[2], rect2[2]) + min(rect1[3], rect2[3]));
        if (
          abs(rect1[0] - rect2[0]) <= delta &&
          abs(rect1[1] - rect2[1]) <= delta &&
          abs(rect1[0] + rect1[2] - rect2[0] - rect2[2]) <= delta &&
          abs(rect1[1] + rect1[3] - rect2[1] - rect2[3]) <= delta
        ) {
          labels[i] = labels[j];
          found = true;
          break;
        }
      }
      if (!found) {
        labels[i] = numClasses++;
      }
    }

    // Compute average rectangle (group) for each cluster:
    var groups = new Array(numClasses);

    for (var i = 0; i < numClasses; ++i) {
      groups[i] = [0, 0, 0, 0, 0];
    }

    for (var i = 0; i < rectsLength; ++i) {
      var rect = rects[i],
        group = groups[labels[i]];
      group[0] += rect[0];
      group[1] += rect[1];
      group[2] += rect[2];
      group[3] += rect[3];
      ++group[4];
    }

    for (var i = 0; i < numClasses; ++i) {
      var numNeighbors = groups[i][4];
      if (numNeighbors >= minNeighbors) {
        var group = groups[i];
        numNeighbors = 1 / numNeighbors;
        group[0] *= numNeighbors;
        group[1] *= numNeighbors;
        group[2] *= numNeighbors;
        group[3] *= numNeighbors;
      } else groups.splice(i, 1);
    }

    // Filter out small rectangles inside larger rectangles:
    var filteredGroups = [];
    for (var i = 0; i < numClasses; ++i) {
      var r1 = groups[i];

      for (var j = i + 1; j < numClasses; ++j) {
        var r2 = groups[j];

        var dx = r2[2] * confluence; // * 0.2;
        var dy = r2[3] * confluence; // * 0.2;

        // Not antisymmetric, must check both r1 > r2 and r2 > r1:
        if (
          (r1[0] >= r2[0] - dx &&
            r1[1] >= r2[1] - dy &&
            r1[0] + r1[2] <= r2[0] + r2[2] + dx &&
            r1[1] + r1[3] <= r2[1] + r2[3] + dy) ||
          (r2[0] >= r1[0] - dx &&
            r2[1] >= r1[1] - dy &&
            r2[0] + r2[2] <= r1[0] + r1[2] + dx &&
            r2[1] + r2[3] <= r1[1] + r1[3] + dy)
        ) {
          break;
        }
      }

      if (j === numClasses) {
        filteredGroups.push(r1);
      }
    }
    return filteredGroups;
  };

  var detector = (function() {
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
    function detector(width, height, scaleFactor, classifier) {
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
        this.compiledClassifiers[i] = objectdetect.compileClassifier(
          classifier,
          scaledWidth
        );
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
    detector.prototype.detect = function(image, group, stepSize, roi, canny) {
      if (stepSize === undefined) stepSize = 1;
      if (group === undefined) group = 1;

      var width = this.canvas.width;
      var height = this.canvas.height;

      if (roi)
        this.context.drawImage(
          image,
          roi[0],
          roi[1],
          roi[2],
          roi[3],
          0,
          0,
          width,
          height
        );
      else this.context.drawImage(image, 0, 0, width, height);
      var imageData = this.context.getImageData(0, 0, width, height).data;
      this.gray = objectdetect.convertRgbaToGrayscale(imageData, this.gray);

      var rects = [];
      var scale = 1;
      for (var i = 0; i < this.numScales; ++i) {
        var scaledWidth = ~~(width / scale);
        var scaledHeight = ~~(height / scale);

        if (scale === 1) {
          this.scaledGray.set(this.gray);
        } else {
          this.scaledGray = objectdetect.rescaleImage(
            this.gray,
            width,
            height,
            scale,
            this.scaledGray
          );
        }

        if (canny) {
          this.canny = objectdetect.computeCanny(
            this.scaledGray,
            scaledWidth,
            scaledHeight,
            this.canny
          );
          this.cannySat = objectdetect.computeSat(
            this.canny,
            scaledWidth,
            scaledHeight,
            this.cannySat
          );
        }

        this.sat = objectdetect.computeSat(
          this.scaledGray,
          scaledWidth,
          scaledHeight,
          this.sat
        );
        this.ssat = objectdetect.computeSquaredSat(
          this.scaledGray,
          scaledWidth,
          scaledHeight,
          this.ssat
        );
        if (this.tilted)
          this.rsat = objectdetect.computeRsat(
            this.scaledGray,
            scaledWidth,
            scaledHeight,
            this.rsat
          );

        var newRects = objectdetect.detect(
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
      return (group
        ? objectdetect.groupRectangles(rects, group)
        : rects
      ).sort(function(r1, r2) {
        return r2[4] - r1[4];
      });
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