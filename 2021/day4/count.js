const fs = require('fs')
const readline = require('readline');

const numbers = [49, 48, 98, 84, 71, 59, 37, 36, 6, 21, 46, 30, 5, 33, 3, 62, 63, 45, 43, 35, 65, 77, 57, 75, 19, 44, 4, 76, 88, 92, 12, 27, 7, 51, 14, 72, 96, 9, 0, 17, 83, 64, 38, 95, 54, 20, 1, 74, 69, 80, 81, 56, 10, 68, 42, 15, 99, 53, 93, 94, 47, 13, 29, 34, 60, 41, 82, 90, 25, 85, 78, 91, 32, 70, 58, 28, 61, 24, 55, 87, 39, 11, 79, 50, 22, 8, 89, 26, 16, 2, 73, 23, 18, 66, 52, 31, 86, 97, 67, 40];
let boards = [];
let rows = [];

function getAllIndexes(arr, val) {
  var indexes = [], i;
  for (i = 0; i < arr.length; i++)
    if (arr[i] === val)
      indexes.push(i);
  return indexes;
}

const readInterface = readline.createInterface({
  input: fs.createReadStream('./data.txt'),
  output: process.stdout,
  console: false,
  terminal: false,
});

function reddit1() {
  readInterface.on('line', function (line) {
    if (line !== '') {
      const row = line.split(' ');
      const trimmedRow = row.filter((item) => item !== '');
      rows.push(trimmedRow);
      if (boards.length === 99 && rows.length === 5) {
        boards.push(rows);
        rows = [];
      }
    } else {
      boards.push(rows);
      rows = [];
    }
    if (boards.length === 100) {
      let isFullRow = false;
      let isFullColumn = false;
      let indexes = [];
      for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < boards.length; j++) {
          for (let k = 0; k < 5; k++) {
            if (boards[j][k].includes(numbers[i].toString())) {
              boards[j][k][boards[j][k].indexOf(numbers[i].toString())] = '*';
              isFullRow = boards[j][k].filter((item) => item !== '*').length === 0;
            }
            const columnIndexes = getAllIndexes(boards[j][k], '*');
            columnIndexes.forEach((index) => {
              indexes.push(index);
            });
            if (k === 4) {
              // count number of occurances of numbers
              for (let l = 0; l < 5; l++) {
                const res = indexes.reduce((a, v) => (parseInt(v) === l ? a + 1 : a), 0);
                if (res === 5) {
                  isFullColumn = true;
                  break;
                }
              }
              indexes = [];
            }
            if (isFullRow || isFullColumn) {
              console.log(boards[j]);
              console.log(numbers[i]);
              break;
            }
          }
          if (isFullRow || isFullColumn) {
            break;
          }
        }
        if (isFullRow || isFullColumn) {
          break;
        }
      }
    }
  });
};

function reddit2() {
  readInterface.on('line', function (line) {
    if (line !== '') {
      const row = line.split(' ');
      const trimmedRow = row.filter((item) => item !== '');
      rows.push(trimmedRow);
      if (boards.length === 99 && rows.length === 5) {
        boards.push(rows);
        rows = [];
      }
    } else {
      boards.push(rows);
      rows = [];
    }
    if (boards.length === 100) {
      let isFullRow = false;
      let isFullColumn = false;
      let numberOfBoardsWon = 0;
      let indexes = [];
      for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < boards.length; j++) {
          for (let k = 0; k < 5; k++) {
            if (boards[j][k].includes(numbers[i].toString())) {
              boards[j][k][boards[j][k].indexOf(numbers[i].toString())] = '*';
              if (!isFullRow) {
                isFullRow = boards[j][k].filter((item) => item !== '*').length === 0;
              }
            }
            const columnIndexes = boards[j][k].reduce(function (a, e, i) {
              if (e === '*')
                a.push(i);
              return a;
            }, []);
            columnIndexes.forEach((index) => {
              indexes.push(index);
            });
            if (k === 4) {
              // count number of occurances of numbers
              for (let l = 0; l < 5; l++) {
                const res = indexes.reduce((a, v) => (v === l ? a + 1 : a), 0);
                if (res === 5) {
                  isFullColumn = true;
                  break;
                }
              }
              indexes = [];
            }
          }
          if (isFullRow || isFullColumn) {
            numberOfBoardsWon += 1;
            isFullRow = false;
            isFullColumn = false;
            if (numberOfBoardsWon === 100) {
              console.log(boards);
              console.log(numbers[i]);
              break;
            } else {
              boards.splice(j, 1);
            }
          }
        }
        if (numberOfBoardsWon === 100) {
          break;
        }
      }
    }
  });
};

// reddit1();
reddit2();

// 24 + 9 + 94 + 69 + 97 + 85 + 53 + 92 + 11 + 61 + 8 + 68 + 55 + 52 + 93 = 871
// number 75
// 871 * 75 = 65325

// 86 + 97 + 2 + 73 + 31 = 289
// number 16
// 289 * 16 = 4624