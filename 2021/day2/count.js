const fs = require('fs')
const readline = require('readline');
let horizontal = 0;
let vertical = 0;
let aim = 0;

const readInterface = readline.createInterface({
  input: fs.createReadStream('./data.txt'),
  output: process.stdout,
  console: false,
  terminal: false,
});

function reddit1() {
  readInterface.on('line', function (line) {
    const [direction, value] = line.split(' ');
    if (direction === 'forward') {
      horizontal += parseInt(value);
    } else if (direction === 'down') {
      vertical += parseInt(value);
    } else if (direction === 'up') {
      vertical -= parseInt(value);
    }
    console.log(horizontal, vertical);
  });
};

function reddit2() {
  readInterface.on('line', function (line) {
    const [direction, value] = line.split(' ');
    if (direction === 'forward') {
      horizontal += parseInt(value);
      vertical += aim * parseInt(value);
    } else if (direction === 'down') {
      aim += parseInt(value);
    } else if (direction === 'up') {
      aim -= parseInt(value);
    }
    console.log(horizontal, vertical);
  });
};

reddit2();

