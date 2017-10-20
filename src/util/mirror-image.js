/**
 * Real-time object detector based on the Viola Jones Framework.
 * Compatible to OpenCV Haar Cascade Classifiers (stump based only).
 *
 * Copyright (c) 2017, Martin Tschirsich, Alex Lemanski
 */

/**
 * Horizontally mirrors a 1-channel source image.
 *
 * @param {Array}  src       1-channel source image
 * @param {Number} srcWidth  Width of the source image
 * @param {Number} srcHeight Height of the source image
 * @param {Array} [dst]      1-channel destination image
 *
 * @return {Array} 1-channel destination image
 */
export default function mirrorImage(src, srcWidth, srcHeight, dst) {
  if (!dst) dst = new src.constructor(srcWidth * srcHeight);

  var index = 0;
  for (var y = 0; y < srcHeight; ++y) {
    for (var x = srcWidth >> 1; x >= 0; --x) {
      var swap = src[index + x];
      dst[index + x] = src[index + srcWidth - 1 - x];
      dst[index + srcWidth - 1 - x] = swap;
    }
    index += srcWidth;
  }
  return dst;
}
