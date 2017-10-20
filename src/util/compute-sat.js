/**
 * Real-time object detector based on the Viola Jones Framework.
 * Compatible to OpenCV Haar Cascade Classifiers (stump based only).
 *
 * Copyright (c) 2017, Martin Tschirsich, Alex Lemanski
 */

/**
 * Computes the integral image of a 1-channel image. Arithmetic
 * overflow may occur if the integral exceeds the limits for the
 * destination image values ([0, 2^32-1] for an unsigned 32-bit image).
 * The integral image is 1 pixel wider both in vertical and horizontal
 * dimension compared to the source image.
 *
 * SAT = Summed Area Table.
 *
 * @param {Array}       src       1-channel source image
 * @param {Number}      srcWidth  Width of the source image
 * @param {Number}      srcHeight Height of the source image
 * @param {Uint32Array} [dst]     1-channel destination image
 *
 * @return {Uint32Array} 1-channel destination image
 */
export default function computeSat(src, srcWidth, srcHeight, dst) {
  const dstWidth = srcWidth + 1;

  if (!dst) dst = new Uint32Array(srcWidth * srcHeight + dstWidth + srcHeight);

  for (let i = srcHeight * dstWidth; i >= 0; i -= dstWidth) dst[i] = 0;

  for (let x = 1; x <= srcWidth; ++x) {
    let column_sum = 0;
    let index = x;
    dst[x] = 0;

    for (let y = 1; y <= srcHeight; ++y) {
      column_sum += src[index - y];
      index += dstWidth;
      dst[index] = dst[index - 1] + column_sum;
    }
  }
  return dst;
}
