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

export { Ships };
