import { Ships } from "./battleship";

test("ship hit", () => {
  const testShips = Ships();
  testShips.battleship.hit();
  expect(testShips.battleship.stats.timesHit).toBe(1);
});

test("ship sunk", () => {
  const testShips = Ships();
  testShips.patrolBoat.hit();
  testShips.patrolBoat.isSunk()
  expect(testShips.patrolBoat.stats.sunk).toBe(true);
});
