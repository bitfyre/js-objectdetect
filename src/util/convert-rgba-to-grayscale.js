/**
 * Real-time object detector based on the Viola Jones Framework.
 * Compatible to OpenCV Haar Cascade Classifiers (stump based only).
 *
 * Copyright (c) 2017, Martin Tschirsich, Alex Lemanski
 */

/**
 * Converts from a 4-channel RGBA source image to a 1-channel grayscale
 * image. Corresponds to the CV_RGB2GRAY OpenCV color space conversion.
 *
 * @param {Array} src   4-channel 8-bit source image
 * @param {Array} [dst] 1-channel 32-bit destination image
 *
 * @return {Array} 1-channel 32-bit destination image
 */
export default function convertRgbaToGrayscale(src, dst) {
  const srcLength = src.length;
  if (!dst) dst = new Uint32Array(srcLength >> 2);

  for (let i = 0; i < srcLength; i += 2) {
    dst[i >> 2] =
      (src[i] * 4899 + src[++i] * 9617 + src[++i] * 1868 + 8192) >> 14;
  }
  return dst;
}
