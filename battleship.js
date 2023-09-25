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

const Ships = () => {
  const carrier = createShip(5);
  const battleship = createShip(4);
  const destroyer = createShip(3);
  const submarine = createShip(2);
  const patrolBoat = createShip(1);

  return { carrier, battleship, destroyer, submarine, patrolBoat };
};

const GameBoard = () => {
  const missedCoordinates = [];
  const hitCoordinates = [];

  const placeShips = (x, y, shipType, orientation) => {
    let coordinates = [];
    if (orientation == "horizontal") {
      for (let index = 0; index < shipType.stats.length; index++) {
        coordinates.push([x + index, y]);
      }
    }
    if (orientation == "vertical") {
      for (let index = 0; index < shipType.stats.length; index++) {
        coordinates.push([x, y + index]);
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
      checkIfAllShipsAreSunk()
      return "Hit!";
    } else {
      missedCoordinates.push(targetCoordinate);
      return "Miss!";
    }
  };

  const checkIfAllShipsAreSunk = () => {
    if (hitCoordinates.length==15){
      return 'All ships sunk!'
    }
    return 
  };

  return { placeShips, receiveAttack, missedCoordinates };
};

export { Ships, GameBoard };
