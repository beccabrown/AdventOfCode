// const input = [8577245547, 1654333653, 5365633785, 1333243226, 4272385165, 5688328432, 3175634254, 6775142227, 6152721415, 2678227325];
const input = [8826876714, 3127787238, 8182852861, 4655371483, 3864551365, 1878253581, 8317422437, 1517254266, 2621124761, 3473331514];
// const input = [5483143223, 2745854711, 5264556173, 6141336146, 6357385478, 4167524645, 2176841721, 6882881134, 4846848554, 5283751526];

function flash(splitInput, i, j, flashedThisStep) {
  let newFlashes = 0;
  if (i > 0) {
    if (!flashedThisStep[[i - 1, j]]) {
      splitInput[i - 1][j] += 1;
      if (splitInput[i - 1][j] === 10) {
        // flash, recurr
        flashedThisStep[[i - 1, j]] = true;
        newFlashes += 1;
        const additionalFlashes = flash(splitInput, i - 1, j, flashedThisStep);
        newFlashes += additionalFlashes;
        splitInput[i - 1][j] = 0;
      }
    }
    if (j > 0 && !flashedThisStep[[i - 1, j - 1]]) {
      splitInput[i - 1][j - 1] += 1;
      if (splitInput[i - 1][j - 1] === 10) {
        // flash, recurr
        flashedThisStep[[i - 1, j - 1]] = true;
        newFlashes += 1;
        const additionalFlashes = flash(splitInput, i - 1, j - 1, flashedThisStep);
        newFlashes += additionalFlashes;
        splitInput[i - 1][j - 1] = 0;
      }
    }
    if (j < splitInput[i].length - 1 && !flashedThisStep[[i - 1, j + 1]]) {
      splitInput[i - 1][j + 1] += 1;
      if (splitInput[i - 1][j + 1] === 10) {
        // flash, recurr
        flashedThisStep[[i - 1, j + 1]] = true;
        newFlashes += 1;
        const additionalFlashes = flash(splitInput, i - 1, j + 1, flashedThisStep);
        newFlashes += additionalFlashes;
        splitInput[i - 1][j + 1] = 0;
      }
    }
  }
  if (j < splitInput[i].length - 1 && !flashedThisStep[[i, j + 1]]) {
    splitInput[i][j + 1] += 1;
    if (splitInput[i][j + 1] === 10) {
      // flash, recurr
      flashedThisStep[[i, j + 1]] = true;
      newFlashes += 1;
      const additionalFlashes = flash(splitInput, i, j + 1, flashedThisStep);
      newFlashes += additionalFlashes;
      splitInput[i][j + 1] = 0;
    }
  }
  if (j > 0 && !flashedThisStep[[i, j - 1]]) {
    splitInput[i][j - 1] += 1;
    if (splitInput[i][j - 1] === 10) {
      // flash, recurr
      flashedThisStep[[i, j - 1]] = true;
      newFlashes += 1;
      const additionalFlashes = flash(splitInput, i, j - 1, flashedThisStep);
      newFlashes += additionalFlashes;
      splitInput[i][j - 1] = 0;
    }
  }
  if (i < splitInput.length - 1) {
    if (!flashedThisStep[[i + 1, j]]) {
      splitInput[i + 1][j] += 1;
      if (splitInput[i + 1][j] === 10) {
        // flash, recurr
        flashedThisStep[[i + 1, j]] = true;
        newFlashes += 1;
        const additionalFlashes = flash(splitInput, i + 1, j, flashedThisStep);
        newFlashes += additionalFlashes;
        splitInput[i + 1][j] = 0;
      }
    }
    if (j > 0 && !flashedThisStep[[i + 1, j - 1]]) {
      splitInput[i + 1][j - 1] += 1;
      if (splitInput[i + 1][j - 1] === 10) {
        // flash, recurr
        flashedThisStep[[i + 1, j - 1]] = true;
        newFlashes += 1;
        const additionalFlashes = flash(splitInput, i + 1, j - 1, flashedThisStep);
        newFlashes += additionalFlashes;
        splitInput[i + 1][j - 1] = 0;
      }
    }
    if (j < splitInput[i].length - 1 && !flashedThisStep[[i + 1, j + 1]]) {
      splitInput[i + 1][j + 1] += 1;
      if (splitInput[i + 1][j + 1] === 10) {
        // flash, recurr
        flashedThisStep[[i + 1, j + 1]] = true;
        newFlashes += 1;
        const additionalFlashes = flash(splitInput, i + 1, j + 1, flashedThisStep);
        newFlashes += additionalFlashes;
        splitInput[i + 1][j + 1] = 0;
      }
    }
  }
  return newFlashes;
}

function reddit1() {
  const splitInput = input.map((line) => (
    line.toString().split('').map((stringedNumber) => (
      parseInt(stringedNumber, 10)
    ))
  ));
  let flashes = 0;
  let step = 1;
  let flashedThisStep = [];
  while (step < 101) {
    for (let i = 0; i < splitInput.length; i++) {
      for (let j = 0; j < splitInput[i].length; j++) {
        if (!flashedThisStep[[i, j]]) {
          splitInput[i][j] += 1;
          if (splitInput[i][j] === 10) {
            // flash
            flashedThisStep[[i, j]] = true;
            flashes += 1;
            const additionalFlashes = flash(splitInput, i, j, flashedThisStep, flashes);
            flashes += additionalFlashes;
            splitInput[i][j] = 0;
          }
        }
      }
    }
    flashedThisStep = [];
    step++;
  }
  console.log('Part 1: ', flashes);
};

function reddit2() {
  const splitInput = input.map((line) => (
    line.toString().split('').map((stringedNumber) => (
      parseInt(stringedNumber, 10)
    ))
  ));
  let flashes = 0;
  let step = 1;
  let flashedThisStep = [];
  while (Object.keys(flashedThisStep).length !== 100) {
    flashedThisStep = [];
    for (let i = 0; i < splitInput.length; i++) {
      for (let j = 0; j < splitInput[i].length; j++) {
        if (!flashedThisStep[[i, j]]) {
          splitInput[i][j] += 1;
          if (splitInput[i][j] === 10) {
            // flash
            flashedThisStep[[i, j]] = true;
            flashes += 1;
            const additionalFlashes = flash(splitInput, i, j, flashedThisStep, flashes);
            flashes += additionalFlashes;
            splitInput[i][j] = 0;
          }
        }
      }
    }
    step++;
  }
  console.log('Part 2: ', step - 1);
};

reddit1();
reddit2();
