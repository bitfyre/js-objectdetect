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
import computeSat from './src/util/compute-sat.js';
import computeSquaredSat from './src/util/compute-squared-sat.js';
import computeRsat from './src/util/compute-rsat.js';
import equalizeHistogram from './src/util/equalize-histogram.js';
import mirrorClassifier from './src/util/mirror-classifier.js';

export default function ObjectDetector() {
  console.log(typeof convertRgbaToGrayscale);
  console.log(typeof rescaleImage);
  console.log(typeof mirrorImage);
  console.log(typeof computeCanny);
  console.log(typeof computeSat);
  console.log(typeof computeSquaredSat);
  console.log(typeof computeRsat);
  console.log(typeof equalizeHistogram);
  console.log(typeof mirrorClassifier);
  console.log('test');

  return 'test';
}
