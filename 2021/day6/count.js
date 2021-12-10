let initialData = [1, 2, 5, 1, 1, 4, 1, 5, 5, 5, 3, 4, 1, 2, 2, 5, 3, 5, 1, 3, 4, 1, 5, 2, 5, 1, 4, 1, 2, 2, 1, 5, 1, 1, 1, 2, 4, 3, 4, 2, 2, 4, 5, 4, 1, 2, 3, 5, 3, 4, 1, 1, 2, 2, 1, 3, 3, 2, 3, 2, 1, 2, 2, 3, 1, 1, 2, 5, 1, 2, 1, 1, 3, 1, 1, 5, 5, 4, 1, 1, 5, 1, 4, 3, 5, 1, 3, 3, 1, 1, 5, 2, 1, 2, 4, 4, 5, 5, 4, 4, 5, 4, 3, 5, 5, 1, 3, 5, 2, 4, 1, 1, 2, 2, 2, 4, 1, 2, 1, 5, 1, 3, 1, 1, 1, 2, 1, 2, 2, 1, 3, 3, 5, 3, 4, 2, 1, 5, 2, 1, 4, 1, 1, 5, 1, 1, 5, 4, 4, 1, 4, 2, 3, 5, 2, 5, 5, 2, 2, 4, 4, 1, 1, 1, 4, 4, 1, 3, 5, 4, 2, 5, 5, 4, 4, 2, 2, 3, 2, 1, 3, 4, 1, 5, 1, 4, 5, 2, 4, 5, 1, 3, 4, 1, 4, 3, 3, 1, 1, 3, 2, 1, 5, 5, 3, 1, 1, 2, 4, 5, 3, 1, 1, 1, 2, 5, 2, 4, 5, 1, 3, 2, 4, 5, 5, 1, 2, 3, 4, 4, 1, 4, 1, 1, 3, 3, 5, 1, 2, 5, 1, 2, 5, 4, 1, 1, 3, 2, 1, 1, 1, 3, 5, 1, 3, 2, 4, 3, 5, 4, 1, 1, 5, 3, 4, 2, 3, 1, 1, 4, 2, 1, 2, 2, 1, 1, 4, 3, 1, 1, 3, 5, 2, 1, 3, 2, 1, 1, 1, 2, 1, 1, 5, 1, 1, 2, 5, 1, 1, 4];
let testData = [3, 4, 3, 1, 2];

function reddit1(data, days) {
  const dataInstance = [...data];
  for (let i = 0; i < days; i++) {
    // beginning of the day i
    let newFish = [];
    dataInstance.forEach((fish, i) => {
      if (fish === 0) {
        dataInstance[i] = 6;
        newFish.push(8);
      } else {
        dataInstance[i] -= 1;
      }
    });
    newFish.forEach((fish) => {
      dataInstance.push(fish);
    });
  }
  return dataInstance.length;
};


function reddit2(data, days) {
  let fishes = new Map();
  fishes.set(0, 0);
  fishes.set(1, 0);
  fishes.set(2, 0);
  fishes.set(3, 0);
  fishes.set(4, 0);
  fishes.set(5, 0);
  fishes.set(6, 0);
  fishes.set(7, 0);
  fishes.set(8, 0);
  data.forEach((fishTimer) => {
    let numberOfFishTimersWithThisValue = fishes.get(fishTimer);
    fishes.set(fishTimer, numberOfFishTimersWithThisValue + 1);
  });
  for (let i = 0; i < days; i++) {
    const [a, b, c, d, e, f, g, h, j] = [...fishes.values()];
    fishes.set(8, a);
    fishes.set(7, j);
    fishes.set(6, h + a);
    fishes.set(5, g);
    fishes.set(4, f);
    fishes.set(3, e);
    fishes.set(2, d);
    fishes.set(1, c);
    fishes.set(0, b);
  }
  return [...fishes.values()].reduce((partialSum, a) => partialSum + a, 0);
};

console.log('Test Data result part 1: ', reddit1(testData, 80));
console.log('Puzzle Input Data result Part 1: ', reddit1(initialData, 80));
console.log('Test Data result part 2: ', reddit2(testData, 256));
console.log('Puzzle Input Data result Part 2: ', reddit2(initialData, 256));
