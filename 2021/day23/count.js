const fs = require('fs');

function parseFile(file) {
  const lines = file.split('\n');
  const parsedLines = lines.slice(2).map((line) => (
    line.split('').filter((character) => (
      ['A', 'B', 'C', 'D'].includes(character)
    ))
  ));
  const currentPositions = parsedLines.filter((array) => array.length);
  const rooms = [];
  const depthOfRooms = currentPositions.length;
  const numberOfRooms = currentPositions[0].length;
  for (let j = 0; j < numberOfRooms; j++) {
    let newRoom = []
    for (let i = 0; i < depthOfRooms; i++) {
      newRoom.push(currentPositions[i][j]);
    }
    rooms.push(newRoom);
    newRoom = [];
  }
  const corridor = lines.slice(1, 2).flatMap((line) => (
    line.split('').filter((character) => (
      character === '.'
    ))
  ));
  return { corridor, rooms, depthOfRooms }
}

function checkStateIsFinishedState(input) {
  const { rooms, depthOfRooms } = input;
  if (rooms[0].every((amphipod) => amphipod === 'A') && rooms[0].length === depthOfRooms) {
    if (rooms[1].every((amphipod) => amphipod === 'B') && rooms[1].length === depthOfRooms) {
      if (rooms[2].every((amphipod) => amphipod === 'C') && rooms[2].length === depthOfRooms) {
        if (rooms[3].every((amphipod) => amphipod === 'D') && rooms[3].length === depthOfRooms) {
          return true;
        }
      }
    }
  }
  return false;
}

function findKeyOfValue(map, searchValue) {
  for (let [key, value] of map.entries()) {
    if (value === searchValue) {
      return key;
    }
  }
}

