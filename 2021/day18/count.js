const fs = require('fs');

function findNumberToRight(input, index) {
  const stringToSearch = input.substring(index + 1);
  const regex = /(\d){1,2}/;
  const match = regex.exec(stringToSearch);
  return match;
}

function findNumberToLeft(input, index) {
  const stringToSearch = input.substring(0, index);
  const regex = /\d{1,2}(?=[^\d]*$)/g;
  const match = regex.exec(stringToSearch);
  return match;
}

function willPairSplit(input) {
  let indexes;
  for (let i = 0; i < input.length - 1; i++) {
    if (parseInt(input[i] + input[i + 1], 10) > 9) {
      indexes = [i, i + 1];
      break;
    }
  }
  return indexes;
}

function willPairExplode(input) {
  let count = 0;
  let pair;
  let indexes;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === '[') {
      count++;
    } else if (input[i] === ']') {
      count--;
    }
    if (count === 5) {
      const nextBrace = input.substring(i).indexOf(']');
      pair = input.substring(i + 1, i + nextBrace).split(',');
      indexes = [i, i + nextBrace];
      break;
    }
  }
  return { pair, indexes };
}

function makeNewPair(input) {
  const [firstNumber, secondNumber] = input;
  return `[${firstNumber},${secondNumber}]`;
}

function executeSplits(input) {
  let newPair = input;
  let pairSplits = willPairSplit(newPair);
  while (pairSplits !== undefined) {
    const numberToSplit = parseInt(newPair[pairSplits[0]] + newPair[pairSplits[1]], 10);
    const newNumber = `[${Math.floor(numberToSplit / 2)},${Math.ceil(numberToSplit / 2)}]`;
    newPair = newPair.substring(0, pairSplits[0]) + newNumber + newPair.substring(pairSplits[1] + 1);
    newPair = executeExplosions(newPair);
    pairSplits = willPairSplit(newPair);
  }
  return newPair;
}

function executeExplosions(input) {
  let newPair = input;
  let { pair, indexes } = willPairExplode(newPair);
  while (pair) {
    // explode here
    const [explodePair1, explodePair2] = pair;
    const leftNumber = findNumberToLeft(newPair, indexes[0]);
    const rightNumber = findNumberToRight(newPair, indexes[1]);
    let twoDigitLeftNumber = false;
    // [[[[[1,1],[2,2]],[3,3]],[4,4]],[5,5]]
    if (leftNumber) {
      // [[[[0,[3,2]],[3,3]],[4,4]],[5,5]]
      const newNumber = parseInt(leftNumber[0], 10) + parseInt(explodePair1, 10);
      if (/^\d$/.test(newPair[leftNumber['index'] + 1])) {
        newPair = newPair.substring(0, leftNumber['index']) + newNumber.toString() + newPair.substring(leftNumber['index'] + 2);
      } else {
        newPair = newPair.substring(0, leftNumber['index']) + newNumber.toString() + newPair.substring(leftNumber['index'] + 1);
      }
      if (newNumber > 9 && parseInt(leftNumber[0], 10) < 10) {
        twoDigitLeftNumber = true;
      }
    }
    if (rightNumber) {
      const newNumber = parseInt(rightNumber[0], 10) + parseInt(explodePair2, 10);
      if (twoDigitLeftNumber) {
        if (/^\d$/.test(newPair.substring(rightNumber['index'] + indexes[1] + 3)[0])) {
          newPair = newPair.substring(0, rightNumber['index'] + indexes[1] + 2) + newNumber.toString() + newPair.substring(rightNumber['index'] + indexes[1] + 4);
        } else {
          newPair = newPair.substring(0, rightNumber['index'] + indexes[1] + 2) + newNumber.toString() + newPair.substring(rightNumber['index'] + indexes[1] + 3);
        }
      } else {
        if (/^\d$/.test(newPair.substring(rightNumber['index'] + indexes[1] + 2)[0])) {
          newPair = newPair.substring(0, rightNumber['index'] + indexes[1] + 1) + newNumber.toString() + newPair.substring(rightNumber['index'] + indexes[1] + 3);
        } else {
          newPair = newPair.substring(0, rightNumber['index'] + indexes[1] + 1) + newNumber.toString() + newPair.substring(rightNumber['index'] + indexes[1] + 2);
        }
      }
    }
    // [[[[0,[3,2]],[3,3]],[4,4]],[5,5]]
    if (twoDigitLeftNumber) {
      newPair = newPair.substring(0, indexes[0] + 1) + '0' + newPair.substring(indexes[1] + 2);
    } else {
      newPair = newPair.substring(0, indexes[0]) + '0' + newPair.substring(indexes[1] + 1);
    }
    const newStuff = willPairExplode(newPair);
    pair = newStuff.pair;
    indexes = newStuff.indexes;
  }
  return newPair;
}

