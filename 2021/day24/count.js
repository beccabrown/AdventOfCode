const fs = require('fs');

function parseFile(file) {
  const lines = file.split('\n');
  const parsedLines = lines.map((line) => (
    line.split(' ')
  ))
  return parsedLines;
}

function followInstructions(instructions, inputNumber) {
  const variables = {
    w: 0,
    x: 0,
    y: 0,
    z: 0,
  }
  let count = 0;
  instructions.forEach((instruction) => {
    const [command, part1, varOrNumber] = instruction;
    let variable = varOrNumber;
    const part2Parsed = parseInt(varOrNumber, 10);
    const isPart2NotANumber = isNaN(part2Parsed);
    if (isPart2NotANumber) variable = variables[varOrNumber];
    switch (command) {
      case 'inp':
        variables[part1] = parseInt(inputNumber[count], 10);
        count++;
        break;
      case 'mul':
        variables[part1] *= parseInt(variable, 10);
        break;
      case 'eql':
        variables[part1] = variables[part1] === parseInt(variable, 10) ? 1 : 0;
        break;
      case 'add':
        variables[part1] += parseInt(variable, 10);
        break;
      case 'mod':
        variables[part1] = variables[part1] % variable;
        break;
      case 'div':
        variables[part1] = Math.floor(variables[part1] / variable);
        break;
    }
    console.log(variables);
  });
  return variables;
}

function check(input, number) {
  const result = followInstructions(input, number);
  const valid = result.z === 0;
  return { result, valid };
}

// we have:

// inp w              inp w            inp w         inp w      inp w     inp w    inp w     inp w    inp w     inp w     inp w     inp w    inp w       inp w
// mul x 0            mul x 0
// add x z            add x z
// mod x 26           mod x 26
// div z 1            div z 1             1          div z 26   div z 1     1      div z 26  div z 1  div z 26  div z 1   div z 26   26      26           26
// add x 11           add x 12         add x 10      add x -8   add x 15           add x -11 add x 10 add x -3  add x 15  add x -3  add x -1 add x -10   add x -16
// eql x w            eql x w
// eql x 0            eql x 0
// mul y 0            mul y 0
// add y 25           add y 25
// mul y x            mul y x
// add y 1            add y 1
// mul z y            mul z y
// mul y 0            mul y 0
// add y w            add y w
// add y 8            add y 8          add y 12      add y 10   add y 2   add y 8  add y 4   add y 9  add y 10  add y 3   add y 7            add y 2
// mul y x            mul y x
// add z y            add z y

// compiling this down, we have:
// w = input number
// z = z / (1 or 26)
// x = (z % 26) + {something} === input number ? 0 : 1  <- x is always 0 or 1
// y = 26 or 1
// y = (input number + something) * x <- 0 or 1
// z = z * (25 * x + 1)
// z = z + (input number + {something}) * x <- z = z + y

// also, when the second equation is z / 1, then the {something} in the third equation is between 10 and 15, that's never equal to the input number, so x is always 1

// so w = input number
// x = 1
// z = 26z
// z = z + input number + {something}

// conversely, when z / 26, then the {something} in the third equation is between -1 and -11, and this is the last chunk, so we need z to be 0 at the end of this.
// only way this will happen is if y is 0 and x is 0, which boils down to x is 0. So prevZ % 26 + {something} = input number, because we multiply by 26 when x is 1, prevZ = 26z + prev input number + {something} which, mod 26, is prev input number + something + {different something} = input number

// w = input number
// x = 0
// z = z / 26
// prev input number + something = input number - different something

// sooo we'd have (group the div z 1 with next div z 26 and splice out)
// input3 + 12 - 8 = input4 ----> input3 + 4 = input4
// input6 + 8 - 11 = input7 ----> input6 - 3 = input7
// input8 + 9 - 3 = input9 -----> input8 + 6 = input9
// input10 + 3 - 3 = input11 ---> input10 = input11
// input5 + 2 - 1 = input12 ----> input5 + 1 = input12
// input2 + 8 - 10 = input13 ---> input2 - 2 = input13
// input1 + 8 -16 = input14 ----> input1 - 8 = input14


// so, we can find the largest number using these rules
// input1 and input14 have to be 9 and 1 respectively because of the rule, no matter if it's the largest number or not
// so, number is 99598963999971 (start with 99999999999991 and manipulate)
// check in function above


console.log(check(parseFile(fs.readFileSync('./data.txt').toString()), '99598963999971'));

// smallest number now
// so, number is 93151411711211 (start with 91111111111111 and manipulate)
// check in function above

console.log(check(parseFile(fs.readFileSync('./data.txt').toString()), '93151411711211'));
