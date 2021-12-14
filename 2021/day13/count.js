const fs = require('fs')
const readline = require('readline');

const readInterface = readline.createInterface({
  input: fs.createReadStream('./data.txt'),
  output: process.stdout,
  console: false,
  terminal: false,
});

function reddit1(stopAfter1) {
  let yLimit = 0;
  let xLimit = 0;
  const lines = [];
  const graph = [];
  let foldNumber = 0;
  readInterface.on('line', function (line) {
    if (line !== '' && !line.includes('fold')) {
      const [x, y] = line.split(',').map((item) => parseInt(item, 10));
      if (x > xLimit) xLimit = x;
      if (y > yLimit) yLimit = y;
      lines.push([x, y]);
    }
    else if (line === '') {
      const xdots = Array.from('.'.repeat(xLimit + 1));
      for (let i = 0; i < yLimit + 1; i++) {
        // copy x dots so different in memory
        graph.push([...xdots]);
      }
      lines.forEach((coordinate) => {
        const [x1, y1] = coordinate;
        graph[y1][x1] = '#';
      });
    }
    else if (line.includes('fold')) {
      // instructions here
      const instruction = line.split('fold along ')[1];
      const [direction, coord] = instruction.split('=');
      if (direction === 'y') {
        foldNumber += 1;
        const y = parseInt(coord, 10);
        for (let i = 1; i < graph.length / 2; i++) {
          graph[y - i] = graph[y - i].map((entry, index) => {
            if (entry === '.' && graph[y + i][index] === '#') {
              return '#';
            }
            return entry;
          });
        }
        graph.splice(y);
      } else {
        foldNumber += 1;
        const x = parseInt(coord, 10);
        for (let j = 0; j < graph.length; j++) {
          for (let i = 1; i < x + 1; i++) {
            if (graph[j][x - i] === '#' || graph[j][x + i] === '#') {
              graph[j][x - i] = '#';
            } else {
              graph[j][x - i] = '.';
            }
          }
          graph[j].splice(x, graph[j].length - 1);
        }
      }
      if (stopAfter1 && foldNumber === 1) {
        let count = 0;
        graph.forEach((entry) => {
          const dots = entry.filter((item) => item === '#').length;
          count += dots;
        });
        console.log(count);
      } else if (!stopAfter1 && foldNumber === 12) {
        const graphToDisplay = graph.map((entry) => entry.join(''));
        console.log(graphToDisplay.join('\n'));
      }
    }
  });
};

reddit1(true);
reddit1();

//AHPRPAUZ
