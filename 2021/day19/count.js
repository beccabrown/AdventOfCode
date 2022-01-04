const fs = require('fs');

function generateSetOfJoinedCoords(arrayOfBeacons) {
  return new Set(arrayOfBeacons.map((beacon) => beacon.join()))
}

// https://stackoverflow.com/questions/16452383/how-to-get-all-24-rotations-of-a-3-dimensional-array
function all24Rotations(v) {
  const arrayOfRotations = [];
  let newVector = v;
  const roll = ([x, y, z]) => [x, z, -y];
  const turn = ([x, y, z]) => [-y, x, z];
  for (let cycle = 0; cycle < 2; cycle++) {
    for (let step = 0; step < 3; step++) { // Yield RTTT 3 times
      arrayOfRotations.push(roll(newVector));
      newVector = roll(newVector); // Yield R
      for (let i = 0; i < 3; i++) { // Yield TTT
        arrayOfRotations.push(turn(newVector));
        newVector = turn(newVector);
      }
    }
    newVector = roll(turn(roll(newVector))); // Do RTR
  }
  return arrayOfRotations;
}

function parseFile(file) {
  return file.split('\n\n').map((scanner) => (
    // slice to get rid of --- scanner 0 ----
    scanner.split('\n').slice(1).map((row) => (
      row.split(',').map((coord) => (
        parseInt(coord, 10)
      ))
    ))
  ));
}

function generateScanners(input) {
  return input.map((beaconsInAScanner, i) => (
    {
      id: i,
      beaconsInAScanner,
      // just set all positions as [0,0,0], have to find them later
      positionRelativeToScanner0: [0, 0, 0],
      distancesBetween2Points: new Set(
        // want to take 1 point, then find the euclidian distance between all other points - this will be constant, no matter the orientation
        // don't bother with square root, won't make a difference
        // coordOfABeacon is a constant point, then compare with other beacons within a scanner
        // put in a set to remove duplicates
        // flatMap so for each beacon we hold constant, we generate an array of distances, flatten it to get one array of all distances
        beaconsInAScanner.flatMap((coordOfABeacon) => (
          beaconsInAScanner.map((coordOfBeacon) => (
            coordOfBeacon.map((xyorz, index) => (
              // |x2 - x1| ^ 2
              Math.pow(Math.abs(xyorz - coordOfABeacon[index]), 2)
              // |x2 - x1| ^ 2 + |y2 - y1| ^ 2 + |z2 - z1 | ^ 2
            )).reduce((sum, v) => sum + v, 0)
            // get rid of where point1 = point2 (comparing a beacon with itself within a scanner)
          )).filter((item) => item !== 0)
        ))
      ),
    }
  ));
}

function generateIntersectionSet(setA, setB) {
  return new Set([...setA].filter((a) => setB.has(a)))
}

function generateUnionSet(setA, setB) {
  return new Set([...setA, ...setB])
}

