import {
  createBoardUI,
  
} from "./battleshipUserInterface.mjs";

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
    return;
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

  const computerAttack = (boardToAttack, enemyShips) => {
    let x, y, isCoordinateInMissed, isCoordinateInHit;
    const generateRandomMove = () => {
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

    const coordinatesToAttack = generateRandomMove();
    return attack(
      boardToAttack,
      coordinatesToAttack[0],
      coordinatesToAttack[1],
      enemyShips
    );
  };

  return { name, attack, computerAttack };
};

const gameFlow = () => {
  const playerBoardUI = document.querySelector("#player-board");
  const enemyBoardUI = document.querySelector("#enemy-board");
  const player = createPlayer("player");
  const enemy = createPlayer("enemy");
  const playerShips = createShips();
  const enemyShips = createShips();
  const playerBoard = createGameBoard();
  const enemyBoard = createGameBoard();

  playerBoard.placeShips(0, 0, playerShips.battleship, "vertical");
  playerBoard.placeShips(1, 0, playerShips.carrier, "vertical");
  playerBoard.placeShips(2, 0, playerShips.destroyer, "vertical");
  playerBoard.placeShips(3, 0, playerShips.patrolBoat, "vertical");
  playerBoard.placeShips(4, 0, playerShips.submarine, "vertical");

  enemyBoard.placeShips(0, 0, enemyShips.battleship, "horizontal");
  enemyBoard.placeShips(0, 1, enemyShips.carrier, "horizontal");
  enemyBoard.placeShips(0, 2, enemyShips.destroyer, "horizontal");
  enemyBoard.placeShips(0, 3, enemyShips.patrolBoat, "horizontal");
  enemyBoard.placeShips(0, 4, enemyShips.submarine, "horizontal");

  createBoardUI("player", playerBoard, playerShips, playerBoardUI);
  createBoardUI("enemy", enemyBoard, enemyShips, enemyBoardUI);

  // let playerToAttack = 'Player'
  // const takeTurns = () => {
  //   ///first turn player
  //   player.attack(enemyBoard,x,y,enemyShips) =='Hit!'

  //   //alternate between player and computer
  //   //repeat until all ships are sunk
  // }
};
gameFlow();

export { createShips, createGameBoard, createPlayer };
