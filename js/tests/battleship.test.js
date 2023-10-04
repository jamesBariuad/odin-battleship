import { createShips, createGameBoard, createPlayer } from "../functions/battleship";

describe("ships factory functions", () => {
  let testShips;
  beforeEach(() => {
    testShips = createShips();
  });

  test("ship hit", () => {
    testShips.battleship.hit();
    expect(testShips.battleship.stats.timesHit).toBe(1);
  });

  test("ship sunk", () => {
    testShips.patrolBoat.hit();
    testShips.patrolBoat.isSunk();
    expect(testShips.patrolBoat.stats.sunk).toBe(true);
  });
});

describe("gameboard test functions", () => {
  let testBoard, testShips, submarine, battleship;
  beforeEach(() => {
    testBoard = createGameBoard();
    testShips = createShips();
    submarine = testShips.submarine;
    battleship = testShips.battleship;
  });

  test("placing a ship", () => {
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
    testBoard.placeShips(5, 5, submarine, "vertical");
    expect(testBoard.receiveAttack(5, 5, testShips)).toBe("Hit!");
    expect(submarine.stats.timesHit).toBe(1);
  });

  test("receiveAttackMissed", () => {
    testBoard.placeShips(5, 5, submarine, "vertical");
    expect(testBoard.receiveAttack(9, 9, testShips)).toBe("Miss!");
    expect(testBoard.missedCoordinates).toStrictEqual([[9, 9]]);
  });
});

describe('player test functions', ()=> {
  let playerBoard, enemyBoard, player, computer, playerShips, computerShips;
  beforeEach(() => {
    playerBoard = createGameBoard();
    enemyBoard = createGameBoard();
    player = createPlayer("James");
    computer = createPlayer("computer");
    playerShips = createShips();
    computerShips = createShips();
  });


  test("player can take turns in attacking enemy board", () => {
  
    const playerMove = player.attack(enemyBoard, 0, 0, computerShips);
    expect(playerMove).toBe("Miss!"||"Hit!");
  
    const computerMove = computer.attack(playerBoard, 0, 0, playerShips);
    expect(computerMove).toBe("Miss!"||"Hit!");
  });

  test('computer can make a legal random move', ()=>{
    const computerMove = computer.computerAttack(playerBoard, playerShips)
    expect(computerMove).toBe("Miss!"||"Hit!");
  })  
  
})