function findMagnitude(input) {
  let stringToParse = input;
  const regex = /\[(\d+,\d+)\]/;
  let match = regex.exec(stringToParse);
  while (match) {
    const [leftNumber, rightNumber] = match[1].split(',').map((item) => parseInt(item, 10));
    const magnitude = (3 * leftNumber) + (2 * rightNumber);
    const index = match['index'];
    const nextBrace = stringToParse.substring(index).indexOf(']');
    const braces = [index - 1, index + nextBrace];
    stringToParse = stringToParse.substring(0, braces[0] + 1) + magnitude.toString() + stringToParse.substring(braces[1] + 1);
    match = regex.exec(stringToParse);
  }
  return stringToParse;
}

function addUpAllLines(input) {
  const numbers = input.split('\n');
  let currentNumber;
  for (let i = 0; i < numbers.length - 1; i++) {
    const firstNumber = currentNumber || numbers[i];
    const secondNumber = numbers[i + 1];
    let newPair = makeNewPair([firstNumber, secondNumber]);
    // check explosions first
    newPair = executeExplosions(newPair);
    // now check splits
    newPair = executeSplits(newPair);
    currentNumber = newPair;
  }
  const magnitude = findMagnitude(currentNumber);
  return { currentNumber, magnitude };
}

function addUpMaxMagnitude(input) {
  const numbers = input.split('\n');
  let maxMagnitude = 0;
  for (let i = 0; i < numbers.length - 1; i++) {
    const firstNumber = numbers[i];
    const cloned = [...numbers];
    cloned.splice(i, 1);
    for (let j = 0; j < cloned.length; j++) {
      let newPair = makeNewPair([firstNumber, cloned[j]]);
      // check explosions first
      newPair = executeExplosions(newPair);
      // now check splits
      newPair = executeSplits(newPair);
      const magnitude = parseInt(findMagnitude(newPair), 10);
      if (magnitude > maxMagnitude) maxMagnitude = magnitude;
    }
  }
  return maxMagnitude;
}

const data = fs.readFileSync('./data.txt').toString();
const example1 = fs.readFileSync('./example1.txt').toString();
const example2 = fs.readFileSync('./example2.txt').toString();
const example3 = fs.readFileSync('./example3.txt').toString();
const example4 = fs.readFileSync('./example4.txt').toString();
const example5 = fs.readFileSync('./example5.txt').toString();

console.log('----TESTING PART 1----');
console.log(addUpAllLines(example1));
console.log(addUpAllLines(example2));
console.log(addUpAllLines(example3));
console.log(addUpAllLines(example4));
console.log(addUpAllLines(example5));
console.log('---------------');
console.log('');
console.log('----REAL PART 1----');
console.log(addUpAllLines(data));
console.log('---------------');
console.log('');

console.log('----TESTING PART 2----');
console.log(addUpMaxMagnitude(example5));
console.log('---------------');
console.log('');

console.log('----REAL PART 2----');
console.log(addUpMaxMagnitude(data));
console.log('---------------');



