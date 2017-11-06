/**
 * Real-time object detector based on the Viola Jones Framework.
 * Compatible to OpenCV Haar Cascade Classifiers (stump based only).
 *
 * Copyright (c) 2017, Martin Tschirsich, Alex Lemanski
 */

/**
 * Computes the rotated / tilted integral image of a 1-channel image.
 * @see computeSat()
 *
 * @param {Array}       src       1-channel source image
 * @param {Number}      srcWidth  Width of the source image
 * @param {Number}      srcHeight Height of the source image
 * @param {Uint32Array} [dst]     1-channel destination image
 *
 * @return {Uint32Array} 1-channel destination image
 */
export default function computeRsat(src, srcWidth, srcHeight, dst) {
  var dstWidth = srcWidth + 1,
    srcHeightTimesDstWidth = srcHeight * dstWidth;

  if (!dst) dst = new Uint32Array(srcWidth * srcHeight + dstWidth + srcHeight);

  for (var i = srcHeightTimesDstWidth; i >= 0; i -= dstWidth) dst[i] = 0;

  for (var i = 0; i < dstWidth; ++i) dst[i] = 0;

  var index = 0;
  for (var y = 0; y < srcHeight; ++y) {
    for (var x = 0; x < srcWidth; ++x) {
      dst[index + dstWidth + 1] = src[index - y] + dst[index];
      ++index;
    }
    dst[index + dstWidth] += dst[index];
    index++;
  }

  for (var x = srcWidth - 1; x > 0; --x) {
    var index = x + srcHeightTimesDstWidth;
    for (var y = srcHeight; y > 0; --y) {
      index -= dstWidth;
      dst[index + dstWidth] += dst[index] + dst[index + 1];
    }
  }

  return dst;
}
