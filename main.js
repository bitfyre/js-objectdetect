/**
 * Real-time object detector based on the Viola Jones Framework.
 * Compatible to OpenCV Haar Cascade Classifiers (stump based only).
 *
 * Copyright (c) 2017, Alex Lemanski
 */

import convertRgbaToGrayscale from './src/util/convert-rgba-to-grayscale.js';
import rescaleImage from './src/util/rescale-image.js';
import mirrorImage from './src/util/mirror-image.js';
import computeCanny from './src/util/compute-canny.js';

export default function ObjectDetector() {
  console.log(typeof convertRgbaToGrayscale);
  console.log(typeof rescaleImage);
  console.log(typeof mirrorImage);
  console.log(typeof computeCanny);
  console.log('test');

  return 'test';
}
