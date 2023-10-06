import { createBoardUI, updateCellColor } from "./battleshipUserInterface.mjs";

const createShip = (length) => {
  const stats = {
    length: length,
    timesHit: 0,
    sunk: false,
  };

  const hit = () => {
    stats.timesHit += 1;
  };

  const isSunk = () => {
    if (stats.timesHit === stats.length) {
      stats.sunk = true;
    }
  };

  return { hit, isSunk, stats };
};

const createShips = () => {
  const carrier = createShip(5);
  const battleship = createShip(4);
  const destroyer = createShip(3);
  const submarine = createShip(2);
  const patrolBoat = createShip(1);

  return { carrier, battleship, destroyer, submarine, patrolBoat };
};

const createGameBoard = () => {
  const missedCoordinates = [];
  const hitCoordinates = [];
  const shipCoordinates = [];

  const placeShips = (x, y, shipType, orientation) => {
    let coordinates = [];

    if (orientation == "horizontal") {
      for (let index = 0; index < shipType.stats.length; index++) {
        coordinates.push([x + index, y]);
        shipCoordinates.push([x + index, y]);
      }
    }
    if (orientation == "vertical") {
      for (let index = 0; index < shipType.stats.length; index++) {
        coordinates.push([x, y + index]);
        shipCoordinates.push([x, y + index]);
      }
    }
    return (shipType.coordinates = coordinates);
  };

  const receiveAttack = (x, y, gameShipsData) => {
    const ships = gameShipsData;
    const targetCoordinate = [x, y];
    const findCoordinate = (targetCoordinate, ships) => {
      const shipName = Object.keys(ships).find((shipName) => {
        const ship = ships[shipName];
        return (
          ship.coordinates &&
          ship.coordinates.some(
            (coord) =>
              coord[0] === targetCoordinate[0] &&
              coord[1] === targetCoordinate[1]
          )
        );
      });
      return shipName || null; // Coordinate not found in any ship
    };

    const result = findCoordinate(targetCoordinate, ships);

    if (result) {
      ships[result].hit();
      hitCoordinates.push(targetCoordinate);
      return "Hit!";
    } else {
      missedCoordinates.push(targetCoordinate);
      return "Miss!";
    }
  };

  const checkIfAllShipsAreSunk = () => {
    if (hitCoordinates.length == 15) {
      return true;
    }
    return false;
  };

  return {
    placeShips,
    receiveAttack,
    missedCoordinates,
    hitCoordinates,
    shipCoordinates,
    checkIfAllShipsAreSunk,
  };
};

const createPlayer = (name) => {
  const attack = (boardToAttack, xCoordinate, yCoordinate, enemyShips) => {
    return boardToAttack.receiveAttack(xCoordinate, yCoordinate, enemyShips);
  };

  const generateRandomMove = (boardToAttack) => {
    let x, y, isCoordinateInMissed, isCoordinateInHit;
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);

      isCoordinateInMissed = boardToAttack.hitCoordinates.some(
        (coordinate) => coordinate[0] === x && coordinate[1] === y
      );
      isCoordinateInHit = boardToAttack.missedCoordinates.some(
        (coordinate) => coordinate[0] === x && coordinate[1] === y
      );
    } while (isCoordinateInMissed || isCoordinateInHit);
    return [x, y];
  };

  // const computerAttack = (boardToAttack, enemyShips) => {

  //   return attack(
  //     boardToAttack,
  //     coordinatesToAttack[0],
  //     coordinatesToAttack[1],
  //     enemyShips
  //   );
  // };

  return { name, attack, generateRandomMove };
};


export { createShips, createGameBoard, createPlayer };
