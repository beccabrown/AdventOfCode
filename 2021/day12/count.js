const input = ['ax-end', 'xq-GF', 'end-xq', 'im-wg', 'ax-ie', 'start-ws', 'ie-ws', 'CV-start', 'ng-wg', 'ng-ie', 'GF-ng', 'ng-av', 'CV-end', 'ie-GF', 'CV-ie', 'im-xq', 'start-GF', 'GF-ws', 'wg-LY', 'CV-ws', 'im-CV', 'CV-wg'];
// const input = ['start-A', 'start-b', 'A-c', 'A-b', 'b-d', 'A-end', 'b-end'];
// const input = ['dc-end', 'HN-start', 'start-kj', 'dc-start', 'dc-HN', 'LN-dc',, 'HN-end', 'kj-sa', 'kj-HN', 'kj-dc'];
// const input = ['fs-end', 'he-DX', 'fs-he', 'start-DX', 'pj-DX', 'end-zg', 'zg-sl', 'zg-pj', 'pj-he', 'RW-he', 'fs-DX', 'pj-RW', 'zg-RW', 'start-pj', 'he-WI', 'zg-he', 'pj-fs', 'start-RW'];

const graph = {};

input.forEach((caveLink) => {
  const [currentCave, nextCave] = caveLink.split('-');
  graph[currentCave] = graph[currentCave] || [];
  graph[nextCave] = graph[nextCave] || [];
  // from this cave, where can we go
  graph[currentCave].push(nextCave);
  // from the next cave, we could double back
  graph[nextCave].push(currentCave);
});

function isLowerCaseCave(string) {
  return /[a-z]/.test(string);
}

function searchForPaths(cave, visited, paths) {
  visited.push(cave);
  if (cave === "end") {
    // we're at the end, complete path, return out of the function
    paths.push(visited.join(','));
    return;
  }

  for (let i = 0; i < graph[cave].length; i++) {
    // where can we go next
    // if it's lower case cave (including going back to the start) and we've already visited it, that's not a valid path, so keep going
    if (isLowerCaseCave(graph[cave][i]) && visited.includes(graph[cave][i])) {
      continue;
    }
    // we have a valid next cave, recurr and keep going, copy visited so not overwritten like last week
    searchForPaths(graph[cave][i], [...visited], paths);
  }
}

function searchForPathsPart2(cave, visited, visitedTwice, paths) {
  visited.push(cave);
  if (cave === "end") {
    // we're at the end, complete path, return out of the function
    paths.push(visited.join(','));
    return;
  }

  for (let i = 0; i < graph[cave].length; i++) {
    // where can we go next
    // if it's start cave, not a valid path, keep going
    if (graph[cave][i] === "start") {
      continue;
    }
    // if it's lower case cave and we've already visited it
    if (isLowerCaseCave(graph[cave][i]) && visited.includes(graph[cave][i])) {
      // if the only lower case cave that has been visited twice has already happened, we can't visit again,
      // not a valid path, keep going
      if (visitedTwice) {
        continue;
      }
      // we have a valid next cave, recurr and keep going, copy visited so not overwritten like last week,
      // visited twice is true for this particular lower case cave, can't visit a lower case cave now more than once
      searchForPathsPart2(graph[cave][i], [...visited], true, paths);
    } else {
      // we have a valid next cave, recurr and keep going, copy visited so not overwritten like last week,
      // this is an upper case cave, can do whatever we like
      searchForPathsPart2(graph[cave][i], [...visited], visitedTwice, paths);
    }
  }
}

function reddit1() {
  const paths = [];
  searchForPaths("start", [], paths);
  console.log(paths.length);
}

/**
 * one small cave can be visited at most twice
 * all other small caves can be visited at most once
 */
function reddit2() {
  const paths = [];
  searchForPathsPart2("start", [], false, paths);
  console.log(paths.length);
}


reddit1();
reddit2();