/**
 * Real-time object detector based on the Viola Jones Framework.
 * Compatible to OpenCV Haar Cascade Classifiers (stump based only).
 *
 * Copyright (c) 2017, Martin Tschirsich, Alex Lemanski
 */

/**
		 * Groups rectangles together using a rectilinear distance metric. For
		 * each group of related rectangles, a representative mean rectangle
		 * is returned.
		 *
		 * @param {Array}  rects        Rectangles (Arrays of 4 floats)
		 * @param {Number} minNeighbors Minimum neighbors for returned groups
		 * @param {Number} confluence	Neighbor distance threshold factor
		 * @return {Array} Mean rectangles (Arrays of 4 floats)
		 */
export default function groupRectangles(rects, minNeighbors, confluence) {
  var rectsLength = rects.length;
  if (!confluence) confluence = 0.25;

  // Partition rects into similarity classes:
  var numClasses = 0;
  var labels = new Array(rectsLength);
  for (var i = 0; i < rectsLength; ++i) {
    labels[i] = 0;
  }

  var abs = Math.abs,
    min = Math.min;
  for (var i = 0; i < rectsLength; ++i) {
    var found = false;
    for (var j = 0; j < i; ++j) {
      // Determine similarity:
      var rect1 = rects[i];
      var rect2 = rects[j];
      var delta =
        confluence * (min(rect1[2], rect2[2]) + min(rect1[3], rect2[3]));
      if (
        abs(rect1[0] - rect2[0]) <= delta &&
        abs(rect1[1] - rect2[1]) <= delta &&
        abs(rect1[0] + rect1[2] - rect2[0] - rect2[2]) <= delta &&
        abs(rect1[1] + rect1[3] - rect2[1] - rect2[3]) <= delta
      ) {
        labels[i] = labels[j];
        found = true;
        break;
      }
    }
    if (!found) {
      labels[i] = numClasses++;
    }
  }

  // Compute average rectangle (group) for each cluster:
  var groups = new Array(numClasses);

  for (var i = 0; i < numClasses; ++i) {
    groups[i] = [0, 0, 0, 0, 0];
  }

  for (var i = 0; i < rectsLength; ++i) {
    var rect = rects[i],
      group = groups[labels[i]];
    group[0] += rect[0];
    group[1] += rect[1];
    group[2] += rect[2];
    group[3] += rect[3];
    ++group[4];
  }

  for (var i = 0; i < numClasses; ++i) {
    var numNeighbors = groups[i][4];
    if (numNeighbors >= minNeighbors) {
      var group = groups[i];
      numNeighbors = 1 / numNeighbors;
      group[0] *= numNeighbors;
      group[1] *= numNeighbors;
      group[2] *= numNeighbors;
      group[3] *= numNeighbors;
    } else groups.splice(i, 1);
  }

  // Filter out small rectangles inside larger rectangles:
  var filteredGroups = [];
  for (var i = 0; i < numClasses; ++i) {
    var r1 = groups[i];

    for (var j = i + 1; j < numClasses; ++j) {
      var r2 = groups[j];

      var dx = r2[2] * confluence; // * 0.2;
      var dy = r2[3] * confluence; // * 0.2;

      // Not antisymmetric, must check both r1 > r2 and r2 > r1:
      if (
        (r1[0] >= r2[0] - dx &&
          r1[1] >= r2[1] - dy &&
          r1[0] + r1[2] <= r2[0] + r2[2] + dx &&
          r1[1] + r1[3] <= r2[1] + r2[3] + dy) ||
        (r2[0] >= r1[0] - dx &&
          r2[1] >= r1[1] - dy &&
          r2[0] + r2[2] <= r1[0] + r1[2] + dx &&
          r2[1] + r2[3] <= r1[1] + r1[3] + dy)
      ) {
        break;
      }
    }

    if (j === numClasses) {
      filteredGroups.push(r1);
    }
  }
  return filteredGroups;
}
