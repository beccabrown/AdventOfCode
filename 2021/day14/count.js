const fs = require('fs');

function reddit1(steps, inputFile, display) {
  const input = fs.readFileSync(inputFile).toString();
  // lantern fish again, track the pairs
  const [template, insertions] = input.split('\n\n');
  const trimmedInsertions = insertions.split('\n');
  let step = 1;
  let pairsOfLetters = new Map();
  // start with the template and count
  for (let i = 0; i < template.length - 1; i++) {
    const alreadySet = pairsOfLetters.get(template[i] + template[i + 1]);
    pairsOfLetters.set(template[i] + template[i + 1], alreadySet ? alreadySet + 1 : 1);
  }
  while (step < steps + 1) {
    const newPairs = new Map();
    pairsOfLetters.forEach((value, key) => {
      const [pair1, pair2] = key;
      let letterToInsert = trimmedInsertions.find((item) => item.startsWith(key));
      if (letterToInsert) {
        letterToInsert = letterToInsert.split(' -> ')[1];
        const pair1AlreadySet = newPairs.get(pair1 + letterToInsert);
        const pair2AlreadySet = newPairs.get(letterToInsert + pair2);
        newPairs.set(pair1 + letterToInsert, pair1AlreadySet ? pair1AlreadySet + value : value);
        newPairs.set(letterToInsert + pair2, pair2AlreadySet ? pair2AlreadySet + value : value);
      } else {
        // just do the current pair, shouldn't ever hit this
        const pairAlreadySet = newPairs.get(key);
        newPairs.set(key, pairAlreadySet ? pairAlreadySet + value : value);
      }
    });
    pairsOfLetters = newPairs;
    step++;
  }
  const finalCount = new Map();
  pairsOfLetters.forEach((value, key) => {
    const [letter1, letter2] = key;
    const letter1AlreadySet = finalCount.get(letter1);
    finalCount.set(letter1, letter1AlreadySet ? letter1AlreadySet + value : value);
    const letter2AlreadySet = finalCount.get(letter2);
    finalCount.set(letter2, letter2AlreadySet ? letter2AlreadySet + value : value);
  });
  // we've double counted because we did both insertion before and after each part of the pair, divide by 2
  finalCount.forEach((value, key) => {
    finalCount.set(key, Math.ceil(value / 2));
  })
  const sortedArray = [...finalCount.values()].sort((a, b) => a - b);
  const finalFinalCount = sortedArray[sortedArray.length - 1] - sortedArray[0];
  console.log(display, finalFinalCount);
};

reddit1(10, './example.txt', 'Part 1 example: ');
reddit1(10, './data.txt', 'Part 1 real: ');
reddit1(40, './example.txt', 'Part 2 example: ');
reddit1(40, './data.txt', 'Part 2 real: ');
