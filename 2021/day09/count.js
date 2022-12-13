const fs = require('fs')
const readline = require('readline');

const readInterface = readline.createInterface({
  input: fs.createReadStream('./github.txt'),
  output: process.stdout,
  console: false,
  terminal: false,
});

function findNeighbours(point, values, lines) {
  const neighbours = [];
  const [i, j] = point;
  if (i > 1)
    // not on line one, can move up
    neighbours.push([i - 1, j]);
  if (j >= 1)
    // not at beginning of line, can move left
    neighbours.push([i, j - 1]);
  if (i < lines)
    // not on last line, can move down
    neighbours.push([i + 1, j]);
  if (j < values.length - 1)
    // not at end of line, can move right
    neighbours.push([i, j + 1]);
  return neighbours;
}

function getBasinDepths(key, index, values, lineNumber, numberLines) {
  const visitedAlready = [];
  let basinSize = 0;
  const pointsToVisit = [[key, index]]; // x, y coords of bottom of basin, move out
  while (pointsToVisit.length > 0) {
    const currentPoint = pointsToVisit.pop();
    if (visitedAlready[currentPoint] === true) continue;
    visitedAlready[currentPoint] = true;
    basinSize++;
    findNeighbours(currentPoint, values, lineNumber).forEach((adj) => {
      if (numberLines.get(adj[0])[adj[1]] < 9 && visitedAlready[adj] == undefined)
        pointsToVisit.push(adj);
    });
  }
  return basinSize;
}

function reddit1(basins) {
  let lineNumber = 1;
  let numberLines = new Map();
  let lowPoints = [];
  let basinSizes = [];
  readInterface.on('line', function (line) {
    const numberLine = line.split('').map((item) => parseInt(item, 10));
    numberLines.set(lineNumber, numberLine);
    if (lineNumber === 100) {
      numberLines.forEach((values, key) => {
        // compare with previous line and lower line
        const previousLine = numberLines.get(key - 1);
        const nextLine = numberLines.get(key + 1);
        values.forEach((value, index) => {
          // have to compare with up and down values all the time, do this first
          const comparison1 = previousLine ? value < previousLine[index] : true;
          const comparison2 = nextLine ? value < nextLine[index] : true
          if (comparison1 && comparison2) {
            if (index === 0 && value < values[index + 1]) {
              // compare with right value
              // low point found
              lowPoints.push(value);
              if (basins) {
                const basinSize = getBasinDepths(key, index, values, lineNumber, numberLines);
                basinSizes.push(basinSize);
              }
            } else if (index === values.length - 1 && value < values[index - 1]) {
              // compare with left value
              // low point found
              lowPoints.push(value);
              if (basins) {
                const basinSize = getBasinDepths(key, index, values, lineNumber, numberLines);
                basinSizes.push(basinSize);
              }
            } else if (value < values[index - 1] && value < values[index + 1]) {
              // compare with left and right values
              lowPoints.push(value);
              if (basins) {
                const basinSize = getBasinDepths(key, index, values, lineNumber, numberLines);
                basinSizes.push(basinSize);
              }
            }
          }
        });
      });
      if (basins) {
        const topThreeBasinSizes = basinSizes.sort((a, b) => b - a).slice(0, 3);
        console.log(topThreeBasinSizes.reduce((partialProduct, a) => partialProduct * a, 1));
      } else {
        console.log(lowPoints.reduce((partialSum, a) => partialSum + a + 1, 0));
      }
      lineNumber = 1;
      numberLines.clear();
      lowPoints = [];
    }
    lineNumber++;
  });
};

reddit1();
reddit1(true);