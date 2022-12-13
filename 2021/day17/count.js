const real = 'target area: x=150..193, y=-136..-86';
const example = 'target area: x=20..30, y=-10..-5';
const github = 'target area: x=201..230, y=-99..-65';

function fireProjectile(velocity, xrange, yrange) {
  let possibilityOfHitting = true;
  // start at [0, 0]
  let newX = 0;
  let newY = 0;
  let highestY = -Infinity;
  let [xVelocity, yVelocity] = velocity;
  const [xmin, xmax] = xrange;
  const [ymin, ymax] = yrange;
  while (possibilityOfHitting) {
    newX += xVelocity;
    newY += yVelocity;
    if (newY > highestY) highestY = newY;
    // drag
    if (xVelocity > 0) {
      xVelocity--;
    } else if (xVelocity < 0) {
      xVelocity++;
    }
    // gravity
    yVelocity--;
    if (newX >= xmin && newX <= xmax && newY >= ymin && newY <= ymax) {
      possibilityOfHitting = false;
      return { hit: true, y: highestY };
    } else if (newX > xmax || newY < ymin) {
      possibilityOfHitting = false;
      return { hit: false, y: -Infinity };
    }
  }
}

function reddit1(input) {
  const [xtargetArea, ytargetArea] = input.split(': ')[1].split(', ');
  const [xmax, xmin] = xtargetArea.split('=')[1].split('..').map((item) => parseInt(item, 10)).sort((a, b) => b - a);
  const [ymax, ymin] = ytargetArea.split('=')[1].split('..').map((item) => parseInt(item, 10)).sort((a, b) => b - a);
  let highestY = -Infinity;
  let validVelocities = [];
  // iterate through 1 -> xmax, any more and we'll overshoot the target area
  for (let x = 1; x <= xmax; x++) {
    // iterate through ymin -> 1000, not sure what the upper bound is
    for (let y = ymin; y < 1000; y++) {
      const { hit, y: yReached } = fireProjectile([x, y], [xmin, xmax], [ymin, ymax]);
      if (hit) {
        validVelocities.push([x, y]);
        if (yReached > highestY) {
          highestY = yReached;
        }
      }
    }
  }
  return { highestY, validVelocities, totalValidVelocities: validVelocities.length };
};

console.log('Part1 example: ', reddit1(example).highestY);
console.log('Part1 real: ', reddit1(real).highestY);
console.log('Part1 real github: ', reddit1(github).highestY);
console.log('Part2 example: ', reddit1(example).totalValidVelocities);
console.log('Part2 real: ', reddit1(real).totalValidVelocities);
console.log('Part2 real github: ', reddit1(github).totalValidVelocities);
