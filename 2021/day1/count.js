const fs = require('fs')
const readline = require('readline');
let prevLineA = [];
let count = 0;

const readInterface = readline.createInterface({
  input: fs.createReadStream('./data.txt'),
  output: process.stdout,
  console: false,
  terminal: false,
});

function reddit1() {
  readInterface.on('line', function (line) {
    const increase = parseInt(line) - parseInt(prevLine) > 0 && prevLine !== '0';
    if (increase) count += 1;
    prevLine = line;
    console.log(count);
  });
};

function reddit2() {
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
      console.log(count);
    }
  });
};

reddit2();

