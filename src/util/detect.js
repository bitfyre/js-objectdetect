/**
 * Real-time object detector based on the Viola Jones Framework.
 * Compatible to OpenCV Haar Cascade Classifiers (stump based only).
 *
 * Copyright (c) 2017, Martin Tschirsich, Alex Lemanski
 */

/**
 * Evaluates a compiled cascade classifier. Sliding window approach.
 *
 * @param {Uint32Array}  sat        SAT of the source image
 * @param {Uint32Array}  rsat       Rotated SAT of the source image
 * @param {Uint32Array}  ssat       Squared SAT of the source image
 * @param {Uint32Array}  [cannySat] SAT of the canny source image
 * @param {Number}       width      Width of the source image
 * @param {Number}       height     Height of the source image
 * @param {Number}       step       Stepsize, increase for performance
 * @param {Float32Array} classifier Compiled cascade classifier
 *
 * @return {Array} Rectangles representing detected objects
 */
export default function detect(
  sat,
  rsat,
  ssat,
  cannySat,
  width,
  height,
  step,
  classifier
) {
  width += 1;
  height += 1;

  var classifierUint32 = new Uint32Array(classifier.buffer),
    windowWidth = classifierUint32[0],
    windowHeight = classifierUint32[1],
    windowHeightTimesWidth = windowHeight * width,
    area = windowWidth * windowHeight,
    inverseArea = 1 / area,
    widthTimesStep = width * step,
    rects = [];

  for (var x = 0; x + windowWidth < width; x += step) {
    var satIndex = x;
    for (var y = 0; y + windowHeight < height; y += step) {
      var satIndex1 = satIndex + windowWidth,
        satIndex2 = satIndex + windowHeightTimesWidth,
        satIndex3 = satIndex2 + windowWidth,
        canny = false;

      // Canny test:
      if (cannySat) {
        var edgesDensity =
          (cannySat[satIndex] -
            cannySat[satIndex1] -
            cannySat[satIndex2] +
            cannySat[satIndex3]) *
          inverseArea;
        if (edgesDensity < 60 || edgesDensity > 200) {
          canny = true;
          satIndex += widthTimesStep;
          continue;
        }
      }

      // Normalize mean and variance of window area:
      var mean =
          sat[satIndex] - sat[satIndex1] - sat[satIndex2] + sat[satIndex3],
        variance =
          (ssat[satIndex] -
            ssat[satIndex1] -
            ssat[satIndex2] +
            ssat[satIndex3]) *
            area -
          mean * mean,
        std = variance > 1 ? Math.sqrt(variance) : 1,
        found = true;

      // Evaluate cascade classifier aka 'stages':
      for (var i = 1, iEnd = classifier.length - 1; i < iEnd; ) {
        var complexClassifierThreshold = classifier[++i];
        // Evaluate complex classifiers aka 'trees':
        var complexClassifierSum = 0;
        for (var j = 0, jEnd = classifierUint32[++i]; j < jEnd; ++j) {
          // Evaluate simple classifiers aka 'nodes':
          var simpleClassifierSum = 0;

          if (classifierUint32[++i]) {
            // Simple classifier is tilted:
            for (var kEnd = i + classifierUint32[++i]; i < kEnd; ) {
              var f1 = satIndex + classifierUint32[++i],
                packed = classifierUint32[++i],
                f2 = f1 + (packed & 0xffff),
                f3 = f1 + ((packed >> 16) & 0xffff);

              simpleClassifierSum +=
                classifier[++i] *
                (rsat[f1] - rsat[f2] - rsat[f3] + rsat[f2 + f3 - f1]);
            }
          } else {
            // Simple classifier is not tilted:
            for (var kEnd = i + classifierUint32[++i]; i < kEnd; ) {
              var f1 = satIndex + classifierUint32[++i],
                packed = classifierUint32[++i],
                f2 = f1 + (packed & 0xffff),
                f3 = f1 + ((packed >> 16) & 0xffff);

              simpleClassifierSum +=
                classifier[++i] *
                (sat[f1] - sat[f2] - sat[f3] + sat[f2 + f3 - f1]);
            }
          }
          complexClassifierSum +=
            classifier[i + (simpleClassifierSum > std ? 2 : 1)];
          i += 2;
        }
        if (complexClassifierSum < complexClassifierThreshold) {
          found = false;
          break;
        }
      }
      if (found) rects.push([x, y, windowWidth, windowHeight]);
      satIndex += widthTimesStep;
    }
  }
  return rects;
}
