const fs = require('fs')
const readline = require('readline');

const readInterface = readline.createInterface({
  input: fs.createReadStream('./data.txt'),
  output: process.stdout,
  console: false,
  terminal: false,
});

function reddit1() {
  let prevLine = 0;
  let count = 0;
  let lineNumber = 1;
  readInterface.on('line', function (line) {
    const increase = parseInt(line) - parseInt(prevLine) > 0 && prevLine !== '0';
    if (increase) count += 1;
    prevLine = line;
    lineNumber++;
    if (lineNumber === 2000) console.log(count);
  });
};

function reddit2() {
  let prevLineA = [];
  let count = 0;
  let lineNumber = 1;
  readInterface.on('line', function (line) {
    const newLength = prevLineA.push(parseInt(line));
    if (newLength > 4) {
      prevLineA.shift();
    }
    if (prevLineA.length === 4) {
      const A = prevLineA.slice(0, 3);
      const B = prevLineA.slice(1, 4);
      let sumA = 0;
      let sumB = 0
      A.forEach((int) => {
        sumA += int;
      });
      B.forEach((int) => {
        sumB += int;
      })
      const increase = sumA < sumB;
      if (increase) count += 1;
      if (lineNumber === 2000) console.log(count);
    }
    lineNumber ++;
  });
};

reddit1();
reddit2();

