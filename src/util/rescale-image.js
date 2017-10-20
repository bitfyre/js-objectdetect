/**
 * Real-time object detector based on the Viola Jones Framework.
 * Compatible to OpenCV Haar Cascade Classifiers (stump based only).
 *
 * Copyright (c) 2017, Martin Tschirsich, Alex Lemanski
 */

/**
 * Reduces the size of a given image by the given factor. Does NOT
 * perform interpolation. If interpolation is required, prefer using
 * the drawImage() method of the <canvas> element.
 *
 * @param {Array}  src       1-channel source image
 * @param {Number} srcWidth	 Width of the source image
 * @param {Number} srcHeight Height of the source image
 * @param {Number} factor    Scaling down factor (> 1.0)
 * @param {Array}  [dst]     1-channel destination image
 *
 * @return {Array} 1-channel destination image
 */

export default function rescaleImage(src, srcWidth, srcHeight, factor, dst) {
  var srcLength = srcHeight * srcWidth,
    dstWidth = ~~(srcWidth / factor),
    dstHeight = ~~(srcHeight / factor);

  if (!dst) dst = new src.constructor(dstWidth * srcHeight);

  for (var x = 0; x < dstWidth; ++x) {
    var dstIndex = x;
    for (
      var srcIndex = ~~(x * factor), srcEnd = srcIndex + srcLength;
      srcIndex < srcEnd;
      srcIndex += srcWidth
    ) {
      dst[dstIndex] = src[srcIndex];
      dstIndex += dstWidth;
    }
  }

  var dstIndex = 0;
  for (var y = 0, yEnd = dstHeight * factor; y < yEnd; y += factor) {
    for (
      var srcIndex = ~~y * dstWidth, srcEnd = srcIndex + dstWidth;
      srcIndex < srcEnd;
      ++srcIndex
    ) {
      dst[dstIndex] = dst[srcIndex];
      ++dstIndex;
    }
  }
  return dst;
}