function startToMove(input) {
  const costOfMoving = new Map([[JSON.stringify(input), 0]]);
  const totalCostOfMoving = new Map();
  const targetRooms = new Map([['A', 0], ['B', 1], ['C', 2], ['D', 3]]);
  const targetCorridor = new Map([['A', 2], ['B', 4], ['C', 6], ['D', 8]]);
  const costToMoveAmphipod = new Map([['A', 1], ['B', 10], ['C', 100], ['D', 1000]]);
  const statusesToCheck = [input];
  while (statusesToCheck.length > 0) {
    const currentStatus = statusesToCheck.shift();
    const currentCostOfMoving = costOfMoving.get(JSON.stringify(currentStatus));
    const hasFinished = checkStateIsFinishedState(currentStatus);
    if (hasFinished) {
      totalCostOfMoving.set(currentCostOfMoving, JSON.stringify(currentStatus));
    } else {
      // move some amphipods
      // start in the corridor, if we can move into the rooms, we'll do it, iterate and find amphipod
      const { corridor, rooms, depthOfRooms } = currentStatus;
      for (let location = 0; location < corridor.length; location++) {
        const amphipod = corridor[location];
        if (amphipod !== '.') {
          // there's an amphipod here, can we move it into its target room?
          const targetRoom = targetRooms.get(amphipod);
          // is it full already?
          const numberInTargetRoom = rooms[targetRoom].length;
          if (numberInTargetRoom === depthOfRooms) {
            // full, can't move this amphipod, move onto next space in corridor
            continue;
          } else if (rooms[targetRoom].some((animal) => animal !== amphipod)) {
            // there are some amphipods in the room that aren't supposed to be there, can't move
            continue;
          }
          // we can move, where do we need to go?
          const indexOfTargetRoomInCorridor = targetCorridor.get(amphipod);
          // left or right
          const direction = location < indexOfTargetRoomInCorridor ? 1 : -1;
          let newPosition = location;
          let hitAmphipod = false;
          let costOfMovement = 0;
          const costToMoveThisAmphipod = costToMoveAmphipod.get(amphipod);
          // move one space at a time
          while (newPosition !== indexOfTargetRoomInCorridor) {
            newPosition += direction;
            if (corridor[newPosition] !== '.') {
              hitAmphipod = true;
              break;
            }
            costOfMovement += costToMoveThisAmphipod;
          }
          if (hitAmphipod) {
            // illegal move, can't move through amphipods
            continue;
          }
          // we are now outside of the room, how far does the amphipod need to drop?
          const dropHeight = depthOfRooms - numberInTargetRoom;
          costOfMovement += dropHeight * costToMoveThisAmphipod;
          const clonedState = JSON.parse(JSON.stringify(currentStatus));
          clonedState.rooms[targetRoom] = [amphipod, ...clonedState.rooms[targetRoom]];
          clonedState.corridor[location] = '.';
          const newCost = currentCostOfMoving + costOfMovement;
          const originalCostForThisState = costOfMoving.get(JSON.stringify(clonedState)) || Infinity;
          if (newCost < originalCostForThisState) {
            costOfMoving.set(JSON.stringify(clonedState), newCost);
            statusesToCheck.push(clonedState);
          }
        }
      }
      // now look in the rooms, if we can move out of the rooms, we'll do it
      for (let roomNumber = 0; roomNumber < rooms.length; roomNumber++) {
        const currentRoomOccupants = rooms[roomNumber];
        let occupantsAllowed = findKeyOfValue(targetRooms, roomNumber);
        if (currentRoomOccupants.every((occupant) => occupant === occupantsAllowed)) {
          // rooms empty, or everything is where it should be, nothing to move
          continue;
        }
        const newPlacesToMoveAmphipodAndCosts = new Map();
        // we move out of the room, and could go left or right
        let movesOutOfTheRoom = depthOfRooms - currentRoomOccupants.length + 1;
        // go left
        let newPosition = targetCorridor.get(occupantsAllowed) - 1;
        while (newPosition >= 0) {
          if (corridor[newPosition] !== '.') {
            break;
          }
          movesOutOfTheRoom++;
          newPlacesToMoveAmphipodAndCosts.set(newPosition, movesOutOfTheRoom);
          newPosition--;
        }
        // reset back to room
        movesOutOfTheRoom = depthOfRooms - currentRoomOccupants.length + 1;
        // go right
        newPosition = targetCorridor.get(occupantsAllowed) + 1;
        while (newPosition < corridor.length) {
          if (corridor[newPosition] !== '.') {
            break;
          }
          movesOutOfTheRoom++;
          newPlacesToMoveAmphipodAndCosts.set(newPosition, movesOutOfTheRoom);
          newPosition++;
        }
        const validNewPositions = new Map(
          [...newPlacesToMoveAmphipodAndCosts]
            .filter(([position]) => ![...targetCorridor.values()].includes(position))
        );
        validNewPositions.forEach((moves, position) => {
          const clonedState = JSON.parse(JSON.stringify(currentStatus));
          // remove amphipod from room
          const amphipodMoved = clonedState.rooms[roomNumber].shift();
          clonedState.corridor[position] = amphipodMoved;
          const costToMoveThisAmphipod = costToMoveAmphipod.get(amphipodMoved);
          const newCost = currentCostOfMoving + (moves * costToMoveThisAmphipod);
          const originalCostForThisState = costOfMoving.get(JSON.stringify(clonedState)) || Infinity;
          if (newCost < originalCostForThisState) {
            costOfMoving.set(JSON.stringify(clonedState), newCost);
            statusesToCheck.push(clonedState);
          }
        });
      }
    }
  }
  return totalCostOfMoving;
}


console.log('------ TESTING PART 1------');
console.log(startToMove(parseFile(fs.readFileSync('./example.txt').toString())));
console.log('------------');

console.log('------ REAL PART 1------');
console.log(startToMove(parseFile(fs.readFileSync('./data.txt').toString())));
console.log('------------');

console.log('------ TESTING PART 2------');
console.log(startToMove(parseFile(fs.readFileSync('./example2.txt').toString())));
console.log('------------');

console.log('------ REAL PART 2------');
console.log(startToMove(parseFile(fs.readFileSync('./data2.txt').toString())));
console.log('------------');
