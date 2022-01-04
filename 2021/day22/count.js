const fs = require('fs');

function parseFile(file) {
  return file.split('\n').map((line) => (
    line.split(' ').map((instructions) => {
      if (['on', 'off'].includes(instructions)) {
        return instructions;
      }
      return instructions.split(',').map((coord) => {
        const range = coord.split('=')[1];
        return range.split('..').map((bounds) => parseInt(bounds, 10));
      })
    })
  ));
}

function intersection(array1, array2) {
  // [10, 12], [11, 14]
  // or
  // [10, 12], [14, 17]
  // intersection would be [11, 12] or []

  const minimum = Math.max(array1[0], array2[0]) // 11 or 14
  const maximum = Math.min(array1[1], array2[1]) // 12 or 12
  if (minimum > maximum) return []; // no intersection
  return [minimum, maximum];
}

function findIntersections(ranges, cubesToIntersectWith) {
  let volumeOfIntersection = 0;
  cubesToIntersectWith.forEach((cube, index) => {
    const [_, cubeRanges] = cube;
    const [xrange, yrange, zrange] = ranges;
    const [cubeXRange, cubeYRange, cubeZRange] = cubeRanges;
    const [xmin, xmax] = intersection(xrange, cubeXRange);
    const [ymin, ymax] = intersection(yrange, cubeYRange);
    const [zmin, zmax] = intersection(zrange, cubeZRange);
    if (xmin && ymin && zmin) {
      // we have an intersection
      const newRanges = [[xmin, xmax], [ymin, ymax], [zmin, zmax]];
      const volumeToAdd = (xmax - xmin + 1) * (ymax - ymin + 1) * (zmax - zmin + 1);
      // find where the overlap also overlaps with other cubes, again slice so we don't double count
      const moreIntersectionsWithOtherCubes = findIntersections(newRanges, cubesToIntersectWith.slice(index + 1));
      volumeOfIntersection += volumeToAdd - moreIntersectionsWithOtherCubes;
    }
  });
  return volumeOfIntersection;
}

function reboot(input, part2) {
  // [[ 'on', [ [ 10, 12 ], [ 10, 12 ], [ 10, 12 ] ] ], ...]
  const instructions = parseFile(input);
  let totalVolume = 0;
  instructions.forEach((instruction, index) => {
    const [state, ranges] = instruction;
    const [xrange, yrange, zrange] = ranges;
    const [xmin, xmax] = xrange;
    const [ymin, ymax] = yrange;
    const [zmin, zmax] = zrange;
    if (state === 'on') {
      if (part2 || (xmin >= -50 && ymin >= -50 && zmin >= -50 && xmax <= 50 && ymax <= 50 && zmax <= 50)) {
       const volumeToAdd = (xmax - xmin + 1) * (ymax - ymin + 1) * (zmax - zmin + 1);
       // do a 'positive' lookahead, which cubes does this cube intersect with, slice so we don't double count
       const intersectionWithOtherCubes = findIntersections(ranges, instructions.slice(index + 1));
       totalVolume += volumeToAdd - intersectionWithOtherCubes;
      }
    }
  });
  return totalVolume;
}

console.log('------ TESTING PART 1------');
console.log(reboot(fs.readFileSync('./example1.txt').toString(), false));
console.log(reboot(fs.readFileSync('./example2.txt').toString(), false));
console.log('------------');

console.log('------ REAL ------');
console.log(reboot(fs.readFileSync('./data.txt').toString(), false));
console.log('------------');

console.log('------ ANOTHER TEST PART 1 ------');
console.log(reboot(fs.readFileSync('./example3.txt').toString(), false));
console.log('------------');

console.log('------ TESTING PART 2 ------');
console.log(reboot(fs.readFileSync('./example3.txt').toString(), true));
console.log('------------');

console.log('------ REAL ------');
console.log(reboot(fs.readFileSync('./data.txt').toString(), true));
console.log('------------');
