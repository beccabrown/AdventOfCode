const fs = require('fs');

function parseFile(input) {
  const lines = input.split('\n').map((line) => (
    line.split('')
  ));
  return lines;
}

function moveCucumber(input) {
  // move east cucumbers first
  const newOrientation = JSON.parse(JSON.stringify(input));
  for (let j = 0; j < input.length; j++) {
    for (let i = 0; i < input[j].length; i++) {
      const cucumberToMove = input[j][i];
      const neighbour = i + 1 === input[j].length ? input[j][0] : input[j][i + 1];
      if (cucumberToMove === '>' && neighbour === '.') {
        // we can move it
        newOrientation[j][i] = '.';
        if (i + 1 === input[j].length) {
          newOrientation[j][0] = '>';
        } else {
          newOrientation[j][i + 1] = '>';
        }
      }
    }
  }
  const newNewOrientation = JSON.parse(JSON.stringify(newOrientation));
  // move south cucumbers next
  for (let j = 0; j < input.length; j++) {
    for (let i = 0; i < input[j].length; i++) {
      const cucumberToMove = newOrientation[j][i];
      const neighbour = j + 1 === input.length ? newOrientation[0][i] : newOrientation[j + 1][i];
      if (cucumberToMove === 'v' && neighbour === '.') {
        // we can move it
        newNewOrientation[j][i] = '.';
        if (j + 1 === input.length) {
          newNewOrientation[0][i] = 'v';
        } else {
          newNewOrientation[j + 1][i] = 'v';
        }
      }
    }
  }
  return newNewOrientation;
}

function multipleMoveCucumber(input) {
  let state = input;
  let numberOfSteps = 0;
  while (true) {
    numberOfSteps++;
    const newState = moveCucumber(state);
    if (JSON.stringify(state) === JSON.stringify(newState)) {
      break;
    }
    state = newState;
  }
  const finalState = state.map((line) => line.join(''));
  return { finalState, numberOfSteps };
}


console.log(multipleMoveCucumber(parseFile(fs.readFileSync('./example.txt').toString())));
console.log(multipleMoveCucumber(parseFile(fs.readFileSync('./data.txt').toString())));
