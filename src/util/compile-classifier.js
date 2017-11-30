/**
 * Real-time object detector based on the Viola Jones Framework.
 * Compatible to OpenCV Haar Cascade Classifiers (stump based only).
 *
 * Copyright (c) 2017, Martin Tschirsich, Alex Lemanski
 */

/**
 * Compiles a cascade classifier to be applicable to images
 * of given dimensions. Speeds-up the actual detection process later on.
 *
 * @param {Array}        src    Cascade classifier
 * @param {Number}       width  Width of the source image
 * @param {Float32Array} [dst]  Compiled cascade classifier
 *
 * @return {Float32Array} Compiled cascade classifier
 */
export default function compileClassifier(src, width, scale, dst) {
  width += 1;
  if (!dst) dst = new Float32Array(src.length);
  var dstUint32 = new Uint32Array(dst.buffer);

  dstUint32[0] = src[0];
  dstUint32[1] = src[1];
  var dstIndex = 1;
  for (var srcIndex = 1, iEnd = src.length - 1; srcIndex < iEnd; ) {
    dst[++dstIndex] = src[++srcIndex];

    var numComplexClassifiers = (dstUint32[++dstIndex] = src[++srcIndex]);
    for (var j = 0, jEnd = numComplexClassifiers; j < jEnd; ++j) {
      var tilted = (dst[++dstIndex] = src[++srcIndex]);
      var numFeaturesTimes3 = (dstUint32[++dstIndex] = src[++srcIndex] * 3);
      if (tilted) {
        for (var kEnd = dstIndex + numFeaturesTimes3; dstIndex < kEnd; ) {
          dstUint32[++dstIndex] = src[++srcIndex] + src[++srcIndex] * width;
          dstUint32[++dstIndex] =
            src[++srcIndex] * (width + 1) +
            ((src[++srcIndex] * (width - 1)) << 16);
          dst[++dstIndex] = src[++srcIndex];
        }
      } else {
        for (var kEnd = dstIndex + numFeaturesTimes3; dstIndex < kEnd; ) {
          dstUint32[++dstIndex] = src[++srcIndex] + src[++srcIndex] * width;
          dstUint32[++dstIndex] =
            src[++srcIndex] + ((src[++srcIndex] * width) << 16);
          dst[++dstIndex] = src[++srcIndex];
        }
      }

      var inverseClassifierThreshold = 1 / src[++srcIndex];
      for (var k = 0; k < numFeaturesTimes3; ) {
        dst[dstIndex - k] *= inverseClassifierThreshold;
        k += 3;
      }

      if (inverseClassifierThreshold < 0) {
        dst[dstIndex + 2] = src[++srcIndex];
        dst[dstIndex + 1] = src[++srcIndex];
        dstIndex += 2;
      } else {
        dst[++dstIndex] = src[++srcIndex];
        dst[++dstIndex] = src[++srcIndex];
      }
    }
  }
  return dst.subarray(0, dstIndex + 1);
}
