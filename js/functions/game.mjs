import { createBoardUI, updateCellColor } from "./battleshipUserInterface.mjs";
import {
  createShips,
  createGameBoard,
  createPlayer,
} from "./battleshipFactories.mjs";
import {
  createBoardToPlaceShipsUI,
  getOccupiedCoordinates,
} from "./placeShips.mjs";

const placePlayerShips = (playerBoard, playerShips) => {
  const occupiedCoordinates = getOccupiedCoordinates();

  //process occupied coordinates for ease of use
  for (const key in occupiedCoordinates) {
    let shipName = occupiedCoordinates[key];
    const xCoordinate = +occupiedCoordinates[key][0][0];
    const yCoordinate = +occupiedCoordinates[key][0][1];
    const isVertical = shipName[shipName.length - 1];
    let orientation = "vertical";
    if (!isVertical) {
      orientation = "horizontal";
    }
    if (key == "patrol-boat") {
      occupiedCoordinates["patrolBoat"] = occupiedCoordinates["patrol-boat"];
      occupiedCoordinates["patrolBoat"] = {
        x: xCoordinate,
        y: yCoordinate,
        orientation: orientation,
      };
      delete occupiedCoordinates["patrol-boat"];
    }
    const shipDetails = {
      x: xCoordinate,
      y: yCoordinate,
      orientation: orientation,
    };
    occupiedCoordinates[key] = shipDetails;
  }
  delete occupiedCoordinates["patrol-boat"];
  // Place player's ships
  // playerBoard.placeShips(0, 0, playerShips.battleship, "vertical");
  // playerBoard.placeShips(1, 0, playerShips.carrier, "vertical");
  // playerBoard.placeShips(2, 0, playerShips.destroyer, "vertical");
  // playerBoard.placeShips(3, 0, playerShips.patrolBoat, "vertical");
  // playerBoard.placeShips(4, 0, playerShips.submarine, "vertical");

  for (const key in occupiedCoordinates) {
    // console.log(occupiedCoordinates[key])
    const currentShip = [key];


    playerBoard.placeShips(
      occupiedCoordinates[key].x,
      occupiedCoordinates[key].y,
      playerShips[currentShip],
      occupiedCoordinates[key].orientation
    );
  }
  // }
  // playerBoard.placeShips()
  // return playerBoard
};

const initializeGame = () => {
  const playerBoardUI = document.querySelector("#player-board");
  const enemyBoardUI = document.querySelector("#enemy-board");

  const player = createPlayer("player");
  const enemy = createPlayer("enemy");

  const playerShips = createShips();
  const enemyShips = createShips();

  const playerBoard = createGameBoard();
  const enemyBoard = createGameBoard();

  // Place player's ships
  // playerBoard.placeShips(0, 0, playerShips.battleship, "vertical");
  // playerBoard.placeShips(1, 0, playerShips.carrier, "vertical");
  // playerBoard.placeShips(2, 0, playerShips.destroyer, "vertical");
  // playerBoard.placeShips(3, 0, playerShips.patrolBoat, "vertical");
  // playerBoard.placeShips(4, 0, playerShips.submarine, "vertical");
  placePlayerShips(playerBoard, playerShips);

  // Place enemy's ships
  enemyBoard.placeShips(0, 0, enemyShips.battleship, "horizontal");
  enemyBoard.placeShips(0, 1, enemyShips.carrier, "horizontal");
  enemyBoard.placeShips(0, 2, enemyShips.destroyer, "horizontal");
  enemyBoard.placeShips(0, 3, enemyShips.patrolBoat, "horizontal");
  enemyBoard.placeShips(0, 4, enemyShips.submarine, "horizontal");

  // Create game boards UI
  createBoardUI("player", playerBoard, playerShips, playerBoardUI);
  createBoardUI("enemy", enemyBoard, enemyShips, enemyBoardUI);
  initializeGame;
  return {
    playerBoardUI,
    enemyBoardUI,
    player,
    enemy,
    playerShips,
    enemyShips,
    playerBoard,
    enemyBoard,
  };
};

const playerAttack = (gameData) => {
  const { enemyBoardUI, player, enemyShips, playerBoard, enemyBoard } =
    gameData;

  const enemyBoardUIChildren = enemyBoardUI.querySelectorAll("div");

  const removeClickListener = (x, y) => {
    const cellToUpdate = document.querySelector(`#enemy-board [id="${x}${y}"]`);
    cellToUpdate.removeEventListener("click", playerAttackResultHandler);
  };

  const waitForEnemyTurnToEnd = () => {
    enemyBoardUI.classList.add("unclickable");
    setTimeout(() => {
      enemyBoardUI.classList.remove("unclickable");
    }, 400);
  };

  const playerAttackResultHandler = (e) => {
    const [x, y] = e.target.id;
    const result = player.attack(enemyBoard, +x, +y, enemyShips);

    // Update UI based on result
    updateCellColor(x, y, "enemy", result);
    removeClickListener(x, y);

    if (gameOver(playerBoard, gameData.enemyBoard)) {
      console.log("Game over! Player wins!");
      gameData.playerBoardUI.classList.add("unclickable");
      enemyBoardUI.classList.add("unclickable");
      return;
    }
    setTimeout(() => {
      enemyAttack(gameData);
    }, 400);
    waitForEnemyTurnToEnd();
  };

  enemyBoardUIChildren.forEach((child) => {
    child.addEventListener("click", playerAttackResultHandler);
  });
};

const enemyAttack = (gameData) => {
  const { enemy, playerShips, playerBoard } = gameData;

  const randomMoveCoordinates = enemy.generateRandomMove(playerBoard);
  const [x, y] = randomMoveCoordinates;
  const result = enemy.attack(playerBoard, x, y, playerShips);

  updateCellColor(x, y, "player", result);

  if (gameOver(playerBoard, gameData.enemyBoard)) {
    console.log("Game over! Computer wins!");
    gameData.playerBoardUI.classList.add("unclickable");
    gameData.enemyBoardUI.classList.add("unclickable");
    return;
  }
};

const gameOver = (playerBoard, enemyBoard) => {
  return (
    playerBoard.checkIfAllShipsAreSunk() || enemyBoard.checkIfAllShipsAreSunk()
  );
};

const startGame = () => {
  const gameData = initializeGame();

  const overlay = document.querySelector(".overlay");
  overlay.classList.add("hidden");
  playerAttack(gameData)
};

const showStartGameButton = () => {
  const startButton = document.querySelector("#start-button");
  startButton.addEventListener("click", () => startGame());
  startButton.classList.remove("hidden");
};

const gameLoop = () => {
  createBoardToPlaceShipsUI();
};

gameLoop();

export { showStartGameButton };
