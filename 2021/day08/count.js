const fs = require('fs')
const readline = require('readline');

const segments = new Map();
segments.set('abcefg', '0');
segments.set('acdeg', '2');
segments.set('acdfg', '3');
segments.set('abdfg', '5');
segments.set('abdefg', '6');
segments.set('abcdfg', '9');
segments.set('abcdefg', '8');

const lettersMapped = new Map();

function getDifference(a, b) {
  const chars1 = a.split('');
  const chars2 = b.split('');
  const intersection = chars1.filter(x => !chars2.includes(x))
    .concat(chars2.filter(x => !chars1.includes(x)));
  return intersection.join('');
}

function getIntersection(a, b) {
  const chars1 = a.split('');
  const chars2 = b.split('');
  const intersection = chars2.filter(x => chars1.includes(x));
  return intersection.join('');
}

function getB(a, b) {
  const chars1 = a.split('');
  const chars2 = b.split('');
  let diff = '';
  chars1.forEach((char) => {
    if (!chars2.includes(char)) {
      diff += char;
    }
  });
  return diff;
}

function getByValue(map, searchValue) {
  for (let [key, value] of map.entries()) {
    if (value === searchValue)
      return key;
  }
}

// can work out 1, 4, 7 and 8
// 8 is pointless, doesn't tell anything
// going from a 1 to a 7 turns on segment 'a' so the top bit
// going from a 7 to a 4 changes segment 'a' for 'b and d'

const uniqueNumberLengths = [2, 4, 3, 7];

const readInterface = readline.createInterface({
  input: fs.createReadStream('./github.txt'),
  output: process.stdout,
  console: false,
  terminal: false,
});

function reddit1() {
  let count = 0;
  let lineNumber = 1;
  readInterface.on('line', function (line) {
    const [input, output] = line.split(' | ');
    const outputNumbers = output.split(' ');
    outputNumbers.forEach((number) => {
      if (uniqueNumberLengths.includes(number.length)) {
        count += 1;
      }
    });
    if (lineNumber === 200) {
      console.log(count);
    }
    lineNumber++;
  });
};

function reddit2() {
  let lineNumber = 1;
  let decodedLines = [];
  readInterface.on('line', function (line) {
    let decodedLine = [];
    const [input, output] = line.split(' | ');
    const outputNumbers = output.split(' ');
    input.split(' ').sort((a, b) => a.length - b.length).forEach((unsortedNumber) => {
      const number = unsortedNumber.split('').sort().join('');
      if (number.length === 2) {
        // this is a one
        lettersMapped.set('cf', number);
      } else if (number.length === 3) {
        // this is a seven
        const one = lettersMapped.get('cf');
        const difference = getDifference(one, number);
        lettersMapped.set('a', difference);
      } else if (number.length === 4) {
        // this is a four
        const one = lettersMapped.get('cf');
        const bd = getDifference(one, number);
        lettersMapped.set('bd', bd);
      } else if (number.length === 5) {
        // this is a two (a, c, d, e, g), three (a, d, e, f, g) or a five (a, b, d, f, g)
        //               (c, e, g)              (e, f, g)
        // can rule out five by comparing with four
        const bd = lettersMapped.get('bd');
        const afg = getDifference(bd, number);
        if (afg.length === 3) {
          // it's a 5
          const a = lettersMapped.get('a');
          const fg = getDifference(a, afg);
          const cf = lettersMapped.get('cf');
          const f = getIntersection(cf, fg);
          lettersMapped.set('f', f);
          const c = getDifference(f, cf);
          lettersMapped.set('c', c);
          const g = getDifference(f, fg);
          lettersMapped.set('g', g);
          const eg = lettersMapped.get('eg');
          if (eg) {
            // occurs after a two or three, can now set e
            const e = getDifference(g, eg);
            lettersMapped.set('e', e);
          }
        } else {
          // it's a two or a three, both have a d, neither have a b, so can use four to find which this is
          const a = lettersMapped.get('a');
          const bd = lettersMapped.get('bd');
          const cf = lettersMapped.get('cf');
          const b = getB(bd, number);
          lettersMapped.set('b', b);
          const d = getDifference(b, bd);
          lettersMapped.set('d', d);
          const cdegOrdefg = getDifference(a, number);
          const cegOrefg = getDifference(d, cdegOrdefg);
          const eg = getB(cegOrefg, cf);
          const g = lettersMapped.get('g');
          if (g) {
            // this occurs after a 5, so we have g and e
            const e = getDifference(g, eg);
            if (e.length) {
              lettersMapped.set('e', e);
            }
          } else {
            // this occurs first, set eg, then check in 5 for this set
            if (eg.length === 2) {
              lettersMapped.set('eg', eg);
            }
          }
        }
      }
    });
    outputNumbers.forEach((number) => {
      if (number.length === 2) {
        decodedLine.push(1);
      } else if (number.length === 3) {
        decodedLine.push(7)
      } else if (number.length === 4) {
        decodedLine.push(4);
      } else {
        let mappedNumber = [];
        number.split('').forEach((unmappedLetter) => {
          mappedNumber.push(getByValue(lettersMapped, unmappedLetter));
        });
        const orderedMappedNumber = mappedNumber.sort().join('');
        const value = segments.get(orderedMappedNumber);
        decodedLine.push(parseInt(value, 10));
      }
    });
    decodedLines.push(parseInt(decodedLine.join(''), 10));
    if (lineNumber === 200) {
      console.log(decodedLines.reduce((partialSum, a) => partialSum + a, 0));
    }
    lettersMapped.clear();
    lineNumber++;
  });
};

reddit1();
reddit2();
