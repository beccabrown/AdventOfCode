const fs = require('fs')
const readline = require('readline');

const readInterface = readline.createInterface({
  input: fs.createReadStream('./github.txt'),
  output: process.stdout,
  console: false,
  terminal: false,
});

function reddit1() {
  let horizontal = 0;
  let vertical = 0;
  let lineNumber = 1;
  readInterface.on('line', function (line) {
    const [direction, value] = line.split(' ');
    if (direction === 'forward') {
      horizontal += parseInt(value);
    } else if (direction === 'down') {
      vertical += parseInt(value);
    } else if (direction === 'up') {
      vertical -= parseInt(value);
    }
    if (lineNumber === 1000) console.log(horizontal * vertical);
    lineNumber ++;
  });
};

function reddit2() {
  let horizontal = 0;
  let vertical = 0;
  let aim = 0;
  let lineNumber = 1;
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
    if (lineNumber === 1000) console.log(horizontal * vertical);
    lineNumber ++;
  });
};

reddit1();
reddit2();

