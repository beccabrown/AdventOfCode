const fs = require('fs');
const readline = require('readline');

const readInterface = readline.createInterface({
  input: fs.createReadStream('./data.txt'),
  output: process.stdout,
  console: false,
  terminal: false,
});

let string = '';
let indicator;

function filtering(array) {
  const ones = array.filter((item) => item === '1');
  const zeros = array.filter((item) => item === '0');
  if (ones.length > 500) {
    string += '1';
  } else {
    string += '0';
  }
}

function filtering2(array) {
  const ones = array.filter((item) => item === '1');
  const zeros = array.filter((item) => item === '0');
  if (ones.length === zeros.length) {
    indicator = '1';
  } else if (ones.length > zeros.length) {
    indicator = '1';
  } else if (zeros.length > ones.length) {
    indicator = '0';
  }
}

function filtering3(array) {
  const ones = array.filter((item) => item === '1');
  const zeros = array.filter((item) => item === '0');
  if (ones.length === zeros.length) {
    indicator = '0';
  } else if (ones.length > zeros.length) {
    indicator = '0';
  } else if (zeros.length > ones.length) {
    indicator = '1';
  }
}

function reddit1() {
  let bit1 = [];
  let bit2 = [];
  let bit3 = [];
  let bit4 = [];
  let bit5 = [];
  let bit6 = [];
  let bit7 = [];
  let bit8 = [];
  let bit9 = [];
  let bit10 = [];
  let bit11 = [];
  let bit12 = [];
  readInterface.on('line', function (line) {
    const [a, b, c, d, e, f, g, h, i, j, k, l] = line.split('');
    bit1.push(a);
    bit2.push(b);
    bit3.push(c);
    bit4.push(d);
    bit5.push(e);
    bit6.push(f);
    bit7.push(g);
    bit8.push(h);
    bit9.push(i);
    bit10.push(j);
    bit11.push(k);
    bit12.push(l);
    if (bit12.length === 1000) {
      filtering(bit1);
      filtering(bit2);
      filtering(bit3);
      filtering(bit4);
      filtering(bit5);
      filtering(bit6);
      filtering(bit7);
      filtering(bit8);
      filtering(bit9);
      filtering(bit10);
      filtering(bit11);
      filtering(bit12);
      console.log(string);
    }
  });
};

function reddit2() {
  let lines = [];
  readInterface.on('line', function (line) {
    lines.push(line);
    let bit1 = [];
    let bit2 = [];
    let bit3 = [];
    let bit4 = [];
    let bit5 = [];
    let bit6 = [];
    let bit7 = [];
    let bit8 = [];
    let bit9 = [];
    let bit10 = [];
    let bit11 = [];
    let bit12 = [];

    if (lines.length === 1000) {
      let newLines;
      let newLength = 1000;
      const sortLines = (liney) => {
        bit1 = [];
        bit2 = [];
        bit3 = [];
        bit4 = [];
        bit5 = [];
        bit6 = [];
        bit7 = [];
        bit8 = [];
        bit9 = [];
        bit10 = [];
        bit11 = [];
        bit12 = [];
        liney.forEach((lin) => {
          const [a, b, c, d, e, f, g, h, i, j, k, l] = lin.split('');
          bit1.push(a);
          bit2.push(b);
          bit3.push(c);
          bit4.push(d);
          bit5.push(e);
          bit6.push(f);
          bit7.push(g);
          bit8.push(h);
          bit9.push(i);
          bit10.push(j);
          bit11.push(k);
          bit12.push(l);
        });
      }
      const figureout = (bitnumber, index) => {
        if (newLength > 1) {
          filtering2(bitnumber);
          if (indicator === '1') {
            newLines = newLines.filter((l) => l[index] === '1');
          } else {
            newLines = newLines.filter((l) => l[index] === '0');
          }
          newLength = newLines.length;
        }
      }
      sortLines(lines);
      filtering2(bit1);
      if (indicator === '1') {
        newLines = lines.filter((l) => l[0] === '1');
      } else {
        newLines = lines.filter((l) => l[0] === '0');
      }
      newLength = newLines.length;
      sortLines(newLines);
      figureout(bit2, 1);
      sortLines(newLines);
      figureout(bit3, 2);
      sortLines(newLines);
      figureout(bit4, 3);
      sortLines(newLines);
      figureout(bit5, 4);
      sortLines(newLines);
      figureout(bit6, 5);
      sortLines(newLines);
      figureout(bit7, 6);
      sortLines(newLines);
      figureout(bit8, 7);
      sortLines(newLines);
      figureout(bit9, 8);
      sortLines(newLines);
      figureout(bit10, 9);
      sortLines(newLines);
      figureout(bit11, 10);
      sortLines(newLines);
      figureout(bit12, 11);

      console.log(newLines);
    }
  });
};

function reddit3() {
  let lines = [];
  readInterface.on('line', function (line) {
    lines.push(line);
    let bit1 = [];
    let bit2 = [];
    let bit3 = [];
    let bit4 = [];
    let bit5 = [];
    let bit6 = [];
    let bit7 = [];
    let bit8 = [];
    let bit9 = [];
    let bit10 = [];
    let bit11 = [];
    let bit12 = [];

    if (lines.length === 1000) {
      let newLines;
      let newLength = 1000;
      const sortLines = (liney) => {
        bit1 = [];
        bit2 = [];
        bit3 = [];
        bit4 = [];
        bit5 = [];
        bit6 = [];
        bit7 = [];
        bit8 = [];
        bit9 = [];
        bit10 = [];
        bit11 = [];
        bit12 = [];
        liney.forEach((lin) => {
          const [a, b, c, d, e, f, g, h, i, j, k, l] = lin.split('');
          bit1.push(a);
          bit2.push(b);
          bit3.push(c);
          bit4.push(d);
          bit5.push(e);
          bit6.push(f);
          bit7.push(g);
          bit8.push(h);
          bit9.push(i);
          bit10.push(j);
          bit11.push(k);
          bit12.push(l);
        });
      }
      const figureout = (bitnumber, index) => {
        if (newLength > 1) {
          filtering3(bitnumber);
          if (indicator === '1') {
            newLines = newLines.filter((l) => l[index] === '1');
          } else {
            newLines = newLines.filter((l) => l[index] === '0');
          }
          newLength = newLines.length;
        }
      }
      sortLines(lines);
      filtering3(bit1);
      if (indicator === '1') {
        newLines = lines.filter((l) => l[0] === '1');
      } else {
        newLines = lines.filter((l) => l[0] === '0');
      }
      newLength = newLines.length;
      sortLines(newLines);
      figureout(bit2, 1);
      sortLines(newLines);
      figureout(bit3, 2);
      sortLines(newLines);
      figureout(bit4, 3);
      sortLines(newLines);
      figureout(bit5, 4);
      sortLines(newLines);
      figureout(bit6, 5);
      sortLines(newLines);
      figureout(bit7, 6);
      sortLines(newLines);
      figureout(bit8, 7);
      sortLines(newLines);
      figureout(bit9, 8);
      sortLines(newLines);
      figureout(bit10, 9);
      sortLines(newLines);
      figureout(bit11, 10);
      sortLines(newLines);
      figureout(bit12, 11);

      console.log(newLines);
    }
  });
}

// first number is 000110100011
// second number therefore is 111001011100

// 419 * 3676 is 1540244

// 02 indicator is 010010001001
// co2 is          111000100101
// 1161 * 3621 = 4203981

reddit2();
reddit3();


