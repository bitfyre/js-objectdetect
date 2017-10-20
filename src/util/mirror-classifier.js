/**
 * Real-time object detector based on the Viola Jones Framework.
 * Compatible to OpenCV Haar Cascade Classifiers (stump based only).
 *
 * Copyright (c) 2017, Martin Tschirsich, Alex Lemanski
 */

/**
 * Horizontally mirrors a cascase classifier. Useful to detect mirrored
 * objects such as opposite hands.
 *
 * @param {Array} dst Cascade classifier
 *
 * @return {Array} Mirrored cascade classifier
 */
export default function mirrorClassifier(src, dst) {
  if (!dst) dst = new src.constructor(src);
  var windowWidth = src[0];

  for (var i = 1, iEnd = src.length - 1; i < iEnd; ) {
    ++i;
    for (var j = 0, jEnd = src[++i]; j < jEnd; ++j) {
      if (src[++i]) {
        // Simple classifier is tilted:
        for (var kEnd = i + src[++i] * 5; i < kEnd; ) {
          dst[i + 1] = windowWidth - src[i + 1];
          var width = src[i + 3];
          dst[i + 3] = src[i + 4];
          dst[i + 4] = width;
          i += 5;
        }
      } else {
        // Simple classifier is not tilted:
        for (var kEnd = i + src[++i] * 5; i < kEnd; ) {
          dst[i + 1] = windowWidth - src[i + 1] - src[i + 3];
          i += 5;
        }
      }
      i += 3;
    }
  }
  return dst;
}
