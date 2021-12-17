const fs = require('fs');

const test1 = 'D2FE28';
const test2 = '38006F45291200';
const test3 = 'EE00D40C823060';
const test4 = '8A004A801A8002F478';
const test5 = '620080001611562C8802118E34';
const test6 = 'C0015000016115A2E0802F182340';
const test7 = 'A0016C880162017C3686B18A3D4780';

const test1a = 'C200B40A82';
const test2a = '04005AC33890';
const test3a = '880086C3E88112';
const test4a = 'CE00C43D881120';
const test5a = 'D8005AC2A8F0';
const test6a = 'F600BC2D8F';
const test7a = '9C005AC2F8F0';
const test8a = '9C0141080250320F1802104A08';

function hexCharToBin(c) {
  let out = '';
  switch (c) {
    case '0': out += "0000"; break;
    case '1': out += "0001"; break;
    case '2': out += "0010"; break;
    case '3': out += "0011"; break;
    case '4': out += "0100"; break;
    case '5': out += "0101"; break;
    case '6': out += "0110"; break;
    case '7': out += "0111"; break;
    case '8': out += "1000"; break;
    case '9': out += "1001"; break;
    case 'a': out += "1010"; break;
    case 'b': out += "1011"; break;
    case 'c': out += "1100"; break;
    case 'd': out += "1101"; break;
    case 'e': out += "1110"; break;
    case 'f': out += "1111"; break;
    default: return "";
  }
  return out;
}

function hexToBin(input) {
  let finalString = '';
  for (let i = 0; i < input.length; i++) {
    finalString += hexCharToBin(input[i].toLowerCase());
  }
  return finalString;
}

function parseLiteralString(input, processed, number = '') {
  let processedCopy = processed;
  processedCopy += 5;
  let numberCopy = number;
  if (input.startsWith('0')) {
    // last number
    return { number: `${numberCopy}${input.substr(1, 4)}`, processedLiteral: processedCopy };
  } else {
    // not last number
    numberCopy += input.substr(1, 4);
    // recur
    return parseLiteralString(input.substr(5), processedCopy, numberCopy)
  }
}

function parseBinString(input, processedSubpacketLength = 0, trackVersions = {}) {
  const version = parseInt(input.substr(0, 3), 2);
  trackVersions[Math.random()] = version;
  const typeId = parseInt(input.substr(3, 3), 2);
  processedSubpacketLength += 6;
  if (typeId === 4) {
    // literal
    const literalBits = input.substring(6);
    return parseLiteralString(literalBits, processedSubpacketLength);
  }
  const lengthTypeId = parseInt(input.substr(6, 1), 2);
  processedSubpacketLength += 1;
  if (lengthTypeId === 1) {
    const numberOfSubPackets = parseInt(input.substr(7, 11), 2);
    processedSubpacketLength += 11;
    let subPacketsToParse = input.substr(18);
    let numbers = '';
    for (let i = 0; i < numberOfSubPackets; i++) {
      const { number, processedLiteral } = parseBinString(subPacketsToParse, 0, trackVersions);
      processedSubpacketLength += processedLiteral;
      numbers += ',' + number;
      subPacketsToParse = subPacketsToParse.substr(processedLiteral);
    }
    return { number: numbers, processedLiteral: processedSubpacketLength, raw: trackVersions, trackVersions: Object.values(trackVersions).reduce((partialSum, a) => partialSum + a, 0) };
  } else {
    const totalLengthInBitsOfSubpackets = parseInt(input.substr(7, 15), 2);
    processedSubpacketLength += 15;
    let subPacketsToParse = input.substr(22);
    let subPacketsParsed = 0;
    let numbersToParse = '';
    while (subPacketsParsed < totalLengthInBitsOfSubpackets) {
      const { number, processedLiteral } = parseBinString(subPacketsToParse, 0, trackVersions);
      processedSubpacketLength += processedLiteral;
      subPacketsParsed += subPacketsToParse.length - subPacketsToParse.substr(processedLiteral).length;
      subPacketsToParse = subPacketsToParse.substr(processedLiteral);
      numbersToParse += ',' + number;
    }
    return { number: numbersToParse, processedLiteral: processedSubpacketLength, raw: trackVersions, trackVersions: Object.values(trackVersions).reduce((partialSum, a) => partialSum + a, 0) };
  }
}

function workOutValues(flag, number) {
  let result;
  switch (flag) {
    case 'sum': {
      result = 0;
      number.forEach((binary) => {
        result += parseInt(binary, 2);
      });
      break;
    }
    case 'product': {
      result = 1;
      number.forEach((binary) => {
        result *= parseInt(binary, 2);
      });
      break;
    }
    case 'minimum': {
      result = Infinity;
      number.forEach((binary) => {
        if (parseInt(binary, 2) < result) {
          result = parseInt(binary, 2);
        }
      });
      break;
    }
    case 'maximum': {
      result = -Infinity;
      number.forEach((binary) => {
        if (parseInt(binary, 2) > result) {
          result = parseInt(binary, 2);
        }
      });
      break;
    }
    case 'greater': {
      const [firstSubpacket, secondSubpacket] = number;
      if (parseInt(firstSubpacket, 2) > parseInt(secondSubpacket, 2)) {
        result = 1;
      } else {
        result = 0;
      }
      break;
    }
    case 'less': {
      const [firstSubpacket, secondSubpacket] = number;
      if (parseInt(firstSubpacket, 2) < parseInt(secondSubpacket, 2)) {
        result = 1;
      } else {
        result = 0;
      }
      break;
    }
    case 'equal': {
      const half = Math.ceil(number.length / 2);
      const firstHalf = number.slice(0, half);
      const secondHalf = number.slice(-half);
      if (parseInt(firstHalf, 2) === parseInt(secondHalf, 2)) {
        result = 1;
      } else {
        result = 0;
      }
      break;
    }
    default:
      console.log('NOPE');
      break;
  }
  return { result, flag };
}