function findBeacons(file) {
  let input = parseFile(file);
  // array of arrays of scanners within each, there're arrays of 3 - a beacon
  const scanners = generateScanners(input);
  // need to work out which scanners overlap
  const overlappingScanners = scanners.flatMap((item, i) => (
    scanners.map((item2, j) => (
      // [[[0,0], [0,1], [0,2] etc etc ... ]]
      [i, j]
    ))
    // bring up a level (flatMap), [[0,0], [0,1], [0,2] etc etc ... ], then filter out [0,0], [1,1] etc
  )).filter(([i, j]) => (i !== j)).filter(([i, j]) => (
    // there are 12C2 = 66 ways of choosing 2 numbers from 12 (order does not matter)
    // so if we have more than 65 points in the intersection of 2 sets, then we have at least 12 beacons
    // which means that the scanners overlap
    generateIntersectionSet(scanners[i].distancesBetween2Points, scanners[j].distancesBetween2Points).size >= 66
  ));

  // start with scanner 0, workout from there
  let beaconSet = generateSetOfJoinedCoords(scanners[0].beaconsInAScanner);

  // set of 1 so we've processed scanner 0 already
  const processedScanners = new Set([0]);

  while (processedScanners.size !== scanners.length) {
    // find first instance where we have scanner i and scanner j overlap and we have processed one of them
    const pairOfOverlappingScanners = overlappingScanners.find(([i, j]) => (
      processedScanners.has(i) && !processedScanners.has(j)
    ));

    let [known, overlap] = pairOfOverlappingScanners.map((indexes) => (scanners[indexes]));

    // big array
    const allRotations = overlap.beaconsInAScanner.map((beacon) => all24Rotations(beacon));

    // group each rotation of a beacon with the same rotation of another beacon, [[[1,2,3],[4,5,6],...],[[1,3,-2],[4,6,-5],...],...]
    const groupRotations = allRotations.reduce((grouped, rotationsOfBeacon) => (
      // rotationsOfBeacon is [[1,2,3],[1,3,-2],...], item is [1,2,3]
      // spread to keep items from previous loops
      rotationsOfBeacon.map((item, i) => [...(grouped[i] || []), rotationsOfBeacon[i]])
    ), []);

    const arrayOfTranslations = [];

    groupRotations.forEach((beaconsInAParticularOrientation) => (
      known.beaconsInAScanner.forEach((knownBeacon) => (
        beaconsInAParticularOrientation.forEach((beacon) => {
          const translation = beacon.map((xyorz, i) => xyorz - knownBeacon[i]);
          arrayOfTranslations.push([beaconsInAParticularOrientation.map((orientatedBeacon) => orientatedBeacon.map((xyorz, i) => xyorz - translation[i])), translation]);
        })
      ))
    ));

    const matchingTranslation = arrayOfTranslations.find(([translation]) => (
      // check we have 12 or more beacons
      generateIntersectionSet(generateSetOfJoinedCoords(translation), generateSetOfJoinedCoords(known.beaconsInAScanner)).size >= 12
    ));

    if (matchingTranslation) {
      // overwrite the overlap beacons with the transformed ones
      overlap.beaconsInAScanner = matchingTranslation[0];
      // overwrite the overlap position with the transformed one, that's where this scanner is relative to scanner 0
      const newCoords = matchingTranslation[1].map((coord) => 0 - coord);
      overlap.positionRelativeToScanner0 = newCoords;
      // union because both sets might contain the other one
      beaconSet = generateUnionSet(beaconSet, generateSetOfJoinedCoords(overlap.beaconsInAScanner));
      processedScanners.add(overlap.id);
    }
  }

  return { beaconsInAScanner: beaconSet, scanners: scanners.map(({ positionRelativeToScanner0 }) => positionRelativeToScanner0) };
};

function part1(input) {
  return findBeacons(input).beaconsInAScanner.size;
}

function part2(input) {
  // The Manhattan Distance between two points (X1, Y1) and (X2, Y2) is given by |X1 – X2| + |Y1 – Y2|.
  // scanners is an array of arrays, each inner array is a point
  const { scanners } = findBeacons(input);
  const manhattanDistances = scanners.flatMap((scanner, i) => (
    // slice so we're not duplicating (compare scanner 0 to 1 and scanner 1 to 0)
    scanners.slice(i).map((differentScanner) => (
      //                                 |X1 – X2|                     |X1 – X2| + |Y1 – Y2| + |Z1 – Z2|
      differentScanner.map((xyorz, j) => Math.abs(xyorz - scanner[j])).reduce((sum, v) => sum + v, 0)
    ))
  )); // end up with [[1234, 4321, etc]] -> [1234, 4321, etc]
  return manhattanDistances.sort((a,b) => a - b)[manhattanDistances.length - 1];
}

console.log('---TESTING---');
console.log(part1(fs.readFileSync('./example.txt').toString()));
console.log('------------');

console.log('---REAL---');
console.log(part1(fs.readFileSync('./data.txt').toString()));
console.log('------------');

console.log('---TESTING---');
console.log(part2(fs.readFileSync('./example.txt').toString()));
console.log('------------');

console.log('---REAL---');
console.log(part2(fs.readFileSync('./data.txt').toString()));
console.log('------------');
