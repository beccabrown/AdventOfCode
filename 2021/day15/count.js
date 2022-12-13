const fs = require('fs');

// Dijkstras algorithm from D1 Maths 
// Let the node at which we are starting at be called the initial node. Let the distance of node Y be the distance from the initial node to Y. Dijkstra's algorithm will initially start with infinite distances and will try to improve them step by step.

// 1. Mark all nodes unvisited. Create a set of all the unvisited nodes called the unvisited set.
// 2. Assign to every node a tentative distance value: set it to zero for our initial node and to infinity for all other nodes. The tentative distance of a node v is the length of the shortest path discovered so far between the node v and the starting node. Since initially no path is known to any other vertex than the source itself (which is a path of length zero), all other tentative distances are initially set to infinity. Set the initial node as current.
// 3. For the current node, consider all of its unvisited neighbors and calculate their tentative distances through the current node. Compare the newly calculated tentative distance to the current assigned value and assign the smaller one. For example, if the current node A is marked with a distance of 6, and the edge connecting it with a neighbor B has length 2, then the distance to B through A will be 6 + 2 = 8. If B was previously marked with a distance greater than 8 then change it to 8. Otherwise, the current value will be kept.
// 4. When we are done considering all of the unvisited neighbours of the current node, mark the current node as visited and remove it from the unvisited set. A visited node will never be checked again.
// 5. If the destination node has been marked visited (when planning a route between two specific nodes) or if the smallest tentative distance among the nodes in the unvisited set is infinity (when planning a complete traversal; occurs when there is no connection between the initial node and remaining unvisited nodes), then stop. The algorithm has finished.
// 6. Otherwise, select the unvisited node that is marked with the smallest tentative distance, set it as the new current node, and go back to step 3.

function getNeighbours(point, yLimit, xLimit) {
  const neighbours = [];
  const [i, j] = point;
  if (i > 1)
    // not on line one, can move up
    neighbours.push([i - 1, j]);
  if (j >= 1)
    // not at beginning of line, can move left
    neighbours.push([i, j - 1]);
  if (i < yLimit)
    // not on last line, can move down
    neighbours.push([i + 1, j]);
  if (j < xLimit)
    // not at end of line, can move right
    neighbours.push([i, j + 1]);
  return neighbours;
}

function reddit1(inputFile, part2) {
  const input = fs.readFileSync(inputFile).toString();
  let nodes = input.split('\n').map((line) => line.split('').map((item) => parseInt(item, 10)));
  if (part2) {
    // like the folds, initialise an array of the right size, then map each of the items
    nodes = [...Array.from('.'.repeat(nodes.length * 5))].map((value, yIndex) => (
      [...Array.from('.'.repeat(nodes[0].length * 5))].map((xvalue, xIndex) => (
        // % nodes.length to wrap the yindex after we hit the end of each tile
        // % nodes[0].length to wrap the xindex '''
        // math.floor will be 0 for the first tile, then one for the second tile etc etc
        // % 9 coz it wraps
        // we don't want to start adding until after the first tile, so take one within the mod, then add back on after
        1 + ((nodes[yIndex % nodes.length][xIndex % nodes[0].length] - 1 + Math.floor(xIndex / nodes[0].length) + Math.floor(yIndex / nodes.length)) % 9)
      ))
    ));
  }
  const possibleNodesToCheck = [{ currentNode: [0, 0], risk: 0 }];
  // step 1
  const visitedNodes = [];
  // step 2
  visitedNodes[[0, 0]] = true;
  while (possibleNodesToCheck.length > 0) {
    const { currentNode: [x, y], risk } = possibleNodesToCheck.shift();
    // step 5
    if (y === nodes.length - 1 && x === nodes[0].length - 1) return risk;
    // step 3
    const neighbours = getNeighbours([y, x], nodes.length - 1, nodes[0].length - 1);
    neighbours.forEach((neighbour) => {
      if (!visitedNodes[neighbour]) {
        // step 4
        visitedNodes[neighbour] = true;
        possibleNodesToCheck.push({ currentNode: neighbour.reverse(), risk: risk + nodes[neighbour[1]][neighbour[0]] });
      }
    });
    // sort the list, then get the lowest one for the next 'visit', step 6
    possibleNodesToCheck.sort((a, b) => a.risk - b.risk);
  }
};

console.log('Part1 example: ', reddit1('./example.txt'));
console.log('Part1 data: ', reddit1('./data.txt'));
console.log('Part1 github: ', reddit1('./github.txt'));
console.log('Part2 example: ', reddit1('./example.txt', true));
console.log('Part2 data: ', reddit1('./data.txt', true));
console.log('Part2 github: ', reddit1('./github.txt', true));
