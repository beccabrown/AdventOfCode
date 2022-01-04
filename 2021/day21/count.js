const input = 'Player 1 starting position: 6, Player 2 starting position: 7';
const practiceInput = 'Player 1 starting position: 4, Player 2 starting position: 8';

function rollDice(lastDiceRoll) {
  const sum = (lastDiceRoll * 3) + 6;
  const newLastDiceRoll = lastDiceRoll + 3;
  return { sum, newLastDiceRoll };
}

function playTheGame(player1Start, player2Start) {
  let player1Score = 0;
  let player2Score = 0;
  let player1Position = player1Start;
  let player2Position = player2Start;
  let lastDiceRoll = 0;
  let numberOfTimesDiceRolled = 0;
  while (player1Score < 1000 && player2Score < 1000) {
    let { sum, newLastDiceRoll } = rollDice(lastDiceRoll);
    numberOfTimesDiceRolled += 3;
    lastDiceRoll = newLastDiceRoll;
    player1Position = 1 + (player1Position + sum - 1) % 10;
    player1Score += player1Position;
    if (player1Score >= 1000) break;
    const player2Roll = rollDice(lastDiceRoll);
    numberOfTimesDiceRolled += 3;
    sum = player2Roll.sum;
    newLastDiceRoll = player2Roll.newLastDiceRoll;
    lastDiceRoll = newLastDiceRoll;
    player2Position = 1 + (player2Position + sum - 1) % 10;
    player2Score += player2Position;
  }
  return { player1Score, player2Score, numberOfTimesDiceRolled };
}

console.log(playTheGame(4, 8));
console.log(playTheGame(6, 7));

// possible sums of 3 dice and number of ways you can hit it
const sums = new Map();
sums.set(3, 1);
sums.set(4, 3);
sums.set(5, 6);
sums.set(6, 7);
sums.set(7, 6);
sums.set(8, 3);
sums.set(9, 1);

const gameState = [];

function playDiracDice(player1Position, player2Position, player1Score, player2Score) {
  // player 2 score will be player 1 score on recurrsive call and vice versa. We swap the 'wins' over on line 66
  if (player2Score >= 21) return [0, 1];
  const cachedState = gameState[[player1Position, player2Position, player1Score, player2Score]];
  if (cachedState) {
    // got this state already, know how many wins have happened in this state already
    return cachedState;
  }
  let wins = [0, 0];
  [...sums.keys()].forEach((sum) => {
    const numberOfWays = sums.get(sum);
    // player 1 turn
    let newPlayerPosition = 1 + (player1Position + sum - 1) % 10;
    let newPlayerScore = player1Score + newPlayerPosition;
    // player 2 turn
    let player2Turn = playDiracDice(player2Position, newPlayerPosition, player2Score, newPlayerScore);
    wins[0] += player2Turn[1] * numberOfWays;
    wins[1] += player2Turn[0] * numberOfWays;
  });

  gameState[[player1Position, player2Position, player1Score, player2Score]] = wins;
  return wins;
}

console.log(playDiracDice(4, 8, 0, 0));
console.log(playDiracDice(6, 7, 0, 0));