function parseBinStringPart2(input, processedSubpacketLength = 0, trackVersions = {}) {
  let flag;
  const version = parseInt(input.substr(0, 3), 2);
  trackVersions[Math.random()] = version;
  const typeId = parseInt(input.substr(3, 3), 2);
  processedSubpacketLength += 6;
  if (typeId === 0) {
    // sum packet
    flag = 'sum';
  } else if (typeId === 1) {
    // product
    flag = 'product';
  } else if (typeId === 2) {
    flag = 'minimum';
  } else if (typeId === 3) {
    flag = 'maximum';
  } else if (typeId === 4) {
    // literal
    const literalBits = input.substring(6);
    return parseLiteralString(literalBits, processedSubpacketLength);
  } else if (typeId === 5) {
    flag = 'greater';
  } else if (typeId === 6) {
    flag = 'less';
  } else if (typeId === 7) {
    flag = 'equal';
  }
  const lengthTypeId = parseInt(input.substr(6, 1), 2);
  processedSubpacketLength += 1;
  if (lengthTypeId === 1) {
    const numberOfSubPackets = parseInt(input.substr(7, 11), 2);
    processedSubpacketLength += 11;
    let subPacketsToParse = input.substr(18);
    let numbers = {};
    for (let i = 0; i < numberOfSubPackets; i++) {
      const { number, processedLiteral, flag: earlierFlag } = parseBinStringPart2(subPacketsToParse, 0, trackVersions);
      processedSubpacketLength += processedLiteral;
      if (earlierFlag) {
        const nestedNumber = workOutValues(earlierFlag, number).result.toString(2);
        numbers[`Subpacket-${i}`] = nestedNumber;
      } else {
        numbers[`Subpacket-${i}`] = number;
      }
      subPacketsToParse = subPacketsToParse.substr(processedLiteral);
    }
    return { number: Object.values(numbers), processedLiteral: processedSubpacketLength, raw: trackVersions, trackVersions: Object.values(trackVersions).reduce((partialSum, a) => partialSum + a, 0), flag };
  } else {
    const totalLengthInBitsOfSubpackets = parseInt(input.substr(7, 15), 2);
    processedSubpacketLength += 15;
    let subPacketsToParse = input.substr(22);
    let subPacketsParsed = 0;
    let numbersToParse = {};
    while (subPacketsParsed < totalLengthInBitsOfSubpackets) {
      const { number, processedLiteral, flag: earlierFlag } = parseBinStringPart2(subPacketsToParse, 0, trackVersions);
      processedSubpacketLength += processedLiteral;
      if (earlierFlag) {
        const nestedNumber = workOutValues(earlierFlag, number).result.toString(2);
        numbersToParse[`Subpacket-${processedSubpacketLength}`] = nestedNumber;
      } else {
        numbersToParse[`Subpacket-${processedSubpacketLength}`] = number;
      }
      subPacketsParsed += subPacketsToParse.length - subPacketsToParse.substr(processedLiteral).length;
      subPacketsToParse = subPacketsToParse.substr(processedLiteral);
    }
    return { number: Object.values(numbersToParse), processedLiteral: processedSubpacketLength, raw: trackVersions, trackVersions: Object.values(trackVersions).reduce((partialSum, a) => partialSum + a, 0), flag };
  }
}

function part1(input) {
  const parsed = hexToBin(input);
  return parseBinString(parsed).trackVersions;
}

function part2(input) {
  const parsed = hexToBin(input);
  const { flag, number } = parseBinStringPart2(parsed);
  return workOutValues(flag, number);
}

console.log('------TESTING---------');
console.log(part1(test1));
console.log(part1(test2));
console.log(part1(test3));
console.log(part1(test4));
console.log(part1(test5));
console.log(part1(test6));
console.log(part1(test7));
console.log('---------------------');

// Part 1
console.log('Part 1 ', part1(fs.readFileSync('./data.txt').toString()));

console.log('------TESTING---------');
console.log(part2(test1a));
console.log(part2(test2a));
console.log(part2(test3a));
console.log(part2(test4a));
console.log(part2(test5a));
console.log(part2(test6a));
console.log(part2(test7a));
console.log(part2(test8a));
console.log(part2('8001620001650320E00016104A08'));
console.log('---------------------');

// Part 2
console.log('Part 2 ', part2(fs.readFileSync('./data.txt').toString()));
