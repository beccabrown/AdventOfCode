const fs = require('fs')
const readline = require('readline');

const readInterface = readline.createInterface({
  input: fs.createReadStream('./data.txt'),
  output: process.stdout,
  console: false,
  terminal: false,
});

function reddit1() {
  readInterface.on('line', function (line) {
    
  });
};


function reddit2() {
  readInterface.on('line', function (line) {
    
  });
};


reddit1();
// reddit2();
