import { Ships, GameBoard } from "./battleship";

test("ship hit", () => {
  const testShips = Ships();
  testShips.battleship.hit();
  expect(testShips.battleship.stats.timesHit).toBe(1);
});

test("ship sunk", () => {
  const testShips = Ships();
  testShips.patrolBoat.hit();
  testShips.patrolBoat.isSunk();
  expect(testShips.patrolBoat.stats.sunk).toBe(true);
});

test("placing a ship", () => {
  const testBoard = GameBoard();
  const testShips = Ships();
  const battleship = testShips.battleship;
  const submarine = testShips.submarine;
  testBoard.placeShips(0, 0, battleship, "horizontal");
  testBoard.placeShips(5, 5, submarine, "vertical");
  expect(battleship.coordinates).toStrictEqual([
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ]);
  expect(submarine.coordinates).toStrictEqual([
    [5, 5],
    [5, 6],
  ]);
});

test("receiveAttackHit", () => {
  const testBoard = GameBoard();
  const testShips = Ships();
  const submarine = testShips.submarine;
  testBoard.placeShips(5, 5, submarine, "vertical");
  expect(testBoard.receiveAttack(5, 5, testShips)).toBe("Hit!");
  expect(submarine.stats.timesHit).toBe(1);
});

test("receiveAttackMissed", () => {
  const testBoard = GameBoard();
  const testShips = Ships();
  const submarine = testShips.submarine;
  testBoard.placeShips(5, 5, submarine, "vertical");
  expect(testBoard.receiveAttack(9, 9, testShips)).toBe("Miss!");
  expect(testBoard.missedCoordinates).toStrictEqual([[9,9]])
});
