const fs = require('fs')
const readline = require('readline');

const readInterface = readline.createInterface({
  input: fs.createReadStream('./github.txt'),
  output: process.stdout,
  console: false,
  terminal: false,
});

function reddit1() {
  let lineNumber = 1;
  let corruptionCount = 0;
  const tags = new Map();
  tags.set('(', ')');
  tags.set('<', '>');
  tags.set('[', ']');
  tags.set('{', '}');
  const scores = new Map();
  scores.set(')', 3);
  scores.set('}', 1197);
  scores.set(']', 57);
  scores.set('>', 25137);
  const completeScores = new Map();
  completeScores.set(')', 1);
  completeScores.set('}', 3);
  completeScores.set(']', 2);
  completeScores.set('>', 4);
  const openingChars = [...tags.keys()];
  const closingChars = [...tags.values()];
  let incompleteLineScores = [];
  readInterface.on('line', function (line) {
    const charsOnALine = line.split('');
    let corruptionFound = false;
    while (charsOnALine.some((item) => closingChars.includes(item))) {
      let splitList = false;
      for (let i = 0; i < charsOnALine.length; i++) {
        const currentCharacter = charsOnALine[i];
        if (openingChars.includes(currentCharacter)) {
          const closingCharacter = tags.get(charsOnALine[i]);
          if (charsOnALine[i + 1] === closingCharacter) {
            charsOnALine.splice(i, 1);
            charsOnALine.splice(i, 1);
            splitList = true;
            break;
          }
        }
      }
      if (!splitList) {
        // need to find first illegal character
        const illegalCharacter = charsOnALine.find((value) => closingChars.includes(value));
        const score = scores.get(illegalCharacter);
        corruptionCount += score;
        corruptionFound = true;
        break;
      }
    }
    if (!corruptionFound) {
      let incompleteLineScore = 0;
      const charsToAddToComplete = charsOnALine.reverse().map((char) => tags.get(char));
      charsToAddToComplete.forEach((char) => {
        incompleteLineScore *= 5;
        incompleteLineScore += completeScores.get(char);
      });
      incompleteLineScores.push(incompleteLineScore);
    }
    if (lineNumber === 110) {
      console.log(corruptionCount);
      console.log(incompleteLineScores.sort((a, b) => a - b)[Math.floor(incompleteLineScores.length / 2)]);
    }
    lineNumber++;
  });
};

reddit1();