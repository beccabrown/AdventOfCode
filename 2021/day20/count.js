const fs = require('fs');

function processInput(file) {
  const [algorithm, input] = file.split('\n\n');
  const imageEnhancementAlgorithm = algorithm.split('');
  const inputImage = input.split('\n').map((item) => item.split(''));
  return { imageEnhancementAlgorithm, inputImage };
}

function padImage(image, stringToPadWith) {
  let paddedImage = image;
  paddedImage.map((row) => {
    row.unshift(stringToPadWith);
    row.unshift(stringToPadWith);
    row.push(stringToPadWith);
    row.push(stringToPadWith);
    return row;
  });
  paddedImage.unshift((stringToPadWith).repeat(paddedImage[0].length).split(''));
  paddedImage.unshift((stringToPadWith).repeat(paddedImage[0].length).split(''));
  paddedImage.push((stringToPadWith).repeat(paddedImage[0].length).split(''));
  paddedImage.push((stringToPadWith).repeat(paddedImage[0].length).split(''));
  return paddedImage;
}

function enhanceImage(input, steps) {
  const { imageEnhancementAlgorithm, inputImage } = processInput(input);
  // pad the input image with 2 pixels in each direction each time we enhance,
  // that's enough to determine the result of the enhancement
  let newImage = inputImage;
  // work out if infinity flashes, if so, we need to pad the image with either a . or a #
  const infinityFlashes = imageEnhancementAlgorithm[0] === '#' && imageEnhancementAlgorithm[imageEnhancementAlgorithm.length - 1] === '.'
  for (let s = 0; s < steps; s++) {
    // infinity flashes on each step, so turned off in step 0, turned on in step 1
    if (infinityFlashes) {
      newImage = padImage(newImage, s % 2 === 0 ? '.' : '#');
    } else {
      newImage = padImage(newImage, '.');
    }
    let outputImage = [];
    let row = [];
    // start at top left
    for (let i = 1; i < newImage.length - 1; i++) {
      for (let j = 0; j < newImage[i].length - 2; j++) {
        const bit = [newImage[i - 1].slice(j, j + 3), newImage[i].slice(j, j + 3), newImage[i + 1].slice(j, j + 3)].flat().map((item) => {
          if (item === '.') {
            return 0;
          } else if (item === '#') {
            return 1;
          }
        }).join('');
        const numberToFindInAlgorithm = parseInt(bit, 2);
        const newPixel = imageEnhancementAlgorithm[numberToFindInAlgorithm];
        row.push(newPixel);
      }
      outputImage.push(row);
      row = [];
    }
    newImage = outputImage;
  }
  let count = 0;
  const joinRows = newImage.map((row) => {
    count += (row.join().match(/#/g) || []).length;
    return row.join();
  });
  return { count, newImage: joinRows };
}

console.log('---TESTING---');
console.log(enhanceImage(fs.readFileSync('./example.txt').toString(), 2));
console.log('---------');
console.log('---REAL---');
console.log(enhanceImage(fs.readFileSync('./data.txt').toString(), 2).count);
console.log('---------');
console.log('---TESTING---');
console.log(enhanceImage(fs.readFileSync('./example.txt').toString(), 50).count);
console.log('---------');
console.log('---REAL---');
console.log(enhanceImage(fs.readFileSync('./data.txt').toString(), 50).count);
console.log('---------');

