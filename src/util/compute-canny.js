/**
 * Real-time object detector based on the Viola Jones Framework.
 * Compatible to OpenCV Haar Cascade Classifiers (stump based only).
 *
 * Copyright (c) 2017, Martin Tschirsich, Alex Lemanski
 */

/**
 * Computes the gradient magnitude using a sobel filter after
 * applying gaussian smoothing (5x5 filter size). Useful for canny
 * pruning.
 *
 * @param {Array}  src      1-channel source image
 * @param {Number} srcWidth Width of the source image
 * @param {Number} srcWidth Height of the source image
 * @param {Array}  [dst]    1-channel destination image
 *
 * @return {Array} 1-channel destination image
 */
export default function computeCanny(src, srcWidth, srcHeight, dst) {
  var srcLength = srcWidth * srcHeight;
  if (!dst) dst = new src.constructor(srcLength);
  var buffer1 = dst === src ? new src.constructor(srcLength) : dst;
  var buffer2 = new src.constructor(srcLength);

  // Gaussian filter with size=5, sigma=sqrt(2) horizontal pass:
  for (var x = 2; x < srcWidth - 2; ++x) {
    var index = x;
    for (var y = 0; y < srcHeight; ++y) {
      buffer1[index] =
        0.1117 * src[index - 2] +
        0.2365 * src[index - 1] +
        0.3036 * src[index] +
        0.2365 * src[index + 1] +
        0.1117 * src[index + 2];
      index += srcWidth;
    }
  }

  // Gaussian filter with size=5, sigma=sqrt(2) vertical pass:
  for (var x = 0; x < srcWidth; ++x) {
    var index = x + srcWidth;
    for (var y = 2; y < srcHeight - 2; ++y) {
      index += srcWidth;
      buffer2[index] =
        0.1117 * buffer1[index - srcWidth - srcWidth] +
        0.2365 * buffer1[index - srcWidth] +
        0.3036 * buffer1[index] +
        0.2365 * buffer1[index + srcWidth] +
        0.1117 * buffer1[index + srcWidth + srcWidth];
    }
  }

  // Compute gradient:
  var abs = Math.abs;
  for (var x = 2; x < srcWidth - 2; ++x) {
    var index = x + srcWidth;
    for (var y = 2; y < srcHeight - 2; ++y) {
      index += srcWidth;

      dst[index] =
        abs(
          -buffer2[index - 1 - srcWidth] +
            buffer2[index + 1 - srcWidth] -
            2 * buffer2[index - 1] +
            2 * buffer2[index + 1] -
            buffer2[index - 1 + srcWidth] +
            buffer2[index + 1 + srcWidth]
        ) +
        abs(
          buffer2[index - 1 - srcWidth] +
            2 * buffer2[index - srcWidth] +
            buffer2[index + 1 - srcWidth] -
            buffer2[index - 1 + srcWidth] -
            2 * buffer2[index + srcWidth] -
            buffer2[index + 1 + srcWidth]
        );
    }
  }
  return dst;
}
