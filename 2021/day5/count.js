const fs = require('fs')
const readline = require('readline');

const readInterface = readline.createInterface({
  input: fs.createReadStream('./data.txt'),
  output: process.stdout,
  console: false,
  terminal: false,
});

function reddit1(includeDiagonals) {

  function addPointToMap(point) {
    let numberOfHits = lines.get(point);
    if (!numberOfHits) {
      numberOfHits = 0;
    }
    numberOfHits += 1;
    if (numberOfHits === 2) {
      crossings += 1;
    }
    lines.set(point, numberOfHits);
  }

  let lines = new Map();
  let crossings = 0;
  let lineCount = 1;
  readInterface.on('line', function (line) {
    let splitCoords = [];
    const unsplitCoords = line.split(' -> ');
    unsplitCoords.forEach((coord) => {
      coord.split(',').forEach((xOrYCoord) => {
        splitCoords.push(parseInt(xOrYCoord));
      });
    });
    if (splitCoords[0] === splitCoords[2]) {
      // which y is the lower number
      const lowerY = splitCoords[1] < splitCoords[3] ? splitCoords[1] : splitCoords[3];
      const upperY = splitCoords[1] < splitCoords[3] ? splitCoords[3] : splitCoords[1];
      addPointToMap([splitCoords[0], lowerY].join(','));
      addPointToMap([splitCoords[0], upperY].join(','));
      for (let i = lowerY + 1; i < upperY; i++) {
        addPointToMap([splitCoords[0], i].join(','));
      }
    } else if (splitCoords[1] === splitCoords[3]) {
      // which x is the lower number
      const lowerX = splitCoords[0] < splitCoords[2] ? splitCoords[0] : splitCoords[2];
      const upperX = splitCoords[0] < splitCoords[2] ? splitCoords[2] : splitCoords[0];
      addPointToMap([lowerX, splitCoords[1]].join(','));
      addPointToMap([upperX, splitCoords[1]].join(','));
      for (let i = lowerX + 1; i < upperX; i++) {
        addPointToMap([i, splitCoords[1]].join(','));
      }
    } else if (includeDiagonals) {
      // diagonal lines here, at exactly 45 degrees, so as x ^ 1, y ^ 1 and vice versa
      // or x ^ 1, y decreases by 1 and vice versa
      // example 20,29 -> 980,989
      // x is increasing and y is increasing, work out by sign
      let [x1, y1, x2, y2] = splitCoords;
      if (x1 > x2) {
        // swap them round, so x is always increasing
        [x1, y1, x2, y2] = [x2, y2, x1, y1];
      }
      const ysign = y1 < y2 ? 1 : -1;
      for (let i = 0; i <= x2 - x1; i++) {
        // y increases or decreases depending on the sign
        const newPoint = [x1 + i, y1 + i * ysign];
        addPointToMap(newPoint.join(','));
      }
    }
    if (lineCount === 500) {
      console.log(crossings);
      lines.clear();
    }
    lineCount++;
  });
};

reddit1(false);
reddit1(true);
